
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
                let tileClass = null;
                let enemyClass = null;
                let entityClass = null;

                let c = lines[y][x];
                switch (c)
                {
                    // Create level tiles
                    case '.': tileClass = WallTile; break;
                    case '_': tileClass = SurfaceTile; break;
                    
                    // Spawn enemies
                    case '1': enemyClass = Enemy1; break;
                    case '2': enemyClass = Enemy2; break;
                    case '3': enemyClass = Enemy3; break;
                    
                    // Create entities
                    case 'x': entityClass = BombBlock; break;

                    case 's':
                        // Set start position
                        this._startPos = [x, y];
                        break;
                    case 'e':
                        // Set finish position
                        this._endPos = [x, y];
                        break;

                }

                if (tileClass !== null)
                {
                    // Instantiate tile
                    let tile = new tileClass(
                        TILE_SIZE * x,
                        TILE_SIZE * y
                    );
                    levelTiles.push(tile);
                }
                else if (enemyClass !== null)
                {
                    // Instantiate enemy
                    let enemy = new enemyClass(
                        TILE_SIZE * x,
                        TILE_SIZE * y
                    );
                    enemies.push(enemy);
                }
                else if (entityClass !== null)
                {
                    // Instantiate entity
                    let entity = new entityClass(
                        TILE_SIZE * x,
                        TILE_SIZE * y
                    );
                    entities.push(entity);
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
