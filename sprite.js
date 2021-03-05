
// Represents a part of an image. Useful for sprite sheets.
class ImageView
{
    constructor(filename, x, y, w, h)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = w;
        this.height = h;

        // Load image
        this._image = new Image();
        this._image.onload = this._onload.bind(this);
        this._image.src = filename;

        // Wait for image to load
        while (this.width === undefined) {}
    }

    // Create an ImageView from a single row sprite atlas.
    // Sprites must be TILE_SIZE by TILE_SIZE resolution.
    static fromAtlas(filename, index)
    {
        return new ImageView(
            filename,
            TILE_SIZE * index,
            0,
            TILE_SIZE,
            TILE_SIZE
        );
    }

    // Get full underlying image
    getImage()
    {
        return this._image;
    }

    // Set width and height once image is loaded
    _onload()
    {
        if (this.width === undefined || this.height === undefined)
        {
            this.width = this._image.width;
            this.height = this._image.height;
        }
    }
}

// Unordered collection of sprites
class SpriteList
{
    constructor(sprites=[])
    {
        this._sprites = sprites;
    }

    // Allow use in for...of loop
    [Symbol.iterator]()
    {
        return this._sprites.values();
    }

    // Add sprite to list
    push(sprite)
    {
        this._sprites.push(sprite);
        sprite._spriteLists.push(this);
    }

    // Returns a new SpriteList from sprites in this list which satisfy a predicate
    filter(predicate)
    {
        return new SpriteList(this._sprites.filter(predicate));
    }
}

// Represents a 2D image in space
class Sprite
{
    constructor(filename)
    {
        this._imageView = null;
        if (filename)
            this.setImageView(new ImageView(filename));
        else
            this.setCircularHitbox(0);

        this.x = 0;
        this.y = 0;
        this.flippedX = false;
        this._spriteLists = [];
    }

    // Create a sprite of type spriteClass from an ImageView
    static fromImageView(imageView, spriteClass=Sprite)
    {
        let sprite = new spriteClass();
        sprite.setImageView(imageView);
        return sprite;
    }

    destroy()
    {
        for (let list of this._spriteLists)
            removeFromArray(list._sprites, this);
        this._spriteLists = [];
    }

    getImageView()
    {
        return this._imageView;
    }

    setImageView(imageView)
    {
        this._imageView = imageView;
        this.setRectangularHitbox(
            0,
            imageView.width,
            0,
            imageView.height
        );
    }

    // Set an axis aligned rectangular hitbox relative to the pivot
    setRectangularHitbox(left, right, bottom, top)
    {
        this._hasCircularHitbox = false;
        this._hitbox = new Rect(
            left,
            bottom,
            right - left,
            top - bottom
        );
    }

    // Set a circular hitbox
    setCircularHitbox(x, y, r)
    {
        this._hasCircularHitbox = true;
        this._hitbox = new Circle(x, y, r);
    }

    // Checks for collision with another sprite
    checkCollisionWithSprite(sprite)
    {
        // Can't collide with self
        if (sprite === this)
            return false;

        let thisX = Math.floor(this.x);
        let thisY = Math.floor(this.y);
        let spriteX = Math.floor(sprite.x);
        let spriteY = Math.floor(sprite.y);

        if (!this._hasCircularHitbox && !sprite._hasCircularHitbox)
        {
            // Rectangle/Rectangle
            let r1 = this._hitbox.clone();
            r1.x += thisX;
            r1.y += thisY;
            let r2 = sprite._hitbox.clone();
            r2.x += spriteX;
            r2.y += spriteY;
            return !(r2.left() >= r1.right()
                || r2.right()  <= r1.left()
                || r2.top()    >= r1.bottom()
                || r2.bottom() <= r1.top());
        }
        else if (this._hasCircularHitbox && sprite._hasCircularHitbox)
        {
            // Circle/Circle
            thisX += this._hitbox.x;
            thisY += this._hitbox.y;
            spriteX += this._hitbox.x;
            spriteY += this._hitbox.y;
            let distSq = (thisX - spriteX) ** 2 + (thisY - spriteY) ** 2;
            return distSq < (this._hitbox.r + sprite._hitbox.r) ** 2;
        }
        else
        {
            // Rectangle/Circle

            let rect;
            let circle;
            if (sprite._hasCircularHitbox)
            {
                rect = this._hitbox.clone();
                rect.x += thisX;
                rect.y += thisY;

                circle = sprite._hitbox.clone();
                circle.x += spriteX;
                circle.y += spriteY;
            }
            else
            {
                rect = sprite._hitbox.clone();
                rect.x += spriteX;
                rect.y += spriteY;

                circle = this._hitbox.clone();
                circle.x += thisX;
                circle.y += thisY;
            }

            // Find the nearest point in the rectangle to the circle
            let nearestX = clamp(circle.x, rect.left(), rect.right());
            let nearestY = clamp(circle.y, rect.top(), rect.bottom());

            // If this point is inside the circle, there is a collision
            let distSq = (circle.x - nearestX) ** 2 + (circle.y - nearestY) ** 2;
            return distSq < circle.r ** 2;
        }
    }

