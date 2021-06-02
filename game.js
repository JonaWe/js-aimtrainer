class Game {
  constructor() {
    this.canvas = document.querySelector('#game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.aspectRatio = 4 / 3;

    window.addEventListener('resize', () => this.resizeCanvas(), false);
    this.resizeCanvas();

    this.circles = [];
    const getRandomPosition = () => {
      return Math.floor(Math.random() * 81) + 10;
    };

    for (let i = 0; i < 10; i++) {
      this.circles.push(
        new Circle(this.ctx, getRandomPosition(), getRandomPosition())
      );
    }

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
    this.circles.forEach((circle) => {
      circle.draw();
    });
  }

  update(delta) {
    this.circles.forEach((circle) => {
      circle.update(delta);
    });
  }

  gameLoop(timeStamp) {
    this.lastUpdateTime ??= timeStamp;
    this.update(timeStamp - this.lastUpdateTime);
    this.lastUpdateTime = timeStamp;

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

class Circle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = 0;
    this.color = 'red';
    this.outlineColor = 'white';
    this.outlineThickness = 1.03;
  }

  drawCircle(x, y, radius, color) {
    this.ctx.beginPath();
    this.ctx.arc(
      x * (this.ctx.canvas.width / 100),
      y * (this.ctx.canvas.height / 100),
      radius *
        (Math.sqrt(this.ctx.canvas.width * this.ctx.canvas.height) / 100),
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  draw() {
    this.drawCircle(
      this.x,
      this.y,
      this.size * this.outlineThickness,
      this.outlineColor
    );

    this.drawCircle(this.x, this.y, this.size, this.color);
  }

  update(delta) {
    if (this.size < 20) this.size = Math.min(this.size + delta * 0.0025, 20);
  }
}

const game = new Game();
