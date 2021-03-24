
// Sprite class for bullets/grenades
class Bullet extends PhysicsSprite
{
    constructor(x, y, isPlayerBullet, bulletType, facingLeft)
    {
        super();

        this.x = x;
        this.y = y;
        this.velX = bulletType.velX;
        if (facingLeft)
            this.velX *= -1;
        this.velY = bulletType.velY;
        this.flippedX = facingLeft && !bulletType.usePhysics;
        this._startX = x;
        this._startY = y;
        this._damage = bulletType.damage;
        this._range = bulletType.range;
        this.setImageView(ImageView.fromAtlas(
            OBJECT_ATLAS_FILENAME,
            bulletType.atlasIndex,
            bulletType.atlasRect.x,
            bulletType.atlasRect.y,
            bulletType.atlasRect.w,
            bulletType.atlasRect.h
        ));

        // Set oncollision callback
        let self = this;
        this.oncollision = function(collisions)
        {
            for (let collision of collisions)
            {
                let sprite = collision.collidee;
                if ("damage" in sprite)
                {
                    sprite.damage(bulletType.damage);
                    if (sprite.isDead())
                    {
                        sprite.velX = DIE_VELOCITY_X * signof(collision.relVelX);
                        sprite.velY = DIE_VELOCITY_Y;
                    }
                    
                    let imageView = ImageView.fromAtlas(
                        TILE_ATLAS_FILENAME,
                        TileAtlasIndex.GRENADE_BULLET, //... placeholder
                        0,
                        0,
                        GRENADE_BULLET.atlasRect.w,
                        GRENADE_BULLET.atlasRect.h
                    );

                    BloodBurstParticle.create(
                        collision.x,
                        collision.y
                    );
                }
                
                bulletType.oncollision(collision);
            }
        }

        // Set hitbox
        this.setRectangularHitbox(
            bulletType.atlasRect.x,
            bulletType.atlasRect.x + bulletType.atlasRect.w,
            bulletType.atlasRect.y,
            bulletType.atlasRect.y + bulletType.atlasRect.h,
        );
        if (bulletType.useCircularHitbox)
            this.setCircularHitbox();
    
        // Set physics properties
        if (bulletType.usePhysics)
        {
            this.flippedX = false;
            this.useGravity = true;
            this.bouncynessX = bulletType.bouncyness;
            this.bouncynessY = bulletType.bouncyness;
            this.collisionDampingX = BULLET_COLLISION_DAMPING;

            this.angularVel = signof(this.velX) * BULLET_ANGULAR_VELOCITY;
            this.angularDamping = BULLET_ANGULAR_DAMPING;

            // Check if there is space for bullet to spawn
            this.ejectCollision();
            if (distanceSqr(this._startX, this._startY, this.x, this.y) > BULLET_SPAWN_DISTANCE_THRESHOLD ** 2)
            {
                this.destroy();
                return;
            }
        }

        // If spawned in wall, try to move out
        while (this.isColliding())
            this.x -= signof(this.velX);

        this.addCollidableSpriteList(levelTiles);
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
            let distSq = distanceSqr(this._startX, this._startY, this.x, this.y);
            if (distSq > this._range ** 2)
                this.destroy();
        }
    }
}
