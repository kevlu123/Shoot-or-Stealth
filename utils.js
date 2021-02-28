
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

// Python's list comprehension
function listComp(iterable, selector)
{
    let li = [];
    for (let x of iterable)
        li.push(selector(x));
    return li;
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
