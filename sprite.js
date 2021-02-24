
// Represents a part of an image. Useful for sprite sheets.
class ImageView
{
    constructor(filename, x, y, w, h)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = w;
        this.height = h;
        this.flippedX = false;

        // Load image
        this._image = new Image();
        this._image.onload = this._onload.bind(this);
        this._image.src = filename;

        // Wait for image to load
        while (this.width === undefined) {}
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

// Represents a 2D image in space
class Sprite
{
    constructor(filename)
    {
        if (filename)
            this.setImageView(new ImageView(filename));
        else
            this.setCircularHitbox(0);

        this.x = 0;
        this.y = 0;
    }

    // Create a sprite of type spriteClass from an ImageView
    static fromImageView(imageView, spriteClass=Sprite)
    {
        let sprite = new spriteClass();
        sprite.setImageView(imageView);
        return sprite;
    }

    getImageView()
    {
        return this._imageView;
    }

    setImageView(imageView)
    {
        this._imageView = imageView;
        this.setRectangularHitbox(
            -imageView.width / 2,
            imageView.width / 2,
            -imageView.height / 2,
            imageView.height / 2,
        );
    }

    // Set an axis aligned rectangular hitbox relative to the pivot
    setRectangularHitbox(left, right, top, bottom)
    {
        this._hasCircularHitbox = false;
        this._hitbox = new Rect(
            left,
            top,
            right - left,
            bottom - top
        );
    }

    // Set a circular hitbox around the pivot
    setCircularHitbox(radius)
    {
        this._hasCircularHitbox = true;
        this._hitbox = radius;
    }

    // Checks for collision with another sprite
    checkCollisionWithSprite(sprite)
    {
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
            let distSq = (thisX - spriteX) ** 2 + (thisY - spriteY) ** 2;
            return distSq < (this._hitbox + sprite._hitbox) ** 2;
        }
        else
        {
            // Rectangle/Circle

            let rect;
            let radius, circX, circY;
            if (sprite._hasCircularHitbox)
            {
                rect = this._hitbox.clone();
                rect.x += thisX;
                rect.y += thisY;

                radius = sprite._hitbox;
                circX = spriteX;
                circY = spriteY;
            }
            else
            {
                rect = sprite._hitbox.clone();
                rect.x += spriteX;
                rect.y += spriteY;

                radius = this._hitbox;
                circX = thisX;
                circY = thisY;
            }

            // Find the nearest point in the rectangle to the circle
            let nearestX = clamp(circX, rect.left(), rect.right());
            let nearestY = clamp(circY, rect.top(), rect.bottom());

            // If this point is inside the circle, there is a collision
            let distSq = (circX - nearestX) ** 2 + (circY - nearestY) ** 2;
            return distSq < radius ** 2;
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
        this.velX = 0;
        this.velY = 0;
        this.useGravity = false;
        this.collidableSprites = []
        this.oncollision = null;

        this._groundedState = 0;
    }

    // Applies velocity and gravity and checks for collision
    update(deltaTime)
    {
        if (this._groundedState > 0)
            this._groundedState -= deltaTime;

        // Apply gravity
        if (this.useGravity)
            this.velY += GRAVITY_STRENGTH * deltaTime;

        // Velocity damping
        this.velX *= Math.pow(DAMPING_X, deltaTime);

        // Move in y axis
        this.y += this.velY * deltaTime;
        let collidingWithY = this._getCollidingWith();
        if (collidingWithY.length > 0)
        {
            // If collided, reset velocity and move back until not colliding
            let velSign = signof(this.velY);
            this.velY = 0;
            do
            {
                this.y -= velSign;
            } while (this._isColliding());
            
            // If collided while moving down, the sprite is grounded
            if (velSign < 0)
                this._groundedState = COYOTE_JUMP_TIME;
        }

        // Move in X axis
        this.x += this.velX * deltaTime;
        let collidingWithX = this._getCollidingWith();
        if (collidingWithX.length > 0)
        {
            // If collided, reset velocity and move back until not colliding
            let velSign = signof(this.velX);
            this.velX = 0;
            do
            {
                this.x -= velSign;
            } while (this._isColliding());
        }

        // Call oncollision event
        if (this.oncollision !== null)
        {
            let collidingWith = collidingWithX;
            collidingWith.push(...collidingWithY);
            if (collidingWith.length > 0)
                this.oncollision(collidingWith);
        }
    }

    isGrounded()
    {
        return this.useGravity && this._groundedState > 0;
    }

    // Checks if this sprite is colliding with any of collidableSprites
    _isColliding()
    {
        return this.checkCollisionWithSprites(this.collidableSprites);
    }

    // Gets the sprites which are coliding with this
    _getCollidingWith()
    {
        return this.getCollisionWithSprites(this.collidableSprites);
    }
}
