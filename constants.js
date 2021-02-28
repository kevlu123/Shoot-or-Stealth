
const TILE_ATLAS_FILENAME = "tiles.png";

const PIXEL_SIZE = 2;
const TILE_SIZE = 16;
const DAMPING_X = 0.9;
const GRAVITY_STRENGTH = -0.4;
const MOVEMENT_SPEED = 0.5;
const JUMP_VELOCITY = 8;
const COYOTE_JUMP_TIME = 0.05;
const CAMERA_LERP = 0.06;
const FRAME_DURATION = 1 / 60;

const BACKGROUND_COLOUR = [0x87, 0xCE, 0xFF];

class Key
{
    static LEFT = "KeyA";
    static RIGHT = "KeyD";
    static UP = "KeyW";
    static DOWN = "KeyS";
    static JUMP = "KeyG";
}
