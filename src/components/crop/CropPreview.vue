<template>
  <div class="container">
    <div ref="imgBox" :style="imgBoxStyles" class="img-box">
      <div
        ref="cropBox"
        :style="cropBoxStyles"
        class="crop-box"
        @mousedown="startDragging"
        @touchstart="startDragging"
      >
        <!-- <p v-if="cropSize">{{ cropSize }} {{ inputSize }}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
//TODO: when the bounding box changes, the mask changes,
// import eventBus from "../../util/eventBus";

import {
  startDragging,
  dragCropBox,
  stopDragging,
} from "../../util/dragUtil.js";
// src/util/dragElement/dragMotion.js
export default {
  name: "CropPreview",

  data() {
    return {
      // all of those width and height are percentage
      widthI: 100,
      heightI: 100,

      widthC: 100,
      heightC: 100,

      cropSize_num: 1,

      c_position: { x: 0, y: 0 },
    };
  },

  created() {
    this.calculateImageDimensions();
    this.calculateCrop();
  },

  props: {
    inputSize: {
      type: Number,
      required: true,
    },
    cropSize: {
      type: String,
      required: true,
    },
    isInverted: {
      type: Boolean,
      required: true,
    },
    scale: {
      type: Number,
      required: true,
    },
  },

  methods: {
    calculateImageDimensions() {
      let temp_h = 100,
        temp_w = 100;
      if (this.inputSize > 1) {
        temp_h = temp_w / this.inputSize;
      } else {
        temp_w = temp_h * this.inputSize;
      }
      this.widthI = temp_w;
      this.heightI = temp_h;

      //   console.log(this.inputSize);
    },

    d_toString(x) {
      return x + "%";
    },

    calculateCrop() {
      //   let temp_h = 100,
      //     temp_w = 100;
      //   const crop_size_temp = this.cropSize.replace(":", "/");
      //   const sizeArr = this.cropSize.split(":");
      //   let w = sizeArr[0];
      //   let h = sizeArr[1];
      let crop_temp = this.cropSize;
      let scale_percent = this.scale / 10;

      //   this.inputSize, this.widthI, this.heightI,

      if (this.isInverted) {
        crop_temp = 1 / crop_temp;
      }

      if (crop_temp > this.inputSize) {
        this.heightC =
          scale_percent *
          (this.widthI / this.inputSize / crop_temp) *
          this.inputSize;
        this.widthC = (scale_percent * this.widthI) / this.inputSize;
      } else {
        this.widthC =
          (scale_percent * (this.heightI * this.inputSize * crop_temp)) /
          this.inputSize;
        this.heightC = scale_percent * this.heightI * this.inputSize;
      }
    },

    // updateBoxSizes() {
    //   this.updateImgBoxSize();
    //   this.updateCropBoxSize();
    // },

    // updateImgBoxSize() {
    //     const imgBox = this.$refs.imgBox.getBoundingClientRect();
    //     this.imgBox_rect.w = imgBox.width;
    //     this.imgBox_rect.h = imgBox.height;

    //     console.log(`Image Box - Width: ${this.imgBoxWidth}, Height: ${this.imgBoxHeight}`);
    // },

    // updateCropBoxSize() {
    //     const cropBox = this.$refs.cropBox.getBoundingClientRect();
    //     this.cropBox_rect.w = cropBox.width;
    //     this.cropBox_rect.h = cropBox.height;

    //     console.log(`Crop Box - Width: ${this.cropBoxWidth}, Height: ${this.cropBoxHeight}`);
    // },

    startDragging(event) {
      const imgBox = this.$refs.imgBox.getBoundingClientRect();
      const cropBox = this.$refs.cropBox.getBoundingClientRect();
      startDragging(
        event,
        imgBox,
        cropBox,
        this.dragCropBox,
        this.stopDragging
      );
    },

    dragCropBox(event) {
      dragCropBox(event, this);
    },

    stopDragging() {
      stopDragging(this.dragCropBox, this.stopDragging);
    },
  },
  watch: {
    inputSize() {
      // console.log(this.inputSize);
      this.calculateImageDimensions();
      this.calculateCrop();
    },

    cropSize() {
      this.calculateCrop();
    },

    isInverted() {
      this.calculateCrop();
    },

    scale() {
      this.calculateCrop();
    },

    // Add more watchers as needed for other properties
  },

  computed: {
    imgBoxStyles() {
      return {
        width: this.d_toString(this.widthI),
        height: this.d_toString(this.heightI),
      };
    },
    cropBoxStyles() {
      return {
        // "aspect-ratio": this.CropSize,
        width: this.d_toString(this.widthC),
        height: this.d_toString(this.heightC),

        left: this.c_position.x + "px",
        top: this.c_position.y + "px",
      };
    },
  },

  //   mounted() {
  //     this.calculateImageDimensions();
  //     this.updateBoxSizes();
  //     window.addEventListener('resize', this.updateBoxSizes);
  //   },
  //   beforeUnmount() {
  //     window.removeEventListener('resize', this.updateBoxSizes);
  //   },
};
</script>

<style lang="scss" scoped>
.container {
  position: inherit;
  display: flex;
  width: 100%;
  height: 100%;

  .img-box {
    position: relative;
    display: flex;

    margin: 0 auto auto auto;
    background-color: lightgrey;
    opacity: 0.7;
    transition: all 0.2s ease;
    // .crop-box {

    .crop-box {
      position: absolute;
      border: 0.5px solid white;
      background-color: red;
      opacity: 0.7;
      //   left: 0;
      //   top: 0;
      transition: all 0.2s ease;
      // transform: ;
      //   width: 50%;
      //   height: 40%;

      &:hover {
        cursor: grab;
      }
    }
    // }
  }
}
</style>