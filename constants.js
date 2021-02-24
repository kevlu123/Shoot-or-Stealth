
const TILE_ATLAS_FILENAME = "tiles.png";

const PIXEL_SIZE = 2;
const TILE_SIZE = 16;
const DAMPING_X = 0.0001;
const GRAVITY_STRENGTH = -1500;
const MOVEMENT_SPEED = 10;
const JUMP_VELOCITY = 500;
const COYOTE_JUMP_TIME = 0.05;

const BACKGROUND_COLOUR = [0x87, 0xCE, 0xFF];

class Key
{
    static LEFT = "KeyA";
    static RIGHT = "KeyD";
    static UP = "KeyW";
    static DOWN = "KeyS";
    static JUMP = "KeyG";
}
