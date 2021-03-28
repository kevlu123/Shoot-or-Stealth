
// Global variables
let input = new Input();
let canvas = null;
let gfx = null;
let time = 0;

// Global sprite groups
let levelTiles = new SpriteList();
let players = new SpriteList();
let enemies = new SpriteList();
let bullets = new SpriteList();
let entities = new SpriteList();


function loadLevel(levelData)
{
    // Load level data
    let level = new Level(levelData);

    // Create player
    let player = new Player(
        TILE_SIZE * level.getStartPos()[0],
        TILE_SIZE * level.getStartPos()[1]
    );
    players.push(player);
    
    // Make camera follow player
    gfx.target = player;
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

    for (let entity of entities)
        gfx.drawSprite(entity);

    for (let bullet of bullets)
        gfx.drawSprite(bullet);

    for (let particle of Particle.getSprites())
        gfx.drawSprite(particle);
}

// Update function
function onUpdate()
{
    time += FRAME_DURATION;

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
            PRIMARY_BULLET_TYPES.indexOf(players.get(0).bulletType),
            incr,
            0,
            PRIMARY_BULLET_TYPES.length
        )];
    }
    
    // Update camera position and draw frame
    gfx.update();
    drawLevel();

    // Update sprites
    for (let player of players)
        player.update();
    for (let bullet of bullets)
        bullet.update();
    for (let enemy of enemies)
        enemy.update();
    for (let entity of entities)
        entity.update();
        
    Particle.update();

    // Update input
    input.update();
}

function createExplosion(x, y)
{
    ExplosionBurstParticle.create(x, y);
    gfx.shake(
        SCREEN_SHAKE_FREQUENCY,
        SCREEN_SHAKE_AMPLITUDE,
        SCREEN_SHAKE_DURATION
    );

    function checkExplosion(sprite)
    {
        if (sprite.isNearExplosion(x, y))
            sprite.onExplosion(x, y);
    };

    // Blow up tiles
    levelTiles.forEach(checkExplosion);

    // Hurt enemies and players
    enemies.forEach(checkExplosion);
    players.forEach(checkExplosion);

    // Check entities
    entities.forEach(checkExplosion);
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
