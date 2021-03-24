
// Files
const CHARACTER_ATLAS_FILENAME = "characters.png";
const TILE_ATLAS_FILENAME = "tiles.png";
const OBJECT_ATLAS_FILENAME = "objects.png";

// Layout
const BACKGROUND_COLOUR = [0x87, 0xCE, 0xFF];
const PIXEL_SIZE = 2;
const TILE_SIZE = 16;

// Bullet properties (where applicable)
const BULLET_ANGULAR_VELOCITY = -0.3;
const BULLET_ANGULAR_DAMPING = 0.98;
const BULLET_COLLISION_DAMPING = 0.95;
const BULLET_ROTATION_COLLISION_DAMPING = 0.95;
const BULLET_SPAWN_OFFSET_Y = 6;
const BULLET_SPAWN_DISTANCE_THRESHOLD = 32;
const EXPLOSION_DAMAGE = 100;

// Character properties
const PLAYER_DAMPING_X = 0.9;
const PLAYER_WALK_SPEED = 0.5;
const ENEMY_DAMPING_X = 0.8;
const ENEMY_WALK_SPEED = 0.4;
const JUMP_VELOCITY = 8;
const PLAYER_HP = 25;
const ENEMY_HP = 3;
const DIE_VELOCITY_X = 3;
const DIE_VELOCITY_Y = 3;
const DIE_DAMPING_X = 0.98;

// Enemy AI
const ENEMY_WALK_INTERVAL_MIN = 0.5;
const ENEMY_WALK_INTERVAL_MAX = 3;
const ENEMY_WALK_DURATION_MIN = 0.3;
const ENEMY_WALK_DURATION_MAX = 0.7;
const ENEMY_SHOOT_INTERVAL_MIN = 0.5;
const ENEMY_SHOOT_INTERVAL_MAX = 3;
const ENEMY_SHOOT_DURATION_MIN = 0.3;
const ENEMY_SHOOT_DURATION_MAX = 0.7;
const ENEMY_RAYCAST_ANGLE = Math.PI / 3;

// Particles
const BURST_PARTICLE_ANGULAR_VEL_MAX = 0.5;
const BLOOD_PARTICLE_MIN_SIZE = 1;
const BLOOD_PARTICLE_MAX_SIZE_EXCL = 5;

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
    static ENEMY1_1 = 9;
    static ENEMY2_1 = 12;
    static ENEMY3_1 = 15;
}

class TileAtlasIndex
{
    static WALL = 0;
    static SURFACE = 1;
    static BOMB = 2;
}

class ObjectAtlasIndex
{
    static DEFAULT_BULLET = 0;
    static SNIPER_BULLET = 1;
    static FAST_BULLET = 1;
    static GRENADE_BULLET = 2;
    static BLOOD_PARTICLE = 3;
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
    atlasIndex: ObjectAtlasIndex.DEFAULT_BULLET,
    useCircularHitbox: false,
    atlasRect: new Rect(
        0,
        7,
        16,
        2
    ),
    oncollision: collision => collision.collider.destroy(),
};

const FAST_BULLET = {
    cooldown: 1 / 16,
    damage: 15 / 16, // 15 DPS
    velX: 12,
    velY: 0,
    range: 8 * TILE_SIZE,
    spread: 8,
    usePhysics: false,
    bouncyness: null,
    atlasIndex: ObjectAtlasIndex.FAST_BULLET,
    useCircularHitbox: false,
    atlasRect: new Rect(
        0,
        7,
        8,
        2
    ),
    oncollision: collision => collision.collider.destroy(),
};

const SNIPER_BULLET = {
    cooldown: 8 / 10,
    damage: 999, // One shot kill
    velX: 24,
    velY: 0,
    range: 32 * TILE_SIZE,
    spread: 1,
    usePhysics: false,
    bouncyness: null,
    atlasIndex: ObjectAtlasIndex.SNIPER_BULLET,
    useCircularHitbox: false,
    atlasRect: new Rect(
        0,
        7,
        16,
        2
    ),
    oncollision: collision => collision.collider.destroy(),
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
    atlasIndex: ObjectAtlasIndex.GRENADE_BULLET,
    useCircularHitbox: false,
    atlasRect: new Rect(
        0,
        0,
        8,
        10
    ),
    oncollision: () => {},
};

const PRIMARY_BULLET_TYPES = [
    DEFAULT_BULLET,
    FAST_BULLET,
    SNIPER_BULLET,
];
