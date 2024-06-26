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
    eventBus.on("imageUploaded", this.updateImageSource);
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
  },

  computed: {
    clipping() {
      return {
        'clip-path': `rect({}px {}px {}px {}px)`
      }
    }
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