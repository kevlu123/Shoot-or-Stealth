
const CHARACTER_ATLAS_FILENAME = "characters.png";
const TILE_ATLAS_FILENAME = "tiles.png";
const BACKGROUND_COLOUR = [0x87, 0xCE, 0xFF];
const PIXEL_SIZE = 2;
const TILE_SIZE = 16;
const DAMPING_X = 0.9;
const GRAVITY_STRENGTH = -0.4;
const MOVEMENT_SPEED = 0.5;
const JUMP_VELOCITY = 8;
const COYOTE_JUMP_TIME = 0.05;
const CAMERA_LERP = 0.06;
const FRAME_DURATION = 1 / 60;

class Key
{
    static LEFT = "KeyA";
    static RIGHT = "KeyD";
    static UP = "KeyW";
    static DOWN = "KeyS";
    static SHOOT = "KeyF";
    static JUMP = "KeyG";
}

// Indices into sprite atlases

class CharacterAtlasIndex
{
    static PLAYER_1 = 0;
}

class TileAtlasIndex
{
    static WALL = 0;
    static SURFACE = 1;
    static BOMB = 2;
    static DEFAULT_BULLET = 3;
    static GRENADE_BULLET = 4;
}

// Bullet properties

const DEFAULT_BULLET = {
    cooldown: 0.1,
    velX: 8,
    velY: 0,
    range: 16 * TILE_SIZE,
    spread: 3,
    useGravity: false,
    bouncyness: 0,
    atlasIndex: TileAtlasIndex.DEFAULT_BULLET,
    useCircularHitbox: false,
    hitbox: [
        0,
        TILE_SIZE,
        TILE_SIZE / 2 - 1,
        TILE_SIZE / 2 + 1
    ],
};

const GRENADE_BULLET = {
    cooldown: 0.5,
    velX: 8,
    velY: 6,
    range: 16 * TILE_SIZE,
    spread: 2,
    useGravity: true,
    bouncyness: 0.7,
    atlasIndex: TileAtlasIndex.GRENADE_BULLET,
    useCircularHitbox: true,
    hitbox: 4,
};
