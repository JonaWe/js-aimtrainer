import Circle from './circle.js';
class Game {
  constructor() {
    this.canvas = document.querySelector('#game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.aspectRatio = 4 / 3;

    window.addEventListener('resize', () => this.resizeCanvas(), false);
    this.resizeCanvas();

    this.circles = [];

    this.cps = 1;
    this.timeSinceLastCircleSpawn = 0;

    window.requestAnimationFrame((t) => this.gameLoop(t));
    this.lastFPSDrawingTimeStamp = 0;
    this.framesRenderedSinceLastFPSUpdate = 0;
    this.fps = 0;

    this.gameOver = false;
    this.score = 0;

    this.canvas.addEventListener('click', (event) => this.onClick(event));
  }

  static getRandomPosition = () => {
    return Math.floor(Math.random() * 81) + 10;
  };

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

  onClick(event) {
    if (this.gameOver) return;

    const absoluteX =
      event.pageX - (this.canvas.offsetLeft + this.canvas.clientLeft);
    const absoluteY =
      event.pageY - (this.canvas.offsetTop + this.canvas.clientTop);
    const x = (absoluteX / this.canvas.width) * 100;
    const y = (absoluteY / this.canvas.height) * 100;

    let circleToRemove;

    for (let i in this.circles) {
      let circle = this.circles[i];
      if (circle.inBounds(x, y)) {
        circleToRemove = i;
        console.log('hit');
        this.score++;
        break;
      }
    }

    if (circleToRemove !== undefined) this.circles.splice(circleToRemove, 1);
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
    this.timeSinceLastCircleSpawn += delta;

    if (this.timeSinceLastCircleSpawn / 1000 >= 1 / this.cps) {
      this.circles.unshift(
        new Circle(
          this.ctx,
          Game.getRandomPosition(),
          Game.getRandomPosition(),
          () => (this.gameOver = true)
        )
      );
      this.timeSinceLastCircleSpawn -= (1 / this.cps) * 1000;
    }

    this.circles.forEach((circle) => {
      circle.update(delta);
    });
  }

  gameLoop(timeStamp) {
    if (!this.gameOver) {
      this.lastUpdateTime ??= timeStamp;
      this.update(timeStamp - this.lastUpdateTime);
      this.lastUpdateTime = timeStamp;
    }

    this.draw();
    this.drawFPS(timeStamp);
    this.drawScore();
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
  drawScore() {
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Score: ' + this.score, 10, this.canvas.height - 15);
  }
}

const game = new Game();
