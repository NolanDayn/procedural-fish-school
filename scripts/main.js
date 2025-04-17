const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
let canvasElem = document.querySelector("canvas");

const NUM_FISH       = 20
const DISTANCE_APART = 150
const VISUAL_RANGE   = 400; //Should be larger than distance apart
const SPEED_LIMIT    = 15


for (var i = 0; i < NUM_FISH; i++) {
    fishes[i] = new Fish(new PVector(400 * i, 400*i), 0.5)
    fishes[i].resolve(420 *i , 220 * i)
    fishes[i].display(ctx)
}

window.onload = () => {
    // Make sure the canvas always fills the whole window
    window.addEventListener("resize", sizeCanvas, false);
    sizeCanvas();

    console.log(fishes)
    initBoids(NUM_FISH);

    // Schedule the main animation loop
    window.requestAnimationFrame(animationLoop);
};
