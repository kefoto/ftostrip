<template>
  <!-- TODO: bug, the croppreview does not match the sizing -->
  <div>
    <div id="menu">
      <div id="header" class="container" style="margin-bottom: 0">
        <el-row :gutter="10">
          <el-col :span="16" style="display: flex">
            <input
              id="image-drop"
              type="file"
              ref="myFiles"
              @change="previewFiles"
            />
            <el-button circle @click="onPickFile" icon="upload"></el-button>

            <el-button
              circle
              @click="toggle_sub_t_Visibility"
              style="justify-content: space-between"
              icon="crop"
              :class="{'activated': isSubTableExpanded}"
            >
            </el-button>
            <!-- <el-button
              circle
              @click="toggle_sub_t_Visibility"
              style="justify-content: space-between"
              icon="crop"
              :style="buttonActivateStyle"
            >
            </el-button> -->
            <el-button circle @click="toggle_t_Visibility"
              ><el-icon><Edit /></el-icon
            ></el-button>
            <el-button circle @click="toggle_d_t_Visibility"
            
              ><el-icon><MoreFilled /></el-icon>
            </el-button>
          </el-col>
          <!-- style="background-color: red;" -->
          <el-col :span="8" class="text-right">
            <el-text class="text-right uSelectNone">{{ fileName }}</el-text>
            <!-- <span class="display-input"></span> -->
          </el-col>
        </el-row>
      </div>

      <el-collapse-transition>
        <div
          id="about_img"
          class="container"
          v-show="isSubTableExpanded"
          v-if="isSubTableExpanded"
        >
          <el-row :gutter="15" id="expand_table" style="margin-top: 10px">
            <el-col :span="16">
              <el-row style="padding: 3px 0">
                <el-col :span="12" class="text">
                  <el-text class="uSelectNone" for="ratio"
                    >Aspect Ratio</el-text
                  >
                </el-col>
                <el-col :span="12" class="user-input">
                  <el-select v-model="selectedWord" size="small">
                    <el-option
                      v-for="word in words"
                      :key="word"
                      :value="word"
                    />
                  </el-select>
                </el-col>
              </el-row>

              <el-row style="padding: 3px 0">
                <el-col :span="12" class="text">
                  <el-text class="uSelectNone" for="invert_rotate"
                    >Crop Size</el-text
                  >
                </el-col>
                <el-col
                  :span="12"
                  class="user-input"
                  style="padding-right: 9px"
                >
                  <el-slider
                    :show-tooltip="false"
                    id="crop-boost"
                    classs="custom-slider"
                    v-model="crop_boost"
                    :min="3"
                    :max="10"
                  />
                </el-col>
              </el-row>
              <el-row style="padding: 3px 0">
                <el-col :span="12" class="text">
                  <el-text class="uSelectNone" for="invert_rotate"
                    >Invert</el-text
                  >
                </el-col>
                <el-col
                  :span="12"
                  style="display: flex; justify-content: flex-end"
                  class="user-input"
                >
                  <el-switch v-model="inverted" size="small" />
                </el-col>
              </el-row>
              <el-row style="padding: 3px 0">
                <el-col
                  :span="24"
                  class="user-input"
                  style="display: flex; justify-content: flex-start"
                >
                  <el-button
                    class="user-input"
                    size="small"
                    icon="check"
                    round
                    @click="emitCropConfirm"
                  ></el-button>
                  <el-button
                    class="user-input"
                    size="small"
                    icon="refresh"
                    @click="resetImageCrop"
                    round
                  ></el-button>
                </el-col>
              </el-row>
            </el-col>
            <!-- style="background-color:red;" -->
            <el-col :span="8">
              <CropPreview
                :cropSize="parseFloat(processedWord)"
                :inputSize="parseFloat(input_aspec)"
                :isInverted="inverted"
                :scale="parseFloat(crop_boost)"
                id="cPreview"
              ></CropPreview>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
      <!-- <el-divider content-position="center"><el-icon><Help /></el-icon></el-divider> -->
      <el-collapse-transition>
        <div
          id="basic"
          class="container"
          v-show="isTableExpanded"
          v-if="isTableExpanded"
        >
          <!-- <el-row style="margin-top: 10px; margin-bottom: 10px">
            <el-col :span="6"></el-col>
            <el-col :span="9" class="text">
              <el-text class="uSelectNone" size="small">x</el-text>
            </el-col>
            <el-col :span="9" class="text">
              <el-text class="text uSelectNone" size="small">y</el-text>
            </el-col>
          </el-row> -->
          <el-row :gutter="5" style="display: flex; margin-top: 5px">
            <el-col :span="6">
              <el-text class="uSelectNone">Duplicate</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="dupX"
                :min="1"
                :max="12"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="dupY"
                :min="1"
                :max="12"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-row>
          <el-row :gutter="5" style="display: flex; margin-top: 5px">
            <el-col :span="6">
              <el-text class="uSelectNone">Split</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="splitX"
                :min="1"
                :max="12"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="splitY"
                :min="1"
                :max="12"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-row>
          <!-- <el-row :gutter="5" style="display: flex; margin-top: 5px">
            <el-col :span="6">
              <el-text class="uSelectNone">Offset</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="offsetX"
                :min="-10"
                :max="10"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-input-number
                v-model="offsetY"
                :min="-10"
                :max="10"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-row> -->
          <el-row :gutter="5" style="display: flex; margin-top: 5px">
            <el-col :span="6">
              <el-text class="uSelectNone">Invert</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-switch v-model="invtedX" />
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-switch v-model="invtedY" />
            </el-col>
          </el-row>
          <!-- <el-row :gutter="5" style="display: flex; margin-top: 5px">
            <el-col :span="24" :style="colCenterStyle" style="justify-content: flex-end;">
              <el-button
              class="user-input"
              size="small"
              icon="check"
              circle
            ></el-button>
            </el-col>
          </el-row> -->

          <!-- <EditPictures 
            style="display: none;"
            :imageSource="imageSource"
            :split="{x:parseFloat(splitX), y:parseFloat(splitY)}"
            :offset="{x:parseFloat(offsetX), y:parseFloat(offsetY)}"
            :invert="{x: invtedX, y: invtedY}"
          > -->
          
        </div>
      </el-collapse-transition>
      <EditPictures 
            style="display: none;"
            :imageSource="imageSource"
            :duplicate="{x:parseFloat(dupX), y:parseFloat(dupY)}"
            :split="{x:parseFloat(splitX), y:parseFloat(splitY)}"
            :invert="{x: invtedX, y: invtedY}"
          ></EditPictures>
      <el-collapse-transition>
        <div
          id="output"
          class="container"
          v-show="isResultTExpanded"
          v-if="isResultTExpanded"
        >
          <el-row style="display: flex; margin-top: 5px;">
            <el-col :span="6" style="margin: auto 0;">
              <el-text class="uSelectNone">View Model</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-switch
                v-model="isDynamic"
                inline-prompt
                style="
                  --el-switch-on-color: #13ce66;
                "
                active-text="Dynamic"
                inactive-text="Static"
              />
            </el-col>
            <!-- <transition name="el-fade-in">
              
            </transition> -->
            <el-col :span="9" :style="colCenterStyle" v-if="isDynamic">
              <el-switch
                v-model="isViewModel"
                inline-prompt

                active-text="VM-1"
                inactive-text="VM-2"

              />
            </el-col>
            <el-col :span="9" :style="colCenterStyle" v-else>
              <el-switch
                v-model="isResultShow"
              
                inline-prompt
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                active-text="Show"
                inactive-text="Hide"

              />
              
            </el-col>

            <!-- if dynamic, provides 2 view model
            if static, show or not show -->
          </el-row>
          <el-row style="display: flex; margin-top: 5px;">
            <el-col :span="6" style="margin: auto 0;">
              <el-text class="uSelectNone">Export</el-text>
            </el-col>
            <el-col :span="9" :style="colCenterStyle">
              <el-switch
                v-model="isExportJPG"
                inline-prompt
                active-text="JPG"
                inactive-text="PNG"
              />
            </el-col>
            <el-col :span="9" :style="colCenterStyle" style="justify-content: flex-end;">
              <el-button
              class="user-input"
              @click="emitDownloadResult"
              icon="download"
              circle
            ></el-button>
            </el-col>
            
          </el-row>
          <el-row>
            
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
import CropPreview from "./crop/CropPreview.vue";
import EditPictures from "./edit/EditPictures.vue";

