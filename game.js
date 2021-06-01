const canvas = document.querySelector('#game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function draw(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawCircle(200, 500, 50, 'red');
}

let secondsPassed;
let oldTimeStamp = 0;
let frames = 0;
let fps = 0;

window.requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
  draw(ctx);
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  frames++;
  if (secondsPassed >= 1) {
    oldTimeStamp = timeStamp;

    fps = Math.round((1 / secondsPassed) * frames);
    frames = 0;
  }
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 145, 43);
  ctx.font = '25px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('FPS: ' + fps, 10, 30);
  window.requestAnimationFrame(gameLoop);
}
