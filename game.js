class Game {
  constructor() {
    this.canvas = document.querySelector('#game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.aspectRatio = 3 / 2;

    window.addEventListener('resize', () => this.resizeCanvas(), false);
    this.resizeCanvas();

    this.helper = new Helper(this.ctx);

    window.requestAnimationFrame((t) => this.gameLoop(t));
    this.lastFPSDrawingTimeStamp = 0;
    this.framesRenderedSinceLastFPSUpdate = 0;
    this.fps = 0;
  }

  resizeCanvas() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    this.canvas.height = this.aspectRatio
      ? Math.min(windowHeight, windowWidth * (1 / this.aspectRatio))
      : windowHeight;
    this.canvas.width = this.aspectRatio
      ? Math.min(windowWidth, windowHeight * this.aspectRatio)
      : windowWidth;
  }

  drawBG() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw() {
    this.drawBG();
    this.helper.drawCircle(0.25, 0.5, 0.1, 'red');
  }

  gameLoop(timeStamp) {
    this.draw();
    this.drawFPS(timeStamp);
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }

  drawFPS(timeStamp) {
    const secondsPassed = (timeStamp - this.lastFPSDrawingTimeStamp) / 1000;
    this.framesRenderedSinceLastFPSUpdate++;
    if (secondsPassed >= 1) {
      this.lastFPSDrawingTimeStamp = timeStamp;

      this.fps = Math.round(
        (1 / secondsPassed) * this.framesRenderedSinceLastFPSUpdate
      );
      this.framesRenderedSinceLastFPSUpdate = 0;
    }
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('FPS: ' + this.fps, 10, 30);
  }
}

class Helper {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawCircle(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.ctx.canvas.width,
      y * this.ctx.canvas.height,
      radius * this.ctx.canvas.height,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}

const game = new Game();
