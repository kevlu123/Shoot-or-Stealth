
// Base sprite class for player and enemies
class Character extends PhysicsSprite
{
    constructor(characterAtlasIndex, x, y, bulletType, isPlayer, hp)
    {
        super();

        this._timesSinceShot = new Map(); // Keep track of each bullet type
        this._isPlayer = isPlayer;
        this._hp = hp;
        this._dead = false;

        this.walkSpeed = PLAYER_WALK_SPEED;
        this.bulletType = bulletType;

        this.x = x;
        this.y = y;
        this.useGravity = true;
        this.dampingX = PLAYER_DAMPING_X;
        this.setImageView(ImageView.fromAtlas(CHARACTER_ATLAS_FILENAME, characterAtlasIndex));
        this.setRectangularHitbox(
            1,
            TILE_SIZE - 1,
            0,
            TILE_SIZE
        );

        this.addCollidableSpriteList(levelTiles);
        this.addCollidableSpriteList(entities);
    }

    update()
    {
        super.update();

        // Add delta time to each value in _timesSinceShot
        let entries = Array.from(this._timesSinceShot.entries());
        for (let [key, val] of entries)
            this._timesSinceShot.set(key, val + FRAME_DURATION);
    }

    isDead()
    {
        return this._dead;
    }

    damage(amount)
    {
        if (this._dead)
            return;

        this._hp -= amount;
        if (this._hp <= 0)
            this._die();
    }

    moveLeft()
    {
        if (this._dead)
            return;

        this.velX -= this.walkSpeed;
        this.flippedX = true;
    }

    moveRight()
    {
        if (this._dead)
            return;

        this.velX += this.walkSpeed;
        this.flippedX = false;
    }

    jump()
    {
        if (this._dead)
            return;

        this.velY = JUMP_VELOCITY;
    }

    // Creates a bullet if cooldown has passed
    shoot(bulletType=this.bulletType)
    {
        if (this._dead)
            return;

        if (this._timesSinceShot.has(bulletType) && this._timesSinceShot.get(bulletType) <= bulletType.cooldown)
            return;
        this._timesSinceShot.set(bulletType, 0);
        
        // Get spawn position
        let spawnX = this.x;
        let spawnY = this.y + BULLET_SPAWN_OFFSET_Y + randInt(0, bulletType.spread) - bulletType.spread / 2;
        if (this.flippedX)
            spawnX -= TILE_SIZE;
        else
            spawnX += TILE_SIZE;
    
        // Create bullet
        let bullet = new Bullet(
            spawnX,
            spawnY,
            this._isPlayer,
            bulletType,
            this.flippedX
        );

        if (bulletType.usePhysics)
            this.addCollidableSpriteList(entities);
        bullets.push(bullet);
    }

    _die()
    {
        if (this._dead)
            return;

        this._dead = true;
        this.angle = Math.PI / 2;
        this.dampingX = DIE_DAMPING_X;

        this.rotationPivotY--;
        this._hitbox.y++;
    }
}

// Base sprite class for enemies
class Enemy extends Character
{
    constructor(characterAtlasIndex, x, y, bulletType)
    {
        super(characterAtlasIndex, x, y, bulletType, false, ENEMY_HP);

        this.dampingX = ENEMY_DAMPING_X;
        this.walkSpeed = ENEMY_WALK_SPEED;
        this._triggered = false;
    }

    update()
    {
        // If enemy has seen the player, walk and shoot
        if (this._triggered)
        {
            if (time >= this._walkTime)
            {
                // Stop walking and set data for next walk
                if (time >= this._walkTime + this._walkDuration)
                    this._prepareWalk();
                
                else if (this.isGrounded())
                {
                    // Cast a ray in front of enemy
                    let rayAngle = -Math.PI / 2;
                    rayAngle += this._walkLeft ? -ENEMY_RAYCAST_ANGLE : ENEMY_RAYCAST_ANGLE;
                    let hits = raycast(
                        this.x + TILE_SIZE / 2,
                        this.y + TILE_SIZE / 2,
                        rayAngle,
                        [levelTiles],
                        TILE_SIZE,
                        TILE_SIZE - 1
                    );

                    // Walk if there is floor in front and enemy is grounded
                    if (hits.length > 0)
                    {
                        if (this._walkLeft)
                            this.moveLeft();
                        else
                            this.moveRight();
                    }
                }
            }

            // Shoot
            if (time >= this._shootTime)
            {
                // Stop shooting and set data for next shoot
                if (time >= this._shootTime + this._shootDuration)
                    this._prepareShoot();
                else
                    this.shoot();
            }
        }
        else
        {
            // If player is in vision, trigger enemy
            let hits = raycast(
                this.x + TILE_SIZE / 2,
                this.y + TILE_SIZE / 2,
                this.flippedX ? Math.PI : 0,
                [levelTiles, players],
                this.bulletType.range
            );

            if (hits.some(hit => players.includes(hit)))
            {
                this._triggered = true;
                this._prepareWalk();
                this._prepareShoot();
                this._walkTime = randFloat(0, ENEMY_WALK_INTERVAL_MAX);
                this._shootTime = randFloat(0, ENEMY_SHOOT_INTERVAL_MAX);
            }
        }

        super.update();
    }

    _prepareWalk()
    {
        this._walkLeft = randBool();
        this._walkTime = time + randFloat(ENEMY_WALK_INTERVAL_MIN, ENEMY_WALK_INTERVAL_MAX);
        this._walkDuration = randFloat(ENEMY_WALK_DURATION_MIN, ENEMY_WALK_DURATION_MAX);
    }

    _prepareShoot()
    {
        this._shootTime = time + randFloat(ENEMY_SHOOT_INTERVAL_MIN, ENEMY_SHOOT_INTERVAL_MAX);
        this._shootDuration = randFloat(ENEMY_SHOOT_DURATION_MIN, ENEMY_SHOOT_DURATION_MAX);
    }
}

class Enemy1 extends Enemy
{
    constructor(x, y)
    {
        super(CharacterAtlasIndex.ENEMY1_1, x, y, DEFAULT_BULLET);
    }
}

class Enemy2 extends Enemy
{
    constructor(x, y)
    {
        super(CharacterAtlasIndex.ENEMY2_1, x, y, FAST_BULLET);
    }
}

class Enemy3 extends Enemy
{
    constructor(x, y)
    {
        super(CharacterAtlasIndex.ENEMY3_1, x, y, SNIPER_BULLET);
    }
}

class Player extends Character
{
    constructor(x, y)
    {
        super(CharacterAtlasIndex.PLAYER_1, x, y, DEFAULT_BULLET, true, PLAYER_HP);
    }
}