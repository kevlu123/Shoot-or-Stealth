
class Circle
{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    // Creates a copy of this object
    clone()
    {
        return new Circle(
            this.x,
            this.y,
            this.r
        );
    }
}

class Rect
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    left()
    {
        return this.x;
    }

    top()
    {
        return this.y;
    }

    right()
    {
        return this.x + this.w;
    }

    bottom()
    {
        return this.y + this.h;
    }

    // Create a copy of this object
    clone()
    {
        return new Rect(
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
}

// Clamps x between min and max
function clamp(x, min, max)
{
    if (x < min)
        return min;
    else if (x > max)
        return max;
    else
        return x;
}

// Gets the sign of x. Returns -1, 0, or 1
function signof(x)
{
    if (x < 0)
        return -1;
    else if (x > 0)
        return 1;
    else
        return 0;
}

// Linear interpolation between a and b
function lerp(a, b, interpolation)
{
    return (b - a) * interpolation + a;
}

// Removes an item from an array
function removeFromArray(array, value)
{
    let index = array.indexOf(value);
    array.splice(index, 1);
}

function randInt(min, maxExcl)
{
    return Math.floor(Math.random() * (maxExcl - min) + min);
}

function randFloat(min, maxExcl)
{
    return Math.random() * (maxExcl - min) + min;
}

function randBool()
{
    return randInt(0, 2) === 1;
}

// Returns incr added to val, wrapped around a range
function wrappedIncrement(val, incr, min, maxExcl)
{
    return (val + incr) % (maxExcl - min) + min;
}

// Get the current time in seconds since epoch
function now()
{
    return Date.now() / 1000;
}

// Casts a ray and gets a list of sprites that the ray hits
function raycast(srcX, srcY, angle, collidableSpriteLists, range=100, step=4)
{
    // Calculate direction vector
    let dirX = Math.cos(angle);
    let dirY = Math.sin(angle);
    
    // Create sprite for collision test
    let ray = new PhysicsSprite();
    ray.setCircularHitbox(0, 0, 0.01);
    ray.addCollidableSpriteList(...collidableSpriteLists);

    let hits = new SpriteList();
    let dist = 0;
    do
    {
        // Get current ray position
        ray.x = srcX + dist * dirX;
        ray.y = srcY + dist * dirY;

        // Check collision
        hits = ray.getCollidingWith();

        // Move ray
        dist += step;
    }
    while (hits.length === 0 && dist < range);

    return hits;
}
