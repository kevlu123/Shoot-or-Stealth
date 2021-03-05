
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
        TILE_SIZE * level.getStartPos()[1]
    );
    player.collidableSprites = level.getSprites();
    player.useGravity = true;
    player.dampingX = PLAYER_DAMPING_X;
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

function playerShoot(isGrenade)
{
    let bullet;
    if (isGrenade)
        bullet = player.shoot(GRENADE_BULLET);
    else
        bullet = player.shoot();

    if (bullet !== null)
    {
        bullet.collidableSprites = level.getSprites();

        // If bullet spawned inside a wall, move out of wall
        while (bullet.isColliding())
            bullet.x -= signof(bullet.velX);

        bullets.push(bullet);
    }
}

// Check if bullet collided with plaayer or enemy
function onBulletCollision(collidedWith)
{

}

// Update function
function onUpdate()
{
    // Control player
    if (input.getKey(Key.LEFT))
    {
        player.velX -= PLAYER_SPEED;
        player.flippedX = true;
    }
    if (input.getKey(Key.RIGHT))
    {
        player.velX += PLAYER_SPEED;
        player.flippedX = false;
    }
    if (input.getKeyDown(Key.JUMP) && player.isGrounded())
        player.velY = JUMP_VELOCITY;

    // Shoot
    if (input.getKey(Key.SHOOT))
        playerShoot();

    // Throw grenade
    if (input.getKeyDown(Key.GRENADE))
        playerShoot(GRENADE_BULLET);

    // Switch weapon
    if (input.getKeyDown(Key.SWITCH_WEAPON_L) || input.getKeyDown(Key.SWITCH_WEAPON_R))
    {
        let incr = input.getKeyDown(Key.SWITCH_WEAPON_R) ? 1 : -1;
        player.bulletType = PRIMARY_BULLET_TYPES[wrappedIncrement(
            PRIMARY_BULLET_TYPES.indexOf(player.bulletType),
            incr,
            0,
            PRIMARY_BULLET_TYPES.length
        )];
    }
    

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
