
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
        this.destroy();
        createExplosion(this.x, this.y);
    }
}
