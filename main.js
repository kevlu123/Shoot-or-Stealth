
// Global variables
let input = new Input();
let canvas = null;
let gfx = null;

// Global sprite groups
let levelTiles = new SpriteList();
let players = new SpriteList();
let enemies = new SpriteList();
let bullets = new SpriteList();


function loadLevel(levelData)
{
    let level = new Level(levelData);

    // Create player
    let player = new Character(
        CharacterAtlasIndex.PLAYER_1,
        TILE_SIZE * level.getStartPos()[0],
        TILE_SIZE * level.getStartPos()[1]
    );
    gfx.target = player;

    players.push(player);
}

function drawLevel()
{
    gfx.drawBackground(BACKGROUND_COLOUR);

    for (let tile of levelTiles)
        gfx.drawSprite(tile);

    for (let enemy of enemies)
        gfx.drawSprite(enemy);

    for (let player of players)
        gfx.drawSprite(player);

    for (let bullet of bullets)
        gfx.drawSprite(bullet);
}

// Update function
function onUpdate()
{
    // Control player
    if (input.getKey(Key.LEFT))
        players.get(0).moveLeft();
    if (input.getKey(Key.RIGHT))
        players.get(0).moveRight();
    if (input.getKeyDown(Key.JUMP) && players.get(0).isGrounded())
        players.get(0).jump();
    if (input.getKey(Key.SHOOT))
        players.get(0).shoot();
    if (input.getKeyDown(Key.GRENADE))
        players.get(0).shoot(GRENADE_BULLET);

    // Switch weapon
    if (input.getKeyDown(Key.SWITCH_WEAPON_L) || input.getKeyDown(Key.SWITCH_WEAPON_R))
    {
        let incr = input.getKeyDown(Key.SWITCH_WEAPON_R) ? 1 : -1;
        players.get(0).bulletType = PRIMARY_BULLET_TYPES[wrappedIncrement(
            PRIMARY_BULLET_TYPES.indexOf(player.bulletType),
            incr,
            0,
            PRIMARY_BULLET_TYPES.length
        )];
    }
    
    // Update camera position and draw frame
    gfx.update();
    drawLevel();

    // Updates players, enemies, and bullets
    for (let player of players)
        player.update();
    for (let enemy of enemies)
        enemy.update();
    for (let bullet of bullets)
        bullet.update();

    // Update input
    input.update();
}

// Resize canvas when window resizes
function onWindowResize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Entry point
function main()
{
    // Create graphics
    canvas = document.getElementById("canvas");
    gfx = new Graphics(canvas);

    // Load first level
    loadLevel(LEVELS[0]);

    onWindowResize();
    setInterval(onUpdate, FRAME_DURATION * 1000);
}

// Register callbacks
window.onload = main;
window.onresize = onWindowResize;
