const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");
let canvasElem = document.querySelector("canvas");

//ctx.beginPath();

// Set start-point
//ctx.moveTo(20,20);

// Set sub-points
//ctx.lineTo(100,20);
//ctx.lineTo(175,100);
//ctx.lineTo(20,100);

// Set end-point
//ctx.lineTo(20,20);

// Stroke it (do the drawing)
//ctx.stroke();

origin = new PVector(100,100)

spine = new Chain(origin, 12, 32, Math.PI/8);
console.log(spine)
//spine.display(ctx)
console.log(spine)

let mouseX
let mouseY

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}


canvasElem.addEventListener("mousedown", function (e) {
    getMousePos(canvasElem, e);
    new_pos = new PVector(mouseX, mouseY)
    fish.resolve(mouseX , mouseY)
    //console.log(spine)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    fish.display(ctx)
    
}); 

canvasElem.onmousemove = function(event) {moveFish(event)};

function moveFish(e) {
    let x = e.clientX;
    let y = e.clientY;
    new_pos = new PVector(x, y)
    fish.resolve(x , y)
    //console.log(spine)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    fish.display(ctx)
}
/*

  spine.resolve(new PVector(300,300));
  console.log(spine)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  spine.display(ctx)
*/

fishOrigin = new PVector(100,100)
fish = new Fish(fishOrigin)
console.log(fish)
fish.display(ctx)



