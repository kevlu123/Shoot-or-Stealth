
class Tile extends Sprite
{
    constructor(tileIndex, x, y)
    {
        super();

        this.setImageView(ImageView.fromAtlas(TILE_ATLAS_FILENAME, tileIndex));
        this.x = x;
        this.y = y;
    }

    onExplosion()
    {
        this.destroy();
    }
}

class WallTile extends Tile
{
    constructor(x, y)
    {
        super(TileAtlasIndex.WALL, x, y);
    }
}

class SurfaceTile extends Tile
{
    constructor(x, y)
    {
        super(TileAtlasIndex.SURFACE, x, y);
    }
}

// End of the level
class EndTile extends Tile
{
    constructor(x, y)
    {
        super(TileAtlasIndex.WALL, x, y);
    }
}

// Indestructible
class BarrierTile extends Tile
{
    constructor(x, y)
    {
        super(TileAtlasIndex.WALL, x, y);
    }
    
    onExplosion()
    {
    }
}
