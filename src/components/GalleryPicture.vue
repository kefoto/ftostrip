<template>
  <div class="image-container">
    <!-- <div id="mask"></div> -->
    <img :src="imageSource" alt="Current image" />
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
// import {imageSource} from "./TogglesInput.vue"
export default {
  name: "GalleryPicture",

  created() {
<<<<<<< HEAD
    
    this.updateImageSource(this.imageSource);
    // (this.widthC,
    // this.heightC, imgBox.width, imgBox.height)
=======
    eventBus.on("imageUploaded", this.updateImageSource);
>>>>>>> parent of 6bbdbad (tried to update the main image from the preview, the emitter has an issue, resizing has an issue)
  },

  beforeUnmount() {
    eventBus.off("imageUploaded", this.updateImageSource);
  },

  props: {
    initialImageSource: {
      type: String,
      default: () => require("@/assets/1.png"),
    },
  },

  data() {
    return {
      imageSource: this.initialImageSource,
      //   updateImageSource
    };
  },

  methods: {
    updateImageSource(newSource) {
      this.imageSource = newSource;
    },
<<<<<<< HEAD

    updateMask_C_Size() {
      const image = this.$refs.image;
      const mask_c = this.$refs.mask_c;
      // const mask = this.$refs.mask;
      if (image && mask_c) {
        mask_c.style.width = `${image.clientWidth}px`;
        mask_c.style.height = `${image.clientHeight}px`;
        // mask.style.width = `${image.clientWidth}px`;
        // mask.style.height = `${image.clientHeight}px`;
      
        // mask.style.top = `${image.offsetTop}px`;
        // mask.style.left = `${image.offsetLeft}px`;
      }
    },

    updateMaskPos(pos) {
      const mask_c = this.$refs.mask_c;
      this.mask_pos.x = mask_c.clientWidth * pos.x / this.helper_calc_pos.w;
      this.mask_pos.y = mask_c.clientHeight * pos.y / this.helper_calc_pos.h;

      // console.log(pos);
    },

    updateMaskDem(wper, hper, imgw, imgh) {
      this.mask_dem.w = wper;
      this.mask_dem.h = hper;

      this.helper_calc_pos.w = imgw;
      this.helper_calc_pos.h = imgh;

      // console.log(wper, hper, imgw, imgh);
    },
    // updateMask
=======
>>>>>>> parent of 6bbdbad (tried to update the main image from the preview, the emitter has an issue, resizing has an issue)
  },

  computed: {
    clipping() {
      return {
        'clip-path': `rect({}px {}px {}px {}px)`
      }
<<<<<<< HEAD

    },
  },

  mounted() {
    this.updateImageSource(this.imageSource);
    eventBus.on("imageUploaded", this.updateImageSource);
    eventBus.on("cropPosUploaded", (pos) => this.updateMaskPos(pos));
    eventBus.on("cropInfoUploaded", (dem) => this.updateMaskDem(dem.a, dem.b, dem.c, dem.d));
    // this.updateImageSource(this.imageSource);
    window.addEventListener('resize', this.updateMask_C_Size);
=======
    }
>>>>>>> parent of 6bbdbad (tried to update the main image from the preview, the emitter has an issue, resizing has an issue)
  },

};
</script>

<style lang="scss">
.image-container {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  // background-color: red;

  transition: all 0.3s ease;
}

#mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 1px solid #646464;
  // background-color: black;
  user-select: none;

  z-index: 1;
  width: 60%;
  height: 20%;
  max-width: 600px;
  // object-fit: cover;
<<<<<<< HEAD


  .mask{
    position: relative;
    background-color: red;
    opacity: 0.4;

    transition: all 1s ease;
    // left: 10px;
    // top: 10px;
    // z-index: 1;
    // border: 1px solid white;
    
  }
=======
>>>>>>> parent of 6bbdbad (tried to update the main image from the preview, the emitter has an issue, resizing has an issue)
}

img {
  width: 60%;
  max-width: 600px;
  height: auto;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 0;
  // object-fit: cover;
  user-select: none;

  // TODO: use clippath
  //   border: 1px solid #ccc;
  //   border-radius: 4px;
}
</style>