
let canvas;
let gfx;
let input = new Input();
let time = Date.now();
let level;
let player;

// Queue another update with the new delta time
function queueUpdate()
{
    let now = Date.now();
    let newDeltaTime = (now - time)  / 1000;
    window.requestAnimationFrame(() => { onUpdate(newDeltaTime); });
    time = now;
}

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
}

function drawLevel()
{
    gfx.drawBackground(BACKGROUND_COLOUR);

    for (let tile of level.getSprites())
        gfx.drawSprite(tile);

    gfx.drawSprite(player);
}

// Update function
function onUpdate(deltaTime)
{
    //console.log(deltaTime);

    if (input.getKey(Key.LEFT))
        player.velX -= MOVEMENT_SPEED;
    if (input.getKey(Key.RIGHT))
        player.velX += MOVEMENT_SPEED;
    if (input.getKeyDown(Key.JUMP) && player.isGrounded())
        player.velY = JUMP_VELOCITY;
        
    player.update(deltaTime);

    drawLevel();
    input.update();
    queueUpdate();
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
    window.requestAnimationFrame(() => { onUpdate(0.016); });
}

// Register callbacks
window.onload = main;
window.onresize = onWindowResize;
