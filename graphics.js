
// Manages graphics
class Graphics
{
    constructor(canvas)
    {
        // Get graphics context to draw to
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");

        this.x = 0;
        this.y = 0;
        this.target = null;
    }

    update()
    {
        let targetX = this.target?.x ?? 0;
        let targetY = this.target?.y ?? 0;

        this.x = lerp(this.x, targetX, CAMERA_LERP);
        this.y = lerp(this.y, targetY, CAMERA_LERP);
    }

    // Fills the entire canvas with a colour.
    // Parameter colour is an an rgb array with values 0-255
    drawBackground(colour)
    {
        this._ctx.fillStyle = Graphics._rgb(colour);
        this._ctx.fillRect(0, 0, this.width(), this.height());
    }

    // Draws a sprite
    drawSprite(sprite)
    {
        // Disable antialiasing before drawing
        this._ctx.imageSmoothingEnabled = false;

        let imageView = sprite.getImageView();
        let dstX =  PIXEL_SIZE * (Math.floor(sprite.x) - this.x) + this.width() / 2;
        let dstY = -PIXEL_SIZE * (Math.floor(sprite.y) - this.y + imageView.height) + this.height() / 2;
        let dstW =  PIXEL_SIZE * imageView.width;
        let ctxSaved = false;

        // Rotate sprite
        if (sprite.angle)
        {
            ctxSaved = true;
            this._ctx.save();
            this._ctx.translate(
                dstX + PIXEL_SIZE * sprite.rotationPivotX,
                dstY + PIXEL_SIZE * (imageView.height - sprite.rotationPivotY - 1)
            );
            this._ctx.rotate(-sprite.angle);
            dstX = -PIXEL_SIZE * sprite.rotationPivotX;
            dstY = -PIXEL_SIZE * (imageView.height - sprite.rotationPivotY - 1);
        }
        
        // Horizontally mirror sprite
        if (sprite.flippedX)
        {
            if (!ctxSaved)
            {
                ctxSaved = true;
                this._ctx.save();
            }
            this._ctx.scale(-1, 1);
            dstX *= -1;
            dstW *= -1;
        }
        
        // Draw image
        this._ctx.drawImage(
            imageView.getImage(),
            imageView.x,
            imageView.getImage().height - imageView.y - imageView.height,
            imageView.width,
            imageView.height,
            dstX,
            dstY,
            dstW,
            imageView.height * PIXEL_SIZE,
        );

        // Revert canvas transformations
        if (ctxSaved)
            this._ctx.restore();
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
    static _rgb(colour)
    {
        return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
    }
}
