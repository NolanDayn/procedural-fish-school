var boids = [];
let fishes = []

function initBoids(numBoids) {
    for (var i = 0; i < numBoids; i += 1) {
        boids[boids.length] = {
          x: Math.random() * width,
          y: Math.random() * height,
          dx: Math.random() * 10 - 5,
          dy: Math.random() * 10 - 5,
          history: [],
        };
    }
    
    for (var i = 0; i < NUM_FISH; i++) {
        fishes[i] = new Fish(new PVector(400 * i, 400*i), 0.5)
        fishes[i].resolve(420 *i , 220 * i)
        fishes[i].display(ctx)
    }
}

function distance(boid1, boid2) {
    return Math.sqrt(
      (boid1.x - boid2.x) * (boid1.x - boid2.x) +
        (boid1.y - boid2.y) * (boid1.y - boid2.y),
    );
}

// TODO: This is naive and inefficient.
function nClosestBoids(boid, n) {
    // Make a copy
    const sorted = boids.slice();
    // Sort the copy by distance from `boid`
    sorted.sort((a, b) => distance(boid, a) - distance(boid, b));
    // Return the `n` closest
    return sorted.slice(1, n + 1);
}

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
    const canvas = document.getElementById("Canvas");
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
function keepWithinBounds(boid) {
    const margin = 400;
    const turnFactor = 1;
  
    if (boid.x < margin) {
      boid.dx += turnFactor;
    }
    if (boid.x > width - margin) {
      boid.dx -= turnFactor
    }
    if (boid.y < margin) {
      boid.dy += turnFactor;
    }
    if (boid.y > height - margin) {
      boid.dy -= turnFactor;
    }
}

// Find the center of mass of the other boids and adjust velocity slightly to
// point towards the center of mass.
function flyTowardsCenter(boid) {
    const centeringFactor = 0.005; // adjust velocity by this %
  
    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;
  
    for (let otherBoid of boids) {
      if (distance(boid, otherBoid) < VISUAL_RANGE) {
        centerX += otherBoid.x;
        centerY += otherBoid.y;
        numNeighbors += 1;
      }
    }
  
    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;
  
      boid.dx += (centerX - boid.x) * centeringFactor;
      boid.dy += (centerY - boid.y) * centeringFactor;
    }
  }
  
  // Move away from other boids that are too close to avoid colliding
  function avoidOthers(boid) {
    const minDistance = DISTANCE_APART; // The distance to stay away from other boids
    const avoidFactor = 0.05; // Adjust velocity by this %
    let moveX = 0;
    let moveY = 0;
    for (let otherBoid of boids) {
      if (otherBoid !== boid) {
        if (distance(boid, otherBoid) < minDistance) {
          moveX += boid.x - otherBoid.x;
          moveY += boid.y - otherBoid.y;
        }
      }
    }
  
    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;
  }

  
// Find the average velocity (speed and direction) of the other boids and
// adjust velocity slightly to match.
function matchVelocity(boid) {
    const matchingFactor = 0.05; // Adjust by this % of average velocity
  
    let avgDX = 0;
    let avgDY = 0;
    let numNeighbors = 0;
  
    for (let otherBoid of boids) {
      if (distance(boid, otherBoid) < VISUAL_RANGE) {
        avgDX += otherBoid.dx;
        avgDY += otherBoid.dy;
        numNeighbors += 1;
      }
    }
  
    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;
  
      boid.dx += (avgDX - boid.dx) * matchingFactor;
      boid.dy += (avgDY - boid.dy) * matchingFactor;
    }
  }
  
  // Speed will naturally vary in flocking behavior, but real animals can't go
  // arbitrarily fast.
function limitSpeed(boid) {

    const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
    if (speed > SPEED_LIMIT) {
        boid.dx = (boid.dx / speed) * SPEED_LIMIT;
        boid.dy = (boid.dy / speed) * SPEED_LIMIT;
    }
}
  
const DRAW_TRAIL = false;
  
function drawBoid(ctx, boid) {
    const angle = Math.atan2(boid.dy, boid.dx);
    ctx.translate(boid.x, boid.y);
    ctx.rotate(angle);
    ctx.translate(-boid.x, -boid.y);
    ctx.fillStyle = "#558cf4";
    ctx.beginPath();
    ctx.moveTo(boid.x, boid.y);
    ctx.lineTo(boid.x - 15, boid.y + 5);
    ctx.lineTo(boid.x - 15, boid.y - 5);
    ctx.lineTo(boid.x, boid.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  
    if (DRAW_TRAIL) {
      ctx.strokeStyle = "#558cf466";
      ctx.beginPath();
      ctx.moveTo(boid.history[0][0], boid.history[0][1]);
      for (const point of boid.history) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }
}
  
  // Main animation loop
function animationLoop() {
    // Update each boid
    for (let boid of boids) {
      // Update the velocities according to each rule
      flyTowardsCenter(boid);
      avoidOthers(boid);
      matchVelocity(boid);
      limitSpeed(boid);
      keepWithinBounds(boid);
  
      // Update the position based on the current velocity
      boid.x += boid.dx;
      boid.y += boid.dy;
      boid.history.push([boid.x, boid.y])
      boid.history = boid.history.slice(-50);
    }
  
    // Clear the canvas and redraw all the boids in their current positions
    const ctx = document.getElementById("Canvas").getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(53, 78, 107)';
    ctx.fillRect(0, 0, width, height);
 
    for (var i = 0; i < fishes.length; i++){
       fishes[i].resolve(boids[i].x, boids[i].y)
       fishes[i].display(ctx) 
    }
  
    // Schedule the next frame
    window.requestAnimationFrame(animationLoop);
}

