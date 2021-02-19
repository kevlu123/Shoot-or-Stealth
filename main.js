
let canvas;
let gfx;
let time = Date.now();
let player = new Sprite("characters.png");

// Queue another update with the new delta time
function queueUpdate()
{
    let now = Date.now();
    let newDeltaTime = (now - time)  / 1000;
    window.requestAnimationFrame(() => { onUpdate(newDeltaTime); });
    time = now;
}

// Update function
function onUpdate(deltaTime)
{
    console.log(deltaTime);

    gfx.drawBackground([0x87, 0xCE, 0xFF]);

    gfx.drawSprite(player);
    
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

    onWindowResize();
    window.requestAnimationFrame(() => { onUpdate(16); });
}

// Register callbacks
window.onload = main;
window.onresize = onWindowResize;
