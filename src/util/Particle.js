
window.addEventListener("load", function () {
  const canvas = document.getElementById();
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const image1 = document.getElementById();
});

class Particle {
  constructor(effect, x, y, color) {
    this.effect = effect;
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
    // this.speed = 0;
    this.origin = {x: Math.floor(x), y: Math.floor(y)};
    this.color = color,
    this.vx = 0;
    this.vy = 0;
    this.size = this.effect.gap;
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
    this.ease = 0.015; //editable
    this.friction = 0.92; //editable
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    this.dx = this.effect.mouse.x - this.x;
    this.dy = this.effect.mouse.y - this.y;
    this.distance = this.dx * this.dx + this.dy + this.dy;
    this.force = (-1) * this.effect.mouse.radius / this.distance;

    if(this.distance < this.effect.mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);

    }

    this.x += (this.vx *= this.friction) + (this.origin.x - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.origin.y - this.y) * this.ease;
  }

  warp() {
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
    this.ease = 0.05;
  }
}

class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particlesArray = [];
        this.image = document.getElementById();
        this.centerX = this.width * 0.5; 
        this.centerY = this.height * 0.5;
        this.x = this.centerX - this.image.width * 0.5;
        this.y = this.centerY - this.image.height * 0.5;
        
        this.gap = 3;  //editable

        this.mouse = {
          radius: 2500,  //editable
          x: undefined,
          y: undefined,
        }

        window.addEventListener('mousemove', (e) => {
          this.mouse.x = e.x;
          this.mouse.y = e.y;
          console.log(this.mouse.x, this.mouse.y)
        });
    }

    init(context) {
        context.drawImage(this.image, this.x, this.y);
        const pixels = context.getImageData(0, 0, this.width, this.height).data;
        for(let y = 0; y < this.height; y += this.gap){
            for(let x = 0; x < this.width; x += this.gap){
                const index = (y * this.width + x ) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const color = `rgb(${ red }, ${green}, ${blue})`;

                if(alpha > 0) {
                    this.particlesArray.push(new Particle(this, x, y, color));
                }
            }
        }
    }

    draw(context) {
        this.particlesArray.forEach(particle => particle.draw(context));
        context.drawImage(this.image, 0, 0);
    }
    update() {
        this.particlesArray.forEach(particle => particle.update());
    }
    warp() {
      this.particlesArray.forEach(particle => particle.warp());
    }

}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
}
