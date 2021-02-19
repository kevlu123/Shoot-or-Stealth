
// Manages graphics
class Graphics
{
    constructor(canvas)
    {
        // Get graphics context to draw to
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
    }

    // Fills the entire canvas with a colour.
    // Parameter colour is an an rgb array with values 0-255
    drawBackground(colour)
    {
        this._ctx.fillStyle = this._rgb(colour);
        this._ctx.fillRect(0, 0, this.width(), this.height());
    }

    // Draws a sprite
    drawSprite(sprite)
    {
        // Disable antialiasing before drawing
        this._ctx.imageSmoothingEnabled = false;

        if (!sprite.flippedX)
        {
            this._ctx.drawImage(
                sprite.imageView.getImage(),
                sprite.imageView.x,
                sprite.imageView.y,
                sprite.imageView.width,
                sprite.imageView.height,
                sprite.x,
                sprite.y,
                sprite.imageView.width * PIXEL_SIZE,
                sprite.imageView.height * PIXEL_SIZE,
            );
        }
        else
        {
            this._ctx.save();
            this._ctx.scale(-1, 1);
            this._ctx.drawImage(
                sprite.imageView.getImage(),
                sprite.imageView.x,
                sprite.imageView.y,
                sprite.imageView.width,
                sprite.imageView.height,
                -sprite.x,
                sprite.y,
                -sprite.imageView.width * PIXEL_SIZE,
                sprite.imageView.height * PIXEL_SIZE,
            );
            this._ctx.restore();
        }
    }

    // Get the width of the canvas
    width()
    {
        return this._canvas.width;
    }

    // Get the height of the canvas
    height()
    {
        return this._canvas.height;
    }

    // Converts an rgb array with values 0-255 to a string representing a colour
    _rgb(colour)
    {
        return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
    }
}
