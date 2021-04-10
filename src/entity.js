
class Entity extends PhysicsSprite
{
    constructor(x, y, atlasIndex)
    {
        super();
        this.x = x;
        this.y = y;
        this.useGravity = true;
        this.addCollidableSpriteList(levelTiles);
        this.addCollidableSpriteList(entities);
        this.setImageView(ImageView.fromAtlas(
            OBJECT_ATLAS_FILENAME,
            atlasIndex
        ));
    }
}

class BombBlock extends Entity
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.BOMB);
        this._willExplode = false;
    }

    onShot(bulletType)
    {
        // Explode if shot by bullet that is not a grenade
        if (bulletType != GRENADE_BULLET)
            this._explode();
    }

    onExplosion()
    {
        this._explode();
    }

    _explode()
    {
        // Destroy this and create another explosion
        if (!this._willExplode)
        {
            this._willExplode = true;
            Timer.addTimer(BOMB_EXPLOSION_DELAY, function()
            {
                // Check if this still exists
                if (!this.isDestroyed())
                {
                    this.destroy();
                    createExplosion(this.x, this.y);
                }
            }.bind(this));
        }
    }
}
