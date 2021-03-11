
// Sprite class for bullets/grenades
class Bullet extends PhysicsSprite
{
    constructor(isPlayerBullet, tileAtlasIndex, x, y, velX, velY, damage, range)
    {
        super();

        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this._startX = x;
        this._startY = y;
        this._damage = damage;
        this._range = range;
        this.setImageView(ImageView.fromAtlas(TILE_ATLAS_FILENAME, tileAtlasIndex));

        // If spawned in wall, try to move out
        while (this.isColliding())
            this.x -= signof(this.velX);

        if (isPlayerBullet)
            this.addCollidableSpriteList(enemies);
        else
            this.addCollidableSpriteList(players);
    }

    update()
    {
        super.update();

        if (this._range !== null)
        {
            // Destroy bullet when it has travelled too far
            let distSq = (this._startX - this.x) ** 2 + (this._startY - this.y) ** 2;
            if (distSq > this._range ** 2)
                this.destroy();
        }
    }
}
