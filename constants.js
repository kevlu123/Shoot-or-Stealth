
// Files
const CHARACTER_ATLAS_FILENAME = "characters.png";
const TILE_ATLAS_FILENAME = "tiles.png";

// Layout
const BACKGROUND_COLOUR = [0x87, 0xCE, 0xFF];
const PIXEL_SIZE = 2;
const TILE_SIZE = 16;

// Bullet properties (when applicable)
const BULLET_ANGULAR_VELOCITY = -0.3;
const BULLET_ANGULAR_DAMPING = 0.98;
const BULLET_COLLISION_DAMPING = 0.95;
const BULLET_ROTATION_COLLISION_DAMPING = 0.95;
const EXPLOSION_DAMAGE = 10;

// Player physics
const PLAYER_DAMPING_X = 0.9;
const PLAYER_SPEED = 0.5;
const JUMP_VELOCITY = 8;

// Other settings
const GRAVITY_STRENGTH = -0.4;
const COYOTE_JUMP_TIME = 0.05;
const CAMERA_LERP = 0.06;
const FRAME_DURATION = 1 / 60;

// Key bindings
class Key
{
    static LEFT = "KeyA";
    static RIGHT = "KeyD";
    static UP = "KeyW";
    static DOWN = "KeyS";
    static SHOOT = "KeyF";
    static JUMP = "KeyG";
    static GRENADE = "KeyH";
    static SWITCH_WEAPON_L = "KeyQ";
    static SWITCH_WEAPON_R = "KeyE";
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
    static SNIPER_BULLET = 3;
    static FAST_BULLET = 4;
    static GRENADE_BULLET = 5;
}

// Bullet properties

const DEFAULT_BULLET = {
    cooldown: 1 / 10,
    damage: 10 / 10, // 10 DPS
    velX: 8,
    velY: 0,
    range: 16 * TILE_SIZE,
    spread: 4,
    usePhysics: false,
    bouncyness: 0,
    atlasIndex: TileAtlasIndex.DEFAULT_BULLET,
    useCircularHitbox: false,
    hitbox: [
        0,
        TILE_SIZE,
        TILE_SIZE / 2 - 1,
        TILE_SIZE / 2 + 1
    ],
    oncollision: bullet => bullet.destroy(),
};

const FAST_BULLET = {
    cooldown: 1 / 16,
    damage: 15 / 16, // 15 DPS
    velX: 12,
    velY: 0,
    range: 10 * TILE_SIZE,
    spread: 8,
    usePhysics: false,
    bouncyness: null,
    atlasIndex: TileAtlasIndex.FAST_BULLET,
    useCircularHitbox: false,
    hitbox: [
        0,
        TILE_SIZE / 2,
        TILE_SIZE / 2 - 1,
        TILE_SIZE / 2 + 1
    ],
    oncollision: bullet => bullet.destroy(),
};

const SNIPER_BULLET = {
    cooldown: 8 / 10,
    damage: 240 / 10, // 30 DPS
    velX: 24,
    velY: 0,
    range: 32 * TILE_SIZE,
    spread: 1,
    usePhysics: false,
    bouncyness: null,
    atlasIndex: TileAtlasIndex.SNIPER_BULLET,
    useCircularHitbox: false,
    hitbox: [
        0,
        TILE_SIZE / 2,
        TILE_SIZE / 2 - 1,
        TILE_SIZE / 2
    ],
    oncollision: bullet => bullet.destroy(),
};

const GRENADE_BULLET = {
    cooldown: 0.5,
    damage: 12,
    velX: 7,
    velY: 5,
    range: null,
    spread: 1,
    usePhysics: true,
    bouncyness: 0.7,
    atlasIndex: TileAtlasIndex.GRENADE_BULLET,
    useCircularHitbox: true,
    hitbox: [
        8,
        8,
        3
    ],
    oncollision: () => {},
};

const PRIMARY_BULLET_TYPES = [
    DEFAULT_BULLET,
    FAST_BULLET,
    SNIPER_BULLET,
];