import { ElNotification } from 'element-plus'

// import 'element-plus/lib/theme-chalk/index.css';
// import PlusIcon from  './icons/PlusIcon.vue';
// import { Upload } from '@element-plus/icons-vue';

export default {
  name: "TogglesInput",

  components: {
    CropPreview,
    EditPictures,
    // PlusIcon,
  },

  data() {
    return {
      originalSource: require("@/assets/2.jpg"),
      imageSource: require("@/assets/2.jpg"),

      selectedWord: "",
      words: ["original", "1:1", "2:3", "3:4", "4:5"],

      fileName: "Welcome",

      dupX: 4,
      dupY: 4,
      splitX: 2,
      splitY: 2,

      invtedX: false,
      invtedY: false,

      input_aspec: 1,
      crop_boost: 10,
      inverted: false,

      isDynamic: true,
      isResultShow: true,
      isViewModel: true,
      // radio2: 0,
      isExportJPG: true,

      isTableExpanded: true,
      isSubTableExpanded: false,
      isResultTExpanded: false,


    };
  },

  created() {
    // Set the default selected word to the first element in the words array
    this.selectedWord = this.words[0];
    this.changeImageSource(this.originalSource);
    // this.emitImage();
    eventBus.on("uploadCropSource", this.changeImageSource);

    // this.emitResultShow(true);
  },
  beforeUnmount() {
    eventBus.off("uploadCropSource", this.changeImageSource);
  },

  mounted() {},

  computed: {
    // Process the selectedWord here
    processedWord() {
      if (this.selectedWord == "original") {
        return this.input_aspec;
      } else {
        const sizeArr = this.selectedWord.split(":");
        let w = sizeArr[0];
        let h = sizeArr[1];

        return (w / h).toFixed(2);
      }
    },

    // TODO: this styling is a bit weird

    buttonActivateStyle() {
      return {
        "background-color": this.isSubTableExpanded ? "black" : "white",
        color: this.isSubTableExpanded ? "white" : "#636466",
        transition: "all 0.3s ease",
      };
    },
    inputNumStyle() {
      return {
        width: "87%",
        "text-align": "center",
        "align-items": "center",
        "justify-content": "center",
      };
    },

    colCenterStyle() {
      return {
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
      };
    },
  },

  methods: {
    onPickFile() {
      this.$refs.myFiles.click();
    },

    previewFiles(event) {
      console.log("previewFiles Called");

      const file = event.target.files[0];
      if (file) {
        this.file = file;
        if (file.type.startsWith("image/")) {
          this.fileName = this.limitNameLength(file.name, 8);

          // console.log('FileReader onload event triggered');
          const reader = new FileReader();
          reader.onload = (e) => {
            this.originalSource = e.target.result;

            this.changeImageSource(this.originalSource);
          };

          reader.readAsDataURL(file);
        } else {
          // this.imageSource = "";
          ElNotification({
          title: "Error",
          message: "Please select an image file (JPG or PNG).",
          type: "error",
          });
        }

        event.target.value = null;

        // console.log(file);
      }
    },

    changeImageSource(source) {

      console.log("changeImageSource Called");

      this.imageSource = source;

      this.$nextTick(() => {
        this.selectedWord = this.words[0];
        this.crop_boost = 10;
        this.inverted = false;
        // console.log(reader.result);
        // console.log('Image source updated:', this.imageSource);
      });

      this.emitImage(this.imageSource);
    },

    toggle_sub_t_Visibility() {
      this.isSubTableExpanded = !this.isSubTableExpanded;
      eventBus.emit("TableExpanded", this.isSubTableExpanded);
    },

    toggle_t_Visibility() {
      this.isTableExpanded = !this.isTableExpanded;
    },
    toggle_d_t_Visibility() {
      this.isResultTExpanded = !this.isResultTExpanded;
    },

    emitCropConfirm() {
      eventBus.emit("CropConfirmed");
    },

    resetImageCrop() {
      this.changeImageSource(this.originalSource);
    },

    emitDownloadResult() {
      eventBus.emit("DownloadConfirmed", this.isExportJPG);
    },

    emitImage(source) {

      console.log("emitImage Called");
      
      var img = new Image();
      img.src = source;
      img.onload = () => {
        this.input_aspec = (img.width / img.height).toFixed(2);
        // eventBus.emit("imageSize", img.width / img.height);
      };

      // console.log(this.imageSource);

      eventBus.emit("imageUploaded", source);
    },

    emitResultShow(x) {
      eventBus.emit("ResultVisibility", x);
    },
    emitViewModel(x) {
      eventBus.emit("ViewModelVisibility", x);
    },    

    resetInputs(isDynamic) {
      if (isDynamic) {
        this.isViewModel = true; // Reset radio group to default value
      } else {
        this.isResultShow = true; // Reset result show switch
      }
    },

    limitNameLength(name, limit) {
      if (name.length > limit) {
        var truncatedName = name.slice(0, limit); // Get the first 'limit' characters
        return truncatedName + "...";
      }
      return name;
    },
  },
  watch: {
    isDynamic(newVal) {
      this.resetInputs(newVal);
    },

    isResultShow(newVal) {
      this.emitResultShow(newVal);
    },

    isViewModel(newVal) {
      this.emitViewModel(newVal);
    },

    //TODO: this might be wrong
    isSubTableExpanded() {
      if (this.isResultShow == true){
        this.isResultShow = false;
      }
    }
  },

};
</script>

