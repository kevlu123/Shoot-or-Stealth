
// Sprite class for bullets/grenades
class Bullet extends PhysicsSprite
{
    constructor(owner, tileAtlasIndex, x, y, range)
    {
        super();

        this.x = x;
        this.y = y;
        this._startX = x;
        this._startY = y;
        this._active = true;
        this._range = range;
        this.uncollidableSprites = [owner];

        this.setImageView(ImageView.fromAtlas(TILE_ATLAS_FILENAME, tileAtlasIndex));
    }

    update()
    {
        // Only update if bullet is active
        if (!this._active)
            return;

        super.update();

        // Deactivate bullet when it has travelled too far
        let distSq = (this._startX - this.x) ** 2 + (this._startY - this.y) ** 2;
        if (distSq > this._range ** 2)
            this._active = false;
    }

    // Checks if the bullet has not despawned due to moving too far away
    isActive()
    {
        return this._active;
    }
}
