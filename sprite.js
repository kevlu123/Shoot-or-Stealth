
// Represents a part of an image. Useful for sprite sheets.
class ImageView
{
    constructor(filename, x, y, w, h)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = w ?? 0;
        this.height = h ?? 0;
        this.flippedX = false;

        // Load image and width and height asynchronously
        this._image = new Image();
        if (!w || !h)
            this._image.onload = this._onload.bind(this);
        this._image.src = filename;
    }

    // Get full underlying image
    getImage()
    {
        return this._image;
    }

    // Set width and height once image is loaded
    _onload()
    {
        this.width = this._image.width;
        this.height = this._image.height;
    }
}

// Represents a 2D image in space
class Sprite
{
    constructor(filename)
    {
        if (filename)
            this.imageView = new ImageView(filename);
        this.x = 0;
        this.y = 0;
    }

    // Create a sprite from an ImageView
    static fromImageView(imageView)
    {
        let sprite = new Sprite();
        sprite.imageView = imageView;
        return sprite;
    }
}