    // Checks for collision against a list of sprites
    checkCollisionWithSprites(sprites)
    {
        for (let sprite of sprites)
            if (this.checkCollisionWithSprite(sprite))
                return true;
        return false;
    }

    // Returns a list of sprites which are colliding with this
    getCollisionWithSprites(sprites)
    {
        let colliding = [];
        for (let sprite of sprites)
            if (this.checkCollisionWithSprite(sprite))
                colliding.push(sprite);
        return colliding;
    }
}

// Moving sprite that is affected by collisions
class PhysicsSprite extends Sprite
{
    constructor(filename)
    {
        super(filename);

        // Translational properties
        this.velX = 0;
        this.velY = 0;
        this.dampingX = 1;
        this.dampingY = 1;
        this.bouncynessX = 0;
        this.bouncynessY = 0;
        this.useGravity = false;

        // Rotational properties
        this.rotationPivotX = 0;
        this.rotationPivotY = 0;
        this.angle = 0;
        this.angularVel = 0;
        this.angularDamping = 1;
        
        // Collision properties
        this.collidableSprites = [];
        this.uncollidableSprites = []; // Takes priority over collidableSprites
        this.oncollision = null;
        this.collisionDampingX = 1;
        this.collisionDampingY = 1;
        this.angularCollisionDamping = 1;

        this._groundedState = 0;
    }

    // Applies velocity and gravity and checks for collision
    update()
    {
        if (this._groundedState > 0)
            this._groundedState -= FRAME_DURATION;

        // Apply gravity
        if (this.useGravity)
            this.velY += GRAVITY_STRENGTH;

        // Velocity and angular velocity damping
        this.velX *= this.dampingX;
        this.velY *= this.dampingY;
        this.angularVel *= this.angularDamping;

        let collidingWithX = [];
        let collidingWithY = [];

        // Move in y axis
        let velYSign = signof(this.velY);
        if (this.velY !== 0)
        {
            this.y += this.velY;
            collidingWithY = this.getCollidingWith();
            if (collidingWithY.length > 0)
            {
                // If collided and move back until not colliding
                do
                {
                    this.y -= velYSign;
                } while (this.isColliding());
                
                // If collided while moving down, the sprite is grounded
                if (velYSign < 0)
                    this._groundedState = COYOTE_JUMP_TIME;

                // Bounce off
                this.velY *= -this.bouncynessY;
            }
        }

        // Move in X axis
        let velXSign = signof(this.velX);
        if (this.velX)
        {
            this.x += this.velX;
            collidingWithX = this.getCollidingWith();
            if (collidingWithX.length > 0)
            {
                // If collided and move back until not colliding
                do
                {
                    this.x -= velXSign;
                } while (this.isColliding());
                
                // Bounce off
                this.velX *= -this.bouncynessX;
            }
        }
        
        // Apply angular velocity
        this.angle += this.angularVel;

        // Collisions
        let collidingWith = [];
        collidingWith.push(...collidingWithX);
        collidingWith.push(...collidingWithY);
        if (collidingWith.length > 0)
        {
            // Apply collision damping
            this.velX *= this.collisionDampingX;
            this.velY *= this.collisionDampingY;
            this.angularVel *= this.angularCollisionDamping;
            
            // Reverse rotation if rotating against a surface
            if (collidingWithX.length > 0 && (velXSign > 0) != (signof(this.angularVel) !== velYSign))
                this.angularVel *= -1;
            else if (collidingWithY.length > 0 && (velYSign > 0) != (signof(this.angularVel) === velXSign))
                this.angularVel *= -1;

            // Call oncollision event
            if (this.oncollision !== null)
                this.oncollision(collidingWith);
        }
    }

    setImageView(imageView)
    {
        super.setImageView(imageView);
        this.rotationPivotX = imageView.width / 2;
        this.rotationPivotY = imageView.height / 2;
    }

    checkCollisionWithSprite(sprite)
    {
        if (this.uncollidableSprites.includes(sprite))
            return false;
        else
            return super.checkCollisionWithSprite(sprite);
    }

    isGrounded()
    {
        return this.useGravity && this._groundedState > 0;
    }

    // Checks if this sprite is colliding with any of collidableSprites
    isColliding()
    {
        return this.checkCollisionWithSprites(this.collidableSprites);
    }

    // Gets the sprites which are coliding with this
    getCollidingWith()
    {
        return this.getCollisionWithSprites(this.collidableSprites);
    }
}
