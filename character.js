
// Sprite class for player and enemies
class Character extends PhysicsSprite
{
    constructor(characterAtlasIndex, x, y, bulletType=DEFAULT_BULLET)
    {
        super();

        this._timesSinceShot = new Map(); // Keep track of each bullet type
        this.bulletType = bulletType;
        this.x = x;
        this.y = y;
        this.useGravity = bulletType.useGravity;
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

    // Returns a bullet if cooldown has passed, otherwise null
    shoot(bulletType=this.bulletType)
    {
        if (this._timesSinceShot.has(bulletType) && this._timesSinceShot.get(bulletType) <= bulletType.cooldown)
            return null;
        this._timesSinceShot.set(bulletType, 0);
        
        // Get spawn position
        let spawnX = this.x;
        let spawnY = this.y + 2 + randInt(0, bulletType.spread) - bulletType.spread / 2;
        if (this.flippedX)
            spawnX -= TILE_SIZE;
        else
            spawnX += TILE_SIZE;
    
        // Create bullet
        let bullet = new Bullet(
            this,
            bulletType.atlasIndex,
            spawnX,
            spawnY,
            bulletType.damage,
            bulletType.range
        );
        bullet.flippedX = this.flippedX;

        // Set oncollision callback
        bullet.oncollision = function(collidedWith)
        {
            onBulletCollision(collidedWith);
            bulletType.oncollision(bullet);
        };

        // Set hitbox
        if (bulletType.useCircularHitbox)
            bullet.setCircularHitbox(...bulletType.hitbox);
        else
            bullet.setRectangularHitbox(...bulletType.hitbox);
    
        // Set initial velocity
        bullet.velY = bulletType.velY;
        if (this.flippedX)
            bullet.velX = -bulletType.velX;
        else
            bullet.velX = bulletType.velX;
    
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

        return bullet;
    }
}
