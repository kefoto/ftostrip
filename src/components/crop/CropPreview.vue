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
import eventBus from "../../util/eventBus";

import {
  startDragging,
  dragCropBox,
  stopDragging,
  //   checkBorder
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
    this.calculateInputDimensions();
    this.update();
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

      //   console.log(this.inputSize);
      // console.log('calculate input dimension')
    },

    d_toString(x) {
      return x + "%";
    },

    calculateCrop() {
      //   const crop_size_temp = this.cropSize.replace(":", "/");
      //   const sizeArr = this.cropSize.split(":");
      //   let w = sizeArr[0];
      //   let h = sizeArr[1];
      let crop_temp = this.cropSize;
      let scale_percent = this.scale / 10;

      if (this.isInverted) {
        crop_temp = 1 / crop_temp;
      }

      if (crop_temp > this.inputSize) {
        this.heightC =
          Math.round(scale_percent *
          (this.widthI / this.inputSize / crop_temp) *
          this.inputSize);
        this.widthC = Math.round((scale_percent * this.widthI) / this.inputSize);
      } else {
        this.widthC =
          Math.round((scale_percent * (this.heightI * this.inputSize * crop_temp)) /
          this.inputSize);
        this.heightC = Math.round(scale_percent * this.heightI * this.inputSize);
      }


      // console.log('calculate crop dimension')
    },

    update() {
        this.calculateCrop();
        this.$nextTick(() => {
            this.emit_dem();
        });
        
    },

    emit_dem() {
        const imgBox = this.$refs.imgBox;
        
        // console.log(this.widthC,
        //     this.heightC, imgBox.clientWidth, imgBox.clientHeight);
        eventBus.emit("cropInfoUploaded", {a: this.widthC, b: this.heightC, c:imgBox.clientWidth, d:imgBox.clientHeight});
        // console.log('emit preview dim information')
            // /
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
        });
    },
    // checkBorder() {
    //   const imgBox = this.$refs.imgBox.getBoundingClientRect();
    //   const cropBox = this.$refs.cropBox.getBoundingClientRect();

    //   let imgBox_rect = {
    //     w: imgBox.width,
    //     h: imgBox.height,
    //     l: imgBox.left,
    //     t: imgBox.top,
    //   };
    //   let cropBox_rect = {
    //     w: cropBox.width,
    //     h: cropBox.height,
    //     l: cropBox.left,
    //     t: cropBox.top
    //   }

    //   if((imgBox_rect.w + imgBox_rect.l - cropBox_rect.w - cropBox_rect.l) < 0){
    //     console.log(imgBox_rect.w + imgBox_rect.l - cropBox_rect.w - cropBox_rect.l);

    //     this.$nextTick(() => {
    //         this.c_position.x += (imgBox_rect.w + imgBox_rect.l - cropBox_rect.w - cropBox_rect.l);
    //     });
        
    //   }
    //   if((imgBox_rect.h + imgBox_rect.t - cropBox_rect.h - cropBox_rect.t) < 0){
    //     // console.log(imgBox_rect.h + imgBox_rect.t - cropBox_rect.h - cropBox_rect.t);
    //     this.$nextTick(() => {
    //     this.c_position.y += (imgBox_rect.h + imgBox_rect.t - cropBox_rect.h - cropBox_rect.t);
    //     });
    //   }

    // //   console.log(imgBox,cropBox);

    // },
  },
  watch: {
    inputSize() {
      // console.log(this.inputSize);
      this.calculateInputDimensions();
      this.update();
    //   this.checkBorder();
      //   checkBorder(this.c_position);
    },

    cropSize() {
        this.update();
    
    },

    isInverted() {
        this.update();
    //   this.checkBorder();
    },

    scale() {
        this.update();
    //   this.checkBorder();
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
    mounted() {
  //     this.calculateInputDimensions();
  //     this.updateBoxSizes();
  //     window.addEventListener('resize', this.updateBoxSizes);
    },
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
        cursor: move;
      }
    }
    // }
  }
}
</style>