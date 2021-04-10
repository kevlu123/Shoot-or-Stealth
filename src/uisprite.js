
class UIScaling
{
    static WIDTH = 0;
    static HEIGHT = 1;
    static WIDTH_THEN_HEIGHT = 2;
    static HEIGHT_THEN_WIDTH = 3;
}

class UISprite
{
    constructor(imageView)
    {
        this._imageView = imageView;
        this._aspect = this._imageView.width / this._imageView.height;

        this.alpha = 1;

        this.pivotX = 0.5;
        this.pivotY = 0.5;

        // Formulae to calculate position dynamically from screen width and height
        this.x = (w, h) => w / 2;
        this.y = (w, h) => h / 2;

        // Set to true if size is the width or false if size is the height
        this.scalingType = UIScaling.WIDTH_THEN_HEIGHT;

        // Width or height as a proportion of the screen size
        this.size = 1;
    }

    getImageView()
    {
        return this._imageView;
    }

    // Get the width divided by the height of the image
    getAspectRatio()
    {
        return this._aspect;
    }
}
