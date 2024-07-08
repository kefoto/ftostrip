<template>
    <div class="container">
      <canvas ref="canvas"></canvas>
      <img
        ref="image"
        :src="src"
        style="display: none"
        @load="initiateViewModel"
      />
    </div>
</template>
  
<script>
import { Effect } from "../../util/Particle.js";

export default {
  name: "imgToParticle",

  data() {
    return {
      window: {
        w: window.innerWidth,
        h: window.innerHeight
      },
      effect: null,
      running: false,
    };
  },

  props: {
    src: {
      type: String,
      required: true,
    },
    
    dem: {
      type: Object,
      required: true,
    },
    // isActive: {
    //   type: Boolean,
    //   required: true,
    // },
  },

  watch: {
    isActive(newVal) {
      if (!newVal) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    }
  },

  mounted() {
    // console.log(this.$refs.canvas);
    // this.initCanvas();

    this.$nextTick(() => {
      this.initCanvas();
    });
    
    window.addEventListener("resize", this.resizeCanvas);
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeUnmount() {

    window.removeEventListener("resize", this.resizeCanvas);
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.stopAnimation();
  },
  methods: {
    initCanvas() {
      console.log('Canvas ref:', this.$refs.canvas);
      console.log('Window object:', this.window);

      const canvas = this.$refs.canvas;
      canvas.width = this.window.w;
      canvas.height = this.window.h;

      // console.log(this.window);
      this.resizeCanvas(); // Ensure canvas is resized properly on initial load
    },
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = this.window.w;
      canvas.height = this.window.h;
      if (this.effect) {
        this.effect.width = canvas.width;
        this.effect.height = canvas.height;
        this.effect.init(canvas.getContext("2d")); // Re-initialize the effect to fit the new dimensions
      }
    },
    initiateViewModel() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      const image = this.$refs.image;

      console.log(this.dem);

      this.effect = new Effect(canvas.width, canvas.height, this.dem.w, this.dem.h, image);
      this.effect.init(ctx);
      this.startAnimation()
    },

    startAnimation() {
      this.running = true;
      this.animate();
    },
    stopAnimation() {
      this.running = false;
    },

    animate() {
      if (!this.running) return;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.effect.draw(ctx);
      this.effect.update();
      requestAnimationFrame(this.animate);
    },

    handleMouseMove(event) {

      if (this.effect) {
        this.effect.mouse.x = event.x;
        this.effect.mouse.y = event.y;
        // console.log(this.effect.mouse.x, this.effect.mouse.y);
      }
    },
  },
};
</script>

<style scoped lang="scss">

.container {

  width: 100%;
  height: 100%;
}
canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
}

img {
  width: 40%;
  max-width: 600px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 0;
  // object-fit: cover;
  user-select: none;

  //   border: 1px solid #ccc;
  //   border-radius: 4px;
}

</style>
  