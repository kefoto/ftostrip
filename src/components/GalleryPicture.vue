<template>
  <div class="image-container">
    <img :src="imageSource" alt="Current image" />
  </div>
</template>

<script>
import eventBus from '../util/eventBus';
// import {imageSource} from "./TogglesInput.vue"
export default {
  name: "GalleryPicture",

  created() {
    this.imageUploadedHandler = (imgData) => {
      this.imageSrc = imgData;
    };
    
    eventBus.on('imageUploaded', this.updateImageSource);
  },

  beforeUnmount() {
    eventBus.off('imageUploaded', this.updateImageSource);
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
//   background-color: red;
  
  transition: all 0.3s ease;
}

img {
  width: 40%;
  max-width: 520px;
  height: auto;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  //   border: 1px solid #ccc;
  //   border-radius: 4px;
}
</style>