
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

        this._shakeWaveform = [];
    }

    update()
    {
        let targetX = this.target?.x ?? 0;
        let targetY = this.target?.y ?? 0;

        this.x = lerp(this.x, targetX, CAMERA_LERP);
        this.y = lerp(this.y, targetY, CAMERA_LERP);
        
        this._shakeWaveform.shift();
    }

    // Fills the entire canvas with a colour.
    // Parameter colour is an rgb array with values 0-255
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
        if (imageView === null)
            return;

        // Get shake offset
        let shakeX = 0;
        let shakeY = 0;
        if (this._shakeWaveform.length > 0)
        {
            shakeX = this._shakeWaveform[0][0];
            shakeY = this._shakeWaveform[0][1];
        }

        let dstX =  PIXEL_SIZE * (Math.floor(sprite.x) - this.x - shakeX) + this.width() / 2;
        let dstY = -PIXEL_SIZE * (Math.floor(sprite.y) - this.y - shakeY + imageView.height) + this.height() / 2;
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

    // Shakes the screen
    shake(frequency=8, amplitude=3, duration=0.2)
    {
        this._shakeWaveform = [];
        for (let t = 0; t <= duration + FRAME_DURATION; t += FRAME_DURATION)
        {
            let sampleX = amplitude * Math.sin(2 * Math.PI * frequency * t);
            let sampleY = amplitude * Math.sin(2 * Math.PI * frequency * t * 0.7);
            this._shakeWaveform.push([sampleX, sampleY]);
        }
    }

    // Converts an rgb array with values 0-255 to a string representing a colour
    static _rgb(colour)
    {
        return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
    }
}
