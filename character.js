
// Sprite class for player and enemies
class Character extends PhysicsSprite
{
    constructor(characterAtlasIndex, x, y, bulletType=DEFAULT_BULLET, isPlayer=true)
    {
        super();

        this._timesSinceShot = new Map(); // Keep track of each bullet type
        this._bulletType = bulletType;
        this._isPlayer = isPlayer;
        this.walkSpeed = PLAYER_WALK_SPEED;

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
    }

    update()
    {
        super.update();

        // Add delta time to each value in _timesSinceShot
        let entries = Array.from(this._timesSinceShot.entries());
        for (let [key, val] of entries)
            this._timesSinceShot.set(key, val + FRAME_DURATION);
    }

    moveLeft()
    {
        this.velX -= this.walkSpeed;
        this.flippedX = true;
    }

    moveRight()
    {
        this.velX += this.walkSpeed;
        this.flippedX = false;
    }

    jump()
    {
        this.velY = JUMP_VELOCITY;
    }

    // Creates a bullet if cooldown has passed
    shoot(bulletType=this._bulletType)
    {
        if (this._timesSinceShot.has(bulletType) && this._timesSinceShot.get(bulletType) <= bulletType.cooldown)
            return;
        this._timesSinceShot.set(bulletType, 0);
        
        // Get spawn position
        let spawnX = this.x;
        let spawnY = this.y + 2 + randInt(0, bulletType.spread) - bulletType.spread / 2;
        if (this.flippedX)
            spawnX -= TILE_SIZE;
        else
            spawnX += TILE_SIZE;
            
        // Get initial velocity
        let velX;
        let velY = bulletType.velY;
        if (this.flippedX)
            velX = -bulletType.velX;
        else
            velX = bulletType.velX;
    
        // Create bullet
        let bullet = new Bullet(
            this._isPlayer,
            bulletType.atlasIndex,
            spawnX,
            spawnY,
            velX,
            velY,
            bulletType.damage,
            bulletType.range
        );
        bullet.flippedX = this.flippedX;

        // Set oncollision callback
        bullet.oncollision = () => bulletType.oncollision(bullet);

        // Set hitbox
        if (bulletType.useCircularHitbox)
            bullet.setCircularHitbox(...bulletType.hitbox);
        else
            bullet.setRectangularHitbox(...bulletType.hitbox);
    
        // Set physics properties
        if (bulletType.usePhysics)
        {
            bullet.flippedX = false;
            bullet.useGravity = true;
            bullet.bouncynessX = bulletType.bouncyness;
            bullet.bouncynessY = bulletType.bouncyness;
            bullet.collisionDampingX = BULLET_COLLISION_DAMPING;

            bullet.rotationPivotX = bulletType.hitbox[0];
            bullet.rotationPivotY = bulletType.hitbox[1];
            bullet.angularVel = signof(bullet.velX) * BULLET_ANGULAR_VELOCITY;
            bullet.angularDamping = BULLET_ANGULAR_DAMPING;
        }

        bullets.push(bullet);
    }
}

class Enemy extends Character
{
    constructor(characterAtlasIndex, x, y, bulletType=DEFAULT_BULLET)
    {
        super(characterAtlasIndex, x, y, bulletType, false);

        this.dampingX = ENEMY_DAMPING_X;
        this.walkSpeed = ENEMY_WALK_SPEED;
        this._triggered = false;
    }

    update()
    {
        // If enemy has seen the player, walk and shoot
        if (this._triggered)
        {
            let curTime = now();
        
            if (curTime >= this._walkTime)
            {
                // Stop walking and set data for next walk
                if (curTime >= this._walkTime + this._walkDuration)
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
            if (curTime >= this._shootTime)
            {
                // Stop shooting and set data for next shoot
                if (curTime >= this._shootTime + this._shootDuration)
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
                this._bulletType.range
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
        this._walkTime = now() + randFloat(ENEMY_WALK_INTERVAL_MIN, ENEMY_WALK_INTERVAL_MAX);
        this._walkDuration = randFloat(ENEMY_WALK_DURATION_MIN, ENEMY_WALK_DURATION_MAX);
    }

    _prepareShoot()
    {
        this._shootTime = now() + randFloat(ENEMY_SHOOT_INTERVAL_MIN, ENEMY_SHOOT_INTERVAL_MAX);
        this._shootDuration = randFloat(ENEMY_SHOOT_DURATION_MIN, ENEMY_SHOOT_DURATION_MAX);
    }
}
