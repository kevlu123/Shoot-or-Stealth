
class GameState
{
    static MENU = 0;
    static GAMEPLAY = 1;
    static WAITING = 2;
    static WAIT_FOR_RESTART = 3;
    static WAIT_FOR_NEXT_LEVEL = 4;
}


// Global variables
let input = new Input();
let canvas = null;
let gfx = null;
let time = 0;
let gameState = GameState.MENU;
let levelIndex = 0;
let stealthing = true;

// Global sprite groups
let levelTiles = new SpriteList();
let players = new SpriteList();
let enemies = new SpriteList();
let bullets = new SpriteList();
let entities = new SpriteList();
let endTiles = new SpriteList();
let ladders = new SpriteList();
let backgroundTiles = new SpriteList();

// UI sprites
let titleSprite = null;
let watermarkSprite = null;
let fadeSprite = null;
let gameoverSprite = null;
let nextLevelSprite = null;
let stealthedSprite = null;
let winScreenSprite = null;

function isFirstLevel()
{
    return levelIndex === 0;
}

function isLastLevel()
{
    return levelIndex + 1 === LEVELS.length;
}

function onEnemyTriggered()
{
    stealthing = false;
}

function loadUI()
{
    function createUI(uiName)
    {
        let sprite = new UISprite(new ImageView(
            eval(uiName + "_FILENAME")
        ));
        sprite.alpha = 0;
        sprite.size = 0.9;
        return sprite;
    }

    // Title
    titleSprite = createUI("TITLESCREEN");
    titleSprite.alpha = 1;
    titleSprite.scalingType = UIScaling.WIDTH_THEN_HEIGHT;

    // Watermark
    watermarkSprite = createUI("WATERMARK");
    watermarkSprite.alpha = 1;
    watermarkSprite.size = 0.3;
    watermarkSprite.pivotX = 1;
    watermarkSprite.pivotY = 0;
    watermarkSprite.x = (w, h) => w;
    watermarkSprite.y = (w, h) => 0;

    // Fading screen
    fadeSprite = new UISprite(ImageView.fromAtlas(
        OBJECT_ATLAS_FILENAME,
        ObjectAtlasIndex.FADE_SCREEN
    ));
    fadeSprite.alpha = 0;
    fadeSprite.size = 2;

    gameoverSprite = createUI("GAMEOVER");
    nextLevelSprite = createUI("NEXTLEVEL");
    stealthedSprite = createUI("STEALTHED");
    winScreenSprite = createUI("WINSCREEN");
}

function reloadLevel()
{
    loadLevel(levelIndex);
    gameState = GameState.GAMEPLAY;
}

function loadNextLevel()
{
    if (levelIndex + 1 < LEVELS.length)
    {
        levelIndex++;
        
        if (isLastLevel())
            winScreenSprite.alpha = 1;

        loadLevel(levelIndex);
        gameState = GameState.GAMEPLAY;
    }
}

function loadLevel(index)
{
    let levelData = LEVELS[index];

    // Destroy sprites from previous level
    levelTiles     .forEach(sprite => sprite.destroy());
    players        .forEach(sprite => sprite.destroy());
    enemies        .forEach(sprite => sprite.destroy());
    bullets        .forEach(sprite => sprite.destroy());
    entities       .forEach(sprite => sprite.destroy());
    endTiles       .forEach(sprite => sprite.destroy());
    ladders        .forEach(sprite => sprite.destroy());
    backgroundTiles.forEach(sprite => sprite.destroy());

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

    // Register end tiles
    endTiles.push(...level.getEndTiles());

    gameoverSprite.alpha = 0;
    nextLevelSprite.alpha = 0;
    stealthedSprite.alpha = 0;

    stealthing = true;
}

