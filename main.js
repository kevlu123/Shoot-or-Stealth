
let canvas;
let gfx;
let input = new Input();
let time = Date.now();
let level;
let player;

function loadLevel(levelData)
{
    level = new Level(levelData);

    // Create player
    player = Sprite.fromImageView(new ImageView(
        "characters.png",
        0, 0,
        TILE_SIZE, TILE_SIZE
    ), PhysicsSprite);
    player.x = TILE_SIZE * level.getStartPos()[0];
    player.y = TILE_SIZE * level.getStartPos()[1];
    player.collidableSprites = level.getSprites();
    player.useGravity = true;
    player.dampVelocityX = true;
    gfx.target = player;
}

function drawLevel()
{
    gfx.drawBackground(BACKGROUND_COLOUR);

    for (let tile of level.getSprites())
        gfx.drawSprite(tile);

    gfx.drawSprite(player);
}

// Update function
function onUpdate()
{
    if (input.getKey(Key.LEFT))
        player.velX -= MOVEMENT_SPEED;
    if (input.getKey(Key.RIGHT))
        player.velX += MOVEMENT_SPEED;
    if (input.getKeyDown(Key.JUMP) && player.isGrounded())
        player.velY = JUMP_VELOCITY;
        
    player.update();
    gfx.update();

    drawLevel();
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
