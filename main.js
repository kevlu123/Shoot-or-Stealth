
let input = new Input();
let canvas;
let gfx;
let level;
let player;
let bullets;

function loadLevel(levelData)
{
    level = new Level(levelData);

    // Create player
    player = new Character(
        CharacterAtlasIndex.PLAYER_1,
        TILE_SIZE * level.getStartPos()[0],
        TILE_SIZE * level.getStartPos()[1],
        GRENADE_BULLET
    );
    player.collidableSprites = level.getSprites();
    player.useGravity = true;
    player.dampVelocityX = true;
    gfx.target = player;

    bullets = new SpriteList();
}

function drawLevel()
{
    gfx.drawBackground(BACKGROUND_COLOUR);

    for (let tile of level.getSprites())
        gfx.drawSprite(tile);

    for (let bullet of bullets)
        gfx.drawSprite(bullet);

    gfx.drawSprite(player);
}

function playerShoot()
{
    let bullet = player.shoot();
    if (bullet)
    {
        bullet.collidableSprites = level.getSprites();
        bullet.oncollision = () => bullet.destroy();
        bullets.push(bullet);
    }
}

// Update function
function onUpdate()
{
    // Control player
    if (input.getKey(Key.LEFT))
    {
        player.velX -= MOVEMENT_SPEED;
        player.flippedX = true;
    }
    if (input.getKey(Key.RIGHT))
    {
        player.velX += MOVEMENT_SPEED;
        player.flippedX = false;
    }
    if (input.getKeyDown(Key.JUMP) && player.isGrounded())
        player.velY = JUMP_VELOCITY;

    // Shoot
    if (input.getKey(Key.SHOOT))
        playerShoot();

    // Update camera position and draw frame
    gfx.update();
    drawLevel();

    // Update physics sprites
    player.update();
    for (let bullet of bullets)
    {
        bullet.update();
        if (!bullet.isActive())
            bullet.destroy();
    }

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
