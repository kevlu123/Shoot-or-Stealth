
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
        // Interpolate camera towards target
        let targetX = this.target?.x ?? 0;
        let targetY = this.target?.y ?? 0;
        this.x = lerp(this.x, targetX, CAMERA_LERP);
        this.y = lerp(this.y, targetY, CAMERA_LERP);

        // Clamp camera
        let minY = this.height() / PIXEL_SIZE / 2;
        if (this.y < minY)
            this.y = minY; 
        
        // Advance shake waveform
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
        if (imageView === null || sprite.alpha === 0)
            return;

        // Get shake offset
        let shakeX = 0;
        let shakeY = 0;
        if (this._shakeWaveform.length > 0)
        {
            shakeX = this._shakeWaveform[0][0];
            shakeY = this._shakeWaveform[0][1];
        }

        let dstX =  PIXEL_SIZE * (Math.floor(sprite.x) - this.x + shakeX) + this.width() / 2;
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

        // Transparency
        if (sprite.alpha !== 1)
        {
            if (!ctxSaved)
            {
                ctxSaved = true;
                this._ctx.save();
            }
            this._ctx.globalAlpha = sprite.alpha;
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

    // Draws a UI sprite
    drawUISprite(sprite)
    {
        let imageView = sprite.getImageView();
        if (imageView === null || sprite.alpha === 0)
            return;

        // Get shake offset
        let shakeX = 0;
        let shakeY = 0;
        if (this._shakeWaveform.length > 0)
        {
            shakeX = this._shakeWaveform[0][0] * PIXEL_SIZE;
            shakeY = this._shakeWaveform[0][1] * PIXEL_SIZE;
        }

        // Calculate width and height in pixels
        let rawWidth;
        let rawHeight;
        
        let setSizeByWidth = function()
        {
            // Use size as width
            rawWidth = sprite.size * this.width();
            rawHeight = sprite.size / sprite.getAspectRatio() * this.width();
        }.bind(this);
        
        let setSizeByHeight = function()
        {
            // Use size as height
            rawWidth = sprite.size * sprite.getAspectRatio() * this.height();
            rawHeight = sprite.size * this.height();
        }.bind(this);

        // Calculate width and height in pixels
        switch (sprite.scalingType)
        {
            case UIScaling.WIDTH:
                setSizeByWidth();
                break;
            case UIScaling.HEIGHT:
                setSizeByHeight();
                break;
            case UIScaling.WIDTH_THEN_HEIGHT:
                setSizeByWidth();
                if (rawHeight > this.height())
                    setSizeByHeight();
                break;
            case UIScaling.HEIGHT_THEN_WIDTH:
                setSizeByHeight();
                if (rawWidth > this.width())
                    setSizeByWidth();
                break;
        }
        

        let ctxSaved = false;

        // Transparency
        if (sprite.alpha !== 1)
        {
            if (!ctxSaved)
            {
                ctxSaved = true;
                this._ctx.save();
            }
            this._ctx.globalAlpha = sprite.alpha;
        }

        // Draw to screen
        this._ctx.drawImage(
            imageView.getImage(),
            imageView.x,
            imageView.getImage().height - imageView.y - imageView.height,
            imageView.width,
            imageView.height,
            sprite.x(this.width(), this.height()) - rawWidth * sprite.pivotX + shakeX,
            this.height() - sprite.y(this.width(), this.height()) - rawHeight * (1 - sprite.pivotY) + shakeY,
            rawWidth,
            rawHeight
        );

        // Restore context settings
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
    shake(frequency=SCREEN_SHAKE_FREQUENCY, amplitude=SCREEN_SHAKE_AMPLITUDE, duration=SCREEN_SHAKE_DURATION)
    {
        for (let t = 0, i = 0; t <= duration + FRAME_DURATION; t += FRAME_DURATION, i++)
        {
            let sampleX = amplitude * Math.sin(2 * Math.PI * frequency * t);
            let sampleY = amplitude * Math.sin(2 * Math.PI * frequency * t * 0.7);

            if (i >= this._shakeWaveform.length)
                this._shakeWaveform.push([0, 0]);
            this._shakeWaveform[i][0] += sampleX;
            this._shakeWaveform[i][1] += sampleY;
        }
    }

    // Converts an rgb array with values 0-255 to a string representing a colour
    static _rgb(colour)
    {
        return "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")";
    }
}
