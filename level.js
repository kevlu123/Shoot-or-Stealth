
class Level
{
    // Loads level data from a multiline string representing the layout
    constructor(data)
    {
        // Split string into lines representing rows of tiles
        let lines = data.split("\n");
        lines.reverse();
        
        // Get width and height
        this._width = Math.max(0, ...lines.map(line => line.length))
        this._height = lines.length;

        // Pad all lines to max width
        for (let i = 0; i < lines.length; i++)
            lines[i] = lines[i].padEnd(this._width, ' ');

        // Set default spawn and level finish positions
        this._startPos = [0, 0];
        this._endPos = [1, 0];

        // Load each tile
        for (let y = 0; y < this._height; y++)
            for (let x = 0; x < this._width; x++)
            {
                let tileIndex = null;
                let c = lines[y][x];
                switch (c)
                {
                    case '.': tileIndex = TileAtlasIndex.WALL; break;
                    case '_': tileIndex = TileAtlasIndex.SURFACE; break;
                    case 'x': tileIndex = TileAtlasIndex.BOMB; break;

                    case 's':
                        // Set start position
                        this._startPos = [x, y];
                        break;
                    case 'e':
                        // Set finish position
                        this._endPos = [x, y];
                        break;

                    case '1':
                        {
                            // Enemy 1
                            let enemy = new Enemy(
                                CharacterAtlasIndex.ENEMY_1_1,
                                TILE_SIZE * x,
                                TILE_SIZE * y,
                                DEFAULT_BULLET
                            );
                            enemies.push(enemy);
                            break;
                        }
                    case '2':
                        {
                            // Enemy 2
                            let enemy = new Enemy(
                                CharacterAtlasIndex.ENEMY_1_1,
                                TILE_SIZE * x,
                                TILE_SIZE * y,
                                FAST_BULLET
                            );
                            enemies.push(enemy);
                            break;
                        }
                    case '3':
                        {
                            // Enemy 3
                            let enemy = new Enemy(
                                CharacterAtlasIndex.ENEMY_1_1,
                                TILE_SIZE * x,
                                TILE_SIZE * y,
                                SNIPER_BULLET
                            );
                            enemies.push(enemy);
                            break;
                        }
                }

                if (tileIndex !== null)
                {
                    let tile = Sprite.fromImageView(ImageView.fromAtlas(TILE_ATLAS_FILENAME, tileIndex));
                    tile.x = TILE_SIZE * x;
                    tile.y = TILE_SIZE * y;
                    levelTiles.push(tile);
                }
            }
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
