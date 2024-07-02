<template>
  <div class="image-container">
    <div id="mask-container" ref="mask_c" :style="maskCStyles">
      <div class="mask" ref="mask" :style="maskStyles"></div>
    </div>
    <!-- TODO: the sizing for those two images does not match -->
    <img :src="imageSource" @load="updateMask_C_Size" data="Current image" ref="image"/>
    <img :src="resultSource" data="Result image" ref="result" :style="resultImgStyles"/>
    <canvas ref="canvas" style="display: none;"></canvas>
    <!-- <img :src="imageSource" @load="imageLoaded" data="Current image" ref="image"/> -->
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
// import Cropper from "cropperjs";
// import {imageSource} from "./TogglesInput.vue"
export default {
  name: "GalleryPicture",

  created() {
    // this.updateImageSource(this.imageSource);

    eventBus.on("imageUploaded", this.updateImageSource);
    eventBus.on("CropConfirmed", this.initiateCropping);

    eventBus.on("cropPosUploaded", (pos) => this.updateMaskPos(pos));
    eventBus.on("cropInfoUploaded", (dem) => this.updateMaskDem(dem.a, dem.b, dem.c, dem.d));
    eventBus.on("TableExpanded",  this.updatePMaskShow);

    eventBus.on("UploadResultImage", this.updateResultSource);

    window.addEventListener('resize', this.updateMask_C_Size);
  },

  beforeUnmount() {
    eventBus.off("imageUploaded", this.updateImageSource);
    eventBus.off("CropConfirmed", this.initiateCropping);

    eventBus.off("cropPosUploaded", (pos) => this.updateMaskPos(pos));
    eventBus.off("cropInfoUploaded", (dem) => this.updateMaskDem(dem.a, dem.b, dem.c, dem.d));
    eventBus.off("TableExpanded",  this.updatePMaskShow);

    eventBus.off("UploadResultImage", this.updateResultSource);

    window.removeEventListener('resize', this.updateMask_C_Size);
  },

  props: {
  },

  data() {
    return {
      isPreviewMaskShow: false,
      isImageLoad: false,
      
      imageSource: require("@/assets/2.jpg"),
      resultSource: null,

      helper_calc_pos: {w: 100, h: 100},
      mask_pos: {x: 0 , y: 0},
      mask_dem: {w: 100 , h: 100},

    };
  },

  watch: {
  },

  methods: {
    imageLoaded() {
      this.isImageLoad = true;
    },

    updatePMaskShow(x) {
      this.isPreviewMaskShow = x;
    },

    updateImageSource(newSource) {
      // console.log(this.imageSource);
      this.imageSource = newSource;

      this.$nextTick(() => {
        this.updateMask_C_Size();
      });
    },

    updateResultSource(newSource) {
      this.resultSource = newSource;
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

      // console.log(wper, hper, imgw, imgh);`
    },

    initiateCropping() {

      var image = this.$refs.image;
      const mask_c = this.$refs.mask_c;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');


      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      // change mask_pos to percentage
      const pos_x_per =  this.mask_pos.x / (mask_c.clientWidth);
      const pos_y_per =  this.mask_pos.y / (mask_c.clientHeight);
      

      const originalLeft = originalWidth * pos_x_per;
      const originalTop = originalHeight * pos_y_per;
      const originalCropWidth = originalWidth * this.mask_dem.w / 100;
      const originalCropHeight = originalHeight * this.mask_dem.h / 100;
      

      console.log(originalLeft, originalTop, originalCropWidth, originalCropHeight);

      if(originalCropWidth > 50 && originalCropHeight > 50) {
        canvas.width = originalCropWidth;
        canvas.height = originalCropHeight;

        ctx.drawImage(image,
          originalLeft, originalTop, originalCropWidth, originalCropHeight, // Source rectangle
          0, 0, originalCropWidth, originalCropHeight // Destination rectangle
        );

        eventBus.emit("uploadCropSource", canvas.toDataURL('image/jpeg'));
      } else {
        alert("The cropped Image can not be smaller than 50 * 50 pixels");
        
      }

      // console.log(croppedCanvas);

      

      // console.log(canvas.toDataURL('image/jpeg'));

      
    }
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
    maskCStyles() {
      return {
        opacity: this.isPreviewMaskShow ? 1 : 0,
        transition: 'opacity 0.3s ease', // Adjust the transition duration and easing as needed
      };
    },

    resultImgStyles() {
      return {
        'position': 'absolute',
        // 'top': '50%',
        // 'left': '50%',
        // 'transform': 'translate(-50%, -50%)',
        'background-color': 'red',
        opacity: 1,
      }
    }
  },

  mounted() {
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

  // transition: all 0.3s ease;
}

#mask-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // border: 1px solid #646464;
  // background-color: grey;
  // opacity: 0.5;
  user-select: none;

  z-index: 1;
  width: 50%;
  height: 20%;
  max-width: 600px;
  // object-fit: cover;


  .mask{
    position: relative;
    background-color: rgb(232, 15, 15);
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
  position: absolute;
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