
// Sprite class for player and enemies
class Character extends PhysicsSprite
{
    constructor(characterAtlasIndex, x, y, bulletType=DEFAULT_BULLET)
    {
        super();

        this._bulletType = bulletType;
        this._timeSinceShot = bulletType.cooldown;
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

        this._timeSinceShot += FRAME_DURATION;
    }

    // Returns a bullet if cooldown has passed, otherwise null
    shoot()
    {
        if (this._timeSinceShot <= this._bulletType.cooldown)
            return null;
        this._timeSinceShot = 0;

        // Get spawn position
        let spawnX = this.x;
        let spawnY = this.y + 2 + randInt(-1, 2);
        if (this.flippedX)
            spawnX -= TILE_SIZE / 2;
        else
            spawnX += TILE_SIZE / 2;
    
        // Create bullet
        let bullet = new Bullet(
            this,
            this._bulletType.atlasIndex,
            spawnX,
            spawnY
        );
        
        bullet.useGravity = this._bulletType.useGravity;

        // Set hitbox
        if (this._bulletType.useCircularHitbox)
            bullet.setCircularHitbox(this._bulletType.hitbox);
        else
            bullet.setRectangularHitbox(...this._bulletType.hitbox);
    
        // Set initial velocity
        bullet.velY = this._bulletType.velY;
        if (this.flippedX)
            bullet.velX = -this._bulletType.velX;
        else
            bullet.velX = this._bulletType.velX;
    
        return bullet;
    }
}
