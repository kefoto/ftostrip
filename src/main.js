import { createApp } from 'vue';
// import Vue from 'vue'
import mitt from 'mitt';
// import Cropper from 'cropperjs';
// import lodash from 'lodash';
import App from './App.vue';
import ElementPlus from 'element-plus';
import './assets/styles/index.scss'
import 'element-plus/dist/index.css'
import './assets/styles/fonts.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'



const emitter = mitt()

const app = createApp(App)

app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.config.globalProperties.emitter = emitter
app.mount('#app')
