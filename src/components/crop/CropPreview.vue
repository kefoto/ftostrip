<template>
  <div class="container">
    <div ref="imgBox" :style="imgBoxStyles" class="img-box" @load="set_imgBox_rect">
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
//TODO: check calling for optimization
import eventBus from "../../util/eventBus";
import { debounce } from "lodash";

import {
  startDragging,
  dragCropBox,
  stopDragging,
  // checkBorder
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
      imgBox_rect: { w: 0, h: 0 },
      cropBox_rect: { w: 0, h: 0 },
    };
  },

  mounted() {
    this.debouncedUpdate = debounce(this.update, 100);
    this.calculateInputDimensions();
    this.debouncedUpdate();
  },

  props: {
    inputSize: {
      type: Number,
      required: true,
    },
    cropSize: {
      type: Number,
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
    calculateInputDimensions() {
      let temp_h = 100,
        temp_w = 100;
      if (this.inputSize > 1) {
        temp_h = temp_w / this.inputSize;
      } else {
        temp_w = temp_h * this.inputSize;
      }
      this.widthI = temp_w;
      this.heightI = temp_h;

      this.set_imgBox_rect();

      // console.log("2", this.widthI, this.heightI);
      // console.log('calculate input dimension')
    },

    set_imgBox_rect() {
      const imgBox = this.$refs.imgBox;
      this.imgBox_rect = { w: imgBox.clientWidth * this.widthI / 100, h: imgBox.clientHeight * this.heightI / 100};
      // console.log(imgBox.clientWidth, imgBox.clientHeight, this.widthI,
      // this.heightI)
    },

    d_toString(x) {
      return x + "%";
    },

    //calculate Crop emits sizing information
    calculateCrop() {
      let temp_h = 100,
        temp_w = 100;

      let crop_temp = this.cropSize;
      let scale_percent = this.scale / 10;

      if (this.isInverted) {
        crop_temp = 1 / crop_temp;
      }

      // height is shorter
      if (this.inputSize > crop_temp) {
        this.widthC = (scale_percent * temp_h * crop_temp) / this.inputSize;
        this.heightC = scale_percent * temp_w;
        // width is shorter
      } else {
        this.heightC = (scale_percent * temp_w * this.inputSize) / crop_temp;
        this.widthC = scale_percent * temp_h;
      }

      this.cropBox_rect = {
        w: (this.imgBox_rect.w * this.widthC) / 100,
        h: (this.imgBox_rect.h * this.heightC) / 100,
      };
      // console.log("1", this.cropBox_rect);
    },

    update() {
      this.calculateCrop();
      this.checkBorder();
      this.$nextTick(() => {
        this.emit_dem();
      });
    },

    // reset?
    //check border emits location information
    checkBorder() {
      this.c_position.x = Math.max(
        0,
        Math.min(this.c_position.x, this.imgBox_rect.w - this.cropBox_rect.w)
      );
      this.c_position.y = Math.max(
        0,
        Math.min(this.c_position.y, this.imgBox_rect.h - this.cropBox_rect.h)
      );
      // console.log("2",
      //   this.cropBox_rect, this.imgBox_rect,
      //   this.imgBox_rect.w - this.cropBox_rect.w,
      //   this.imgBox_rect.h - this.cropBox_rect.h
      // );

      eventBus.emit("cropPosUploaded", this.c_position);
      // eventBus.emit("cropPosUploaded", 
      // {
      //   x: this.c_position.x/(this.imgBox_rect.w - this.cropBox_rect.w),
      //   y: this.c_position.y/(this.imgBox_rect.h - this.cropBox_rect.h)
      // });
    },

    emit_dem() {
      const imgBox = this.$refs.imgBox;

      eventBus.emit("cropInfoUploaded", {
        a: this.widthC,
        b: this.heightC,
        c: imgBox.clientWidth,
        d: imgBox.clientHeight,
      });
    },

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
      // Change the this.c_position
      dragCropBox(event, this);
    },

    stopDragging() {
      stopDragging(this.dragCropBox, this.stopDragging);
      this.$nextTick(() => {
        eventBus.emit("cropPosUploaded", this.c_position);
        // console.log(this.c_position);
      });
    },
  },
  watch: {
    inputSize() {
      // console.log("1");
      this.calculateInputDimensions();
      this.debouncedUpdate();
    },

    cropSize() {
      this.debouncedUpdate();
    },

    isInverted() {
      this.debouncedUpdate();
    },

    scale() {
      this.debouncedUpdate();
    },
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
  //   beforeUnmount() {
  //     window.removeEventListener('resize', this.updateBoxSizes);
  //   },
};
</script>

<style lang="scss" scoped>
.container {
  z-index: 20;
  position: inherit;
  display: flex;
  width: 100%;
  height: 100%;
  // background-color: black;

  .img-box {
    position: relative;
    display: flex;

    margin: auto;
    background-color: lightgrey;
    opacity: 0.7;
    transition: all 0.2s ease;

    .crop-box {
      position: absolute;
      border: 0.5px solid white;
      background-color: red;
      opacity: 0.7;
      transition: all 0.2s ease;

      &:hover {
        cursor: move;
      }
    }
    // }
  }
}
</style>