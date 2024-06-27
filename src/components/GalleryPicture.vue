<template>
  <div class="image-container">
    <div id="mask-container" ref="mask_c">
      <div class="mask" ref="mask" :style="maskStyles"></div>
    </div>
    <img :src="imageSource" @load="imageLoaded" data="Current image" ref="image"/>
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
// import Cropper from "cropperjs";
// import {imageSource} from "./TogglesInput.vue"
export default {
  name: "GalleryPicture",

  created() {
    
    this.updateImageSource(this.imageSource);
    // (this.widthC,
    // this.heightC, imgBox.width, imgBox.height)
  },

  beforeUnmount() {
    eventBus.off("imageUploaded", this.updateImageSource);
    eventBus.off("cropPosUploaded", (pos) => this.updateMaskPos(pos));
    eventBus.off("cropInfoUploaded", (dem) => {
      this.temp_dem.a = dem.a;
      this.temp_dem.b = dem.b;
      this.temp_dem.c = dem.c;
      this.temp_dem.d = dem.d;
    });
    window.removeEventListener('resize', this.updateMask_C_Size);
  },

  props: {
  },

  data() {
    return {
      isImageLoad: false,
      imageSource: require("@/assets/1.png"),
      helper_calc_pos: {w: 100, h: 100},
      mask_pos: {x: 0 , y: 0},
      mask_dem: {w: 100 , h: 100},
      temp_dem: {
        a: null,
        b: null,
        c: null,
        d: null,
      },
      //   updateImageSource
    };
  },

  watch: {
    isImageLoad() {
      if(this.isImageLoad){
        console.log("image loaded");
        this.updateMask_C_Size();
        this.updateMaskDem(this.temp_dem.a, this.temp_dem.b, this.temp_dem.c, this.temp_dem.d);
        this.isImageLoad = false;
      }
    },

    temp_dem() {
      console.log("main image mask update");
      if(this.temp_dem.a !== null && this.temp_dem !== null && this.temp_dem.c !== null && this.temp_dem.d !== null){
        this.updateMaskDem(this.temp_dem.a, this.temp_dem.b, this.temp_dem.c, this.temp_dem.d);
      }
    }
  },

  methods: {
    imageLoaded() {
      this.isImageLoad = true;
    },

    
    updateImageSource(newSource) {
      this.imageSource = newSource;

      this.$nextTick(() => {
        this.updateMask_C_Size();
      });
    },

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
  },

  computed: {
    maskStyles() {
      return {
        width: this.mask_dem.w + "%",
        height: this.mask_dem.h + "%",

        left: this.mask_pos.x + "px",
        top: this.mask_pos.y + "px",
      }

    },
  },

  mounted() {
    this.updateImageSource(this.imageSource);
    eventBus.on("imageUploaded", this.updateImageSource);
    eventBus.on("cropPosUploaded", (pos) => this.updateMaskPos(pos));
    eventBus.on("cropInfoUploaded", (dem) => {
      this.temp_dem.a = dem.a;
      this.temp_dem.b = dem.b;
      this.temp_dem.c = dem.c;
      this.temp_dem.d = dem.d;
    });
    // this.updateImageSource(this.imageSource);
    window.addEventListener('resize', this.updateMask_C_Size);
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

#mask-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // border: 1px solid #646464;
  background-color: gray;
  opacity: 0.5;
  user-select: none;

  z-index: 1;
  width: 50%;
  height: 20%;
  max-width: 600px;
  // object-fit: cover;


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
}

img {
  width: 50%;
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