function drawLevel()
{
    gfx.drawBackground(BACKGROUND_COLOUR);

    for (let tile of backgroundTiles)
        gfx.drawSprite(tile);

    for (let tile of levelTiles)
        gfx.drawSprite(tile);
    for (let ladder of ladders)
        gfx.drawSprite(ladder);

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

function drawUI()
{
    if (titleSprite !== null)
        gfx.drawUISprite(titleSprite);

    if (watermarkSprite !== null)
        gfx.drawUISprite(watermarkSprite);

    if (gameoverSprite !== null)
        gfx.drawUISprite(gameoverSprite);
        
    if (nextLevelSprite !== null)
        gfx.drawUISprite(nextLevelSprite);
        
    if (stealthedSprite !== null)
        gfx.drawUISprite(stealthedSprite);
        
    if (winScreenSprite !== null)
        gfx.drawUISprite(winScreenSprite);

    if (fadeSprite !== null)
    {
        fadeSprite.sizeIsWidth = gfx.width() > gfx.height();
        gfx.drawUISprite(fadeSprite);
    }
}

function controlPlayer()
{
    if (input.getKey(Key.LEFT))
        players.get(0).moveLeft();
    if (input.getKey(Key.RIGHT))
        players.get(0).moveRight();
    if (input.getKey(Key.DOWN))
        players.get(0).moveDown();
    if (input.getKey(Key.UP))
        players.get(0).moveUp();
    if (input.getKeyDown(Key.JUMP))
        players.get(0).jump();
    if (input.getKey(Key.SHOOT))
        players.get(0).shoot();
    if (input.getKeyDown(Key.GRENADE))
        players.get(0).throwGrenade();
}

// Update function for menu
function updateMenu()
{
    controlPlayer();

    // Close menu and start game
    if (input.getKeyDown(Key.LEFT) || input.getKeyDown(Key.RIGHT))
    {
        gameState = GameState.GAMEPLAY;

        Animator.interpolate(
            titleSprite,
            "alpha",
            1,
            0,
            1
        );
        
        Animator.interpolate(
            watermarkSprite,
            "alpha",
            1,
            0,
            1
        );
    }
}

//  Update function for gameplay
function updateGameplay()
{
    controlPlayer();

    // Check win. Player must stand on end tile
    if (!isLastLevel() && players.some(
            player => player.getGroundedOn().filter(
                sprite => endTiles.includes(sprite)
            ).length > 0
        ))
    {
        win();
    }

    // Check lose
    if (players.every(player => player.isDead()))
        lose();
}

// Update function for waiting to reload the level
function updateWaitForRestart()
{
    if (input.getAnyKeyDown())
    {
        gameState = GameState.WAITING;
        fadeScreen(1, true);
        Timer.addTimer(1.1, () => {
            reloadLevel();
            fadeScreen(1, false);
        });
    }
}

// Update function for waiting to load the next level
function updateWaitForNextLevel()
{
    if (input.getAnyKeyDown())
    {
        gameState = GameState.WAITING;
        fadeScreen(1, true);
        Timer.addTimer(1.1, () => {
            loadNextLevel();
            fadeScreen(1, false);
        });
    }
}

// Update function
function onUpdate()
{
    // Update current time
    time += FRAME_DURATION;

    // Call a more specific update function
    switch (gameState)
    {
        case GameState.MENU:                updateMenu();             break;
        case GameState.GAMEPLAY:            updateGameplay();         break;
        case GameState.WAIT_FOR_RESTART:    updateWaitForRestart();   break;
        case GameState.WAIT_FOR_NEXT_LEVEL: updateWaitForNextLevel(); break;
    }
    
    // Update camera position and draw frame
    gfx.update();
    drawLevel();
    drawUI();

    // Update animator and timers
    Animator.update();
    Timer.update();

    // Update sprites
    for (let player of players)
        player.update();
    for (let bullet of bullets)
        bullet.update();
    for (let enemy of enemies)
        enemy.update();
    for (let entity of entities)
        entity.update();
    for (let tile of levelTiles)
        tile.update();
    Particle.update();

    // Update input
    input.update();
}

function createExplosion(x, y)
{
    // Create particles and shake the screen
    ExplosionBurstParticle.create(x, y);
    gfx.shake();

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

// Win event
function win()
{
    gameState = GameState.WAITING;
    
    // Run animation
    Timer.addTimer(1, () =>
    {
        Animator.interpolate(
            stealthing ? stealthedSprite : nextLevelSprite,
            "alpha",
            0,
            1,
            1
        );
        gameState = GameState.WAIT_FOR_NEXT_LEVEL;
    });
}

// Lose event
function lose()
{
    gameState = GameState.WAITING;

    // Run animation
    Timer.addTimer(1, () =>
    {
        Animator.interpolate(
            gameoverSprite,
            "alpha",
            0,
            1,
            1
        );
        gameState = GameState.WAIT_FOR_RESTART;
    });
}

function fadeScreen(duration, fadeIn)
{
    Animator.interpolate(
        fadeSprite,
        "alpha",
        fadeIn ? 0 : 1,
        fadeIn ? 1 : 0,
        duration
    );
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

    function onImagesLoaded()
    {
        loadUI();

        // Load first level
        levelIndex = 0;
        loadLevel(levelIndex);

        // Register update function
        onWindowResize();
        setInterval(onUpdate, FRAME_DURATION * 1000);
    }

    // Load images before calling code that requires image size to be known
    ImageLoader.loadImages(
        [
            CHARACTER_ATLAS_FILENAME,
            TILE_ATLAS_FILENAME,
            OBJECT_ATLAS_FILENAME,
            TITLESCREEN_FILENAME,
            WATERMARK_FILENAME,
            GAMEOVER_FILENAME,
            NEXTLEVEL_FILENAME,
            STEALTHED_FILENAME,
            WINSCREEN_FILENAME,
        ],
        onImagesLoaded
    );
}

// Register callbacks
window.onload = main;
window.onresize = onWindowResize;
