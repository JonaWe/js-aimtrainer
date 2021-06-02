import Circle from './circle.js';
class Game {
  constructor() {
    this.canvas = document.querySelector('#game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.aspectRatio = 4 / 3;

    window.addEventListener('resize', () => this.resizeCanvas(), false);
    this.resizeCanvas();

    window.requestAnimationFrame((t) => this.gameLoop(t));
    this.lastFPSDrawingTimeStamp = 0;
    this.framesRenderedSinceLastFPSUpdate = 0;
    this.fps = 0;

    this.canvas.onmousedown = (event) => this.onClick(event);
    window.addEventListener('keydown', (event) => this.onKeyDown(event));

    this.menu = true;

    this.initializeGame();
  }

  static getRandomPosition = () => {
    return Math.floor(Math.random() * 81) + 10;
  };

  initializeGame() {
    this.circles = [];

    this.cps = 1;
    this.timeSinceLastCircleSpawn = 0;

    this.gameOver = false;
    this.score = 0;

    this.lastUpdateTime = undefined;
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

  onKeyDown(event) {
    if (event.key == 'Escape' && !this.gameOver && !this.menu)
      this.gameOver = true;

    if (!(this.menu || this.gameOver)) return;

    if (event.key != 'r') return;

    this.initializeGame();
    this.menu = false;
  }

  onClick(event) {
    if (this.menu || this.gameOver) {
      return;
    }

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
        this.score++;
        break;
      }
    }

    if (circleToRemove !== undefined) this.circles.splice(circleToRemove, 1);
    else this.score -= 5;
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
          () => {
            this.gameOver = true;
          }
        )
      );
      this.timeSinceLastCircleSpawn -= (1 / this.cps) * 1000;
    }
    this.cps = Math.min(3, this.cps + delta * 0.00005);

    this.circles.forEach((circle) => {
      circle.update(delta);
    });
  }

  gameLoop(timeStamp) {
    if (this.menu) {
      this.drawOverlay();
      this.drawMenu();
    } else {
      if (!this.gameOver) {
        this.lastUpdateTime ??= timeStamp;
        this.update(timeStamp - this.lastUpdateTime);
        this.lastUpdateTime = timeStamp;
      }
      this.draw();
    }

    if (this.gameOver) {
      this.drawOverlay();
      this.drawGameOver();
      this.drawMenu();
    }

    this.drawScore();
    this.drawCPS();
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
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('FPS: ' + this.fps, 10, 30);
  }

  drawScore() {
    this.ctx.font = '25px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Score: ' + this.score, 10, this.canvas.height - 15);
  }

  drawCPS() {
    this.ctx.font = '25px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      'CPS: ' + this.cps.toFixed(2),
      10,
      this.canvas.height - 45
    );
  }

  drawGameOver() {
    this.ctx.font = '50px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      'Game Over :(',
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  drawOverlay() {
    this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawMenu() {
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      'Press r start the Game',
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }
}

const game = new Game();
