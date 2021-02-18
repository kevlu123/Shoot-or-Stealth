
let canvas;
let gfx;
let time = Date.now();

// Queue another update with the new delta time
function queueUpdate()
{
    let now = Date.now();
    let newDeltaTime = (now - time)  / 1000;
    window.requestAnimationFrame(() => { onUpdate(newDeltaTime); });
    time = now;
}

function onUpdate(deltaTime)
{
    gfx.drawBackground([0x87, 0xCE, 0xFF]);
    
    console.log(deltaTime);
    
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
