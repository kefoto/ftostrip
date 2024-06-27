import { createApp } from 'vue';
import mitt from 'mitt';
// import Cropper from 'cropperjs';
// import lodash from 'lodash';
import App from './App.vue';
import './assets/styles/fonts.css';

const emitter = mitt()

const app = createApp(App)

app.config.globalProperties.emitter = emitter
app.mount('#app')
