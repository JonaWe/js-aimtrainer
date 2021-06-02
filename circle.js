export default class Circle {
  constructor(ctx, x, y, gameOver) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.gameOver = gameOver;
    this.size = 0;
    this.maxSize = 7.5;
    const colorRange = 30;
    this.color = {
      hue: 360 - colorRange / 2 + Math.random() * colorRange,
      saturation: 30,
      lightness: 50,
    };
    this.outlineColor = 'white';
    this.outlineThickness = 1.03;
  }

  static createHSL(hue, saturation, lightness) {
    return `hsl(${hue % 360},${saturation}%,${lightness}%)`;
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

    this.drawCircle(
      this.x,
      this.y,
      this.size,
      Circle.createHSL(
        this.color.hue,
        this.color.saturation +
          this.size * ((100 - this.color.saturation) / this.maxSize),
        this.color.lightness
      )
    );
  }

  inBounds(x, y) {
    return (
      Math.sqrt(
        Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2)
      ) <= this.size
    );
  }

  update(delta) {
    if (this.size < this.maxSize)
      this.size = Math.min(this.size + delta * 0.0025, this.maxSize);
    else {
      this.color.hue = 180;
      this.color.lightness = 35;
      this.gameOver();
    }
  }
}