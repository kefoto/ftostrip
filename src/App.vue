<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <TogglesInput ></TogglesInput>
  <GalleryPicture id="gp"></GalleryPicture>
  <InfoFooter></InfoFooter>
</template>

<script>
import TogglesInput from './components/TogglesInput.vue'
import GalleryPicture from './components/GalleryPicture';
import InfoFooter from './components/InfoFooter.vue'

export default {
  name: 'App',
  components: {
    TogglesInput,
    GalleryPicture,
    InfoFooter
  }
}
</script>

<style>
@import '@/assets/styles/fonts.css';
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'SpaceGrotesk', Helvetica;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;

  /* color: black; */
  /* margin-top: 60px; */
}

#gp {
  /* display: flex;
  position: relative; */
  width: 100%;
  height: 100%;
}

</style>
