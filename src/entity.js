
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

class BoxBlock extends Entity
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.BOMB);
    }

    onExplosion()
    {
        this.destroy();
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

class ItemCrate extends Entity
{
    constructor(x, y, atlasIndex)
    {
        super(x, y, atlasIndex);
        this.setRectangularHitbox(
            0,
            16,
            0,
            8
        );

        this.onCollision = function(collisions)
        {
            let playerCollisions = collisions.filter(c => players.includes(c.collidee));
            if (playerCollisions.length > 0)
            {
                this.onPickup(playerCollisions[0].collidee);
                this.destroy();
            }
        }.bind(this);
    }

    onPickup(player)
    {
    }

    static getCrateTypes()
    {
        return [
            GrenadeCrate,
            DefaultGunCrate,
            FastGunCrate,
            SniperGunCrate,
            GrenadeGunCrate,
        ];
    }
}

class GrenadeCrate extends ItemCrate
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.GRENADE_CRATE);
    }

    onPickup(player)
    {
        player.refillGrenades();
    }
}

class DefaultGunCrate extends ItemCrate
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.DEFAULT_GUN_CRATE);
    }

    onPickup(player)
    {
        player.setGun(DEFAULT_BULLET);
    }
}

class FastGunCrate extends ItemCrate
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.FAST_GUN_CRATE);
    }

    onPickup(player)
    {
        player.setGun(FAST_BULLET);
    }
}

class SniperGunCrate extends ItemCrate
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.SNIPER_GUN_CRATE);
    }

    onPickup(player)
    {
        player.setGun(SNIPER_BULLET);
    }
}

class GrenadeGunCrate extends ItemCrate
{
    constructor(x, y)
    {
        super(x, y, ObjectAtlasIndex.GRENADE_GUN_CRATE);
    }

    onPickup(player)
    {
        player.setGun(GRENADE_BULLET);
    }
}
