
class TileType
{
    static WALL = 0;
    static SURFACE = 1;
    static BOMB = 2;
}


class Level
{
    // Loads level data from a multiline string representing the layout
    constructor(data)
    {
        // Split string into lines representing rows of tiles
        let lines = data.split("\n");
        lines.reverse();
        
        // Get width and height
        this._width = Math.max(0, ...listComp(lines, line => line.length))
        this._height = lines.length;

        // Pad all lines to max width
        for (let i = 0; i < lines.length; i++)
            lines[i] = lines[i].padEnd(this._width, ' ');

        // Set default spawn and level finish positions
        this._startPos = [0, 0];
        this._endPos = [1, 0];

        // Load each tile
        this._sprites = [];
        for (let y = 0; y < this._height; y++)
            for (let x = 0; x < this._width; x++)
            {
                let tileType = null;

                switch (lines[y][x])
                {
                    case '.': tileType = TileType.WALL; break;
                    case '_': tileType = TileType.SURFACE; break;
                    case 'x': tileType = TileType.BOMB; break;

                    case 's':
                        // Set start position
                        this._startPos = [x, y];
                        break;
                    case 'e':
                        // Set finish position
                        this._endPos = [x, y];
                        break;
                }

                if (tileType !== null)
                {
                    let tile = Sprite.fromImageView(new ImageView(
                        TILE_ATLAS_FILENAME,
                        TILE_SIZE * tileType,
                        0,
                        TILE_SIZE,
                        TILE_SIZE
                    ));
                    tile.x = TILE_SIZE * x;
                    tile.y = TILE_SIZE * y;
                    this._sprites.push(tile);
                }
            }
    }

    getSprites()
    {
        return this._sprites;
    }

    getStartPos()
    {
        return this._startPos;
    }

    getEndPos()
    {
        return this._endPos;
    }
}
