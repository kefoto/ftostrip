<template>
  <!-- TODO: bug, the croppreview does not match the sizing -->
  <div>
    <div id="menu">
      <div id="about_img" class="container">
        <div class="normal-input">
          <el-row :gutter="10">
            <el-col :span="16" style="display: flex">
              <input
                id="image-drop"
                type="file"
                ref="myFiles"
                @change="previewFiles"
              />
              <el-button circle icon="plus"></el-button>
              <el-button circle @click="onPickFile" icon="upload"></el-button>

              <el-button
                circle
                @click="toggleVisibility"
                style="justify-content: space-between"
                icon="crop"
                :style="buttonActivateStyle"
              >
              </el-button>
            </el-col>
            <!-- style="background-color: red;" -->
            <el-col :span="8" class="text-right">
              <el-text class=" text-right uSelectNone">{{ fileName }}</el-text>
              <!-- <span class="display-input"></span> -->
            </el-col>
          </el-row>
          <el-collapse-transition>
            <el-row
              :gutter="15"
              id="expand_table"
              v-show="isTableExpanded"
              v-if="isTableExpanded"
              style="margin-top: 10px"
            >
              <el-col :span="16">
                <el-row style="padding: 3px 0">
                  <el-col :span="12" class="text">
                    <el-text class="uSelectNone" for="ratio">Aspect Ratio</el-text>
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

                <el-row style="padding: 3px 0;" >
                  <el-col :span="12" class="text">
                    <el-text class="uSelectNone" for="invert_rotate"
                      >Crop Size</el-text
                    >
                  </el-col>
                  <el-col :span="12" class="user-input" style="padding-right: 9px">
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
                <el-row style="padding: 3px 0;">
                  <el-col :span="12" class="text" >
                    <el-text class="uSelectNone" for="invert_rotate">Invert</el-text>
                  </el-col>
                  <el-col
                    :span="12"
                    style="display: flex; justify-content: flex-end;"
                    class="user-input"
                  >
                    <el-switch v-model="inverted" size="small" />
                  </el-col>
                </el-row>
                <el-row style="padding: 3px 0;">
                  <el-col :span="24" class="user-input" style="
                    
                    display: flex;
                    justify-content: flex-end;
                  ">
                    <el-button class="user-input" size="small" icon="check" round></el-button>
                    <el-button class="user-input" size="small" icon="refresh" round></el-button>
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
          </el-collapse-transition>
        </div>
      </div>
      <!-- <el-divider content-position="center"><el-icon><Help /></el-icon></el-divider> -->
      <div id="basic" class="container">
        <el-row>
          <el-text class="uSelectNone">Duplicate</el-text>
        </el-row>
        <el-row :gutter="5" style="padding-left: 10px">
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">x</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="dupX"
                :min="1"
                :max="8"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">y</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="dupY"
                :min="1"
                :max="8"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-text class="uSelectNone">Split</el-text>
        </el-row>
        <el-row :gutter="5" style="padding-left: 10px">
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">x</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="splitX"
                :min="2"
                :max="32"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">y</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="splitY"
                :min="2"
                :max="32"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-text class="uSelectNone">Offset</el-text>
        </el-row>
        <el-row :gutter="5" style="padding-left: 10px">
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">x</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="offsetX"
                :min="2"
                :max="32"
                size="small"
                placeholder="x"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
          <el-col :span="12" style="display: flex">
            <el-col :span="4">
              <el-text class="text uSelectNone" size="small">y</el-text>
            </el-col>
            <el-col :span="20" :style="colCenterStyle">
              <el-input-number
                v-model="offsetY"
                :min="2"
                :max="32"
                size="small"
                placeholder="y"
                controls-position="right"
                :style="inputNumStyle"
              />
            </el-col>
          </el-col>
        </el-row>

        <!-- size, how many divisions in picture, x-how many line, y-how many line, -->
      </div>
      <div id="output" class="container"></div>
    </div>
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
import CropPreview from "./crop/CropPreview.vue";
// import 'element-plus/lib/theme-chalk/index.css';
// import PlusIcon from  './icons/PlusIcon.vue';
// import { Upload } from '@element-plus/icons-vue';

export default {
  name: "TogglesInput",

  components: {
    CropPreview,
    // PlusIcon,
  },

  data() {
    return {
      selectedWord: "",
      words: ["original", "1:1", "2:3", "3:4", "4:5"],
      imageSource: null,
      fileName: "Input Image",
      dupX: 4,
      dupY: 4,
      splitX: 2,
      splitY: 2,
      offsetX: 0,
      offsetY: 0,
      input_aspec: 1,
      crop_boost: 10,
      inverted: false,

      isTableExpanded: false,
    };
  },

  created() {
    // Set the default selected word to the first element in the words array
    this.selectedWord = this.words[0];
    this.emitImage(require("@/assets/1.png"));
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
        "background-color": this.isTableExpanded ? "black" : "white",
        color: this.isTableExpanded ? "white" : "#636466",
        transition: "all 0.3s ease",
      };
    },
    inputNumStyle() {
      return {
        width: "80%",
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
      const file = event.target.files[0];
      if (file) {
        
        this.file = file;
        if (file.type.startsWith("image/")) {
          this.fileName = this.limitNameLength(file.name, 8);
          
          // console.log('FileReader onload event triggered');
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageSource = e.target.result;
            this.$nextTick(() => {
              this.selectedWord = this.words[0];
              this.crop_boost = 10;
              this.inverted = false;
              // console.log(reader.result);
              // console.log('Image source updated:', this.imageSource);
            });

            this.emitImage(reader.result);
          };

          reader.readAsDataURL(file);
        } else {
          // this.imageSource = "";
          alert("Please select an image file.");
        }

        event.target.value = null;

        // console.log(file);
      }
    },

    toggleVisibility() {
      this.isTableExpanded = !this.isTableExpanded;
      eventBus.emit("TableExpanded", this.isTableExpanded);
    },

    emitImage(source) {
      var img = new Image();
      img.src = source;
      img.onload = () => {
        this.input_aspec = (img.width / img.height).toFixed(2);
        // eventBus.emit("imageSize", img.width / img.height);
      };

      eventBus.emit("imageUploaded", this.imageSource);
    },

    limitNameLength(name, limit) {
      if (name.length > limit) {
        var truncatedName = name.slice(0, limit); // Get the first 'limit' characters
        return truncatedName + "...";
      }
      return name;
    },
  },

  // computed: {
  //   cPreviewStyles(){
  //     return {
  //       width:
  //     }
  //   }
  // }
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
  background-color: rgba(230, 237, 226, 0.3);
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
  /* Adjust the position as needed */
  position: absolute;
  top: 10px; /* Example: move 10px from the top */
  left: 10px; /* Example: move 10px from the left */
  z-index: 1000; /* Ensure it appears above other elements */
}

.user-input{
  padding-right:3px;
}

.uSelectNone {
  user-select: none;
}

.text-right {
  text-align: right;
  margin: auto;
  padding: 0 5px;
}


// #about_img{
//   background-color: red;
// }
</style>