<style lang="scss" scoped>
#menu {
  position: fixed;
  left: 0;
  top: 0;

  width: 30%;
  min-width: 400px;
  backdrop-filter: blur(5px);
  background-color: rgba(215, 227, 208, 0.3);
  border-radius: 13px;

  margin: 10px;
  padding: 5px;

  z-index: 20;

  > div {
    margin-bottom: 5px;

    &:last-of-type {
      margin-bottom: 0; // Remove margin-bottom for the first input (image drop)
    }
  }
}

.container {
  position: relative;
  //   // height: auto;
  width: 100%;

  #cPreview {
    width: 120px;
    height: 120px;
    // margin-left: auto;
    // margin-bottom: auto;
    // background-color: red;
    margin: auto;
  }
}
input[type="file"] {
  display: none;
}

.text {
  // user-select: none;
  text-align: left;
  margin: auto;
  padding: 0 5px;
}

.el-upload-list {
  position: absolute;
  top: 10px; /* Example: move 10px from the top */
  left: 10px; /* Example: move 10px from the left */
  z-index: 1000; /* Ensure it appears above other elements */
}

.user-input {
  padding-right: 3px;
}

.uSelectNone {
  user-select: none;
}

.text-right {
  text-align: right;
  margin: auto;
  padding: 0 5px;
}
</style>
