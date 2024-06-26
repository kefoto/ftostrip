<template>
  <div>
    <div id="menu">
      <div id="dropfile" class="container">
        <div class="normal-input">
          <input
            id="image-drop"
            type="file"
            ref="myFiles"
            @change="previewFiles"
          />
          <div for="image-drop" @click="onPickFile" class="img-drop-button">
            <img src="../assets/+.svg" alt="" />
          </div>

          <!-- <button >Input Image</button> -->
          <span class="display-input">{{ fileName }}</span>
        </div>

        <div id="for_crop_img">
          <div class="sub_section">
            <div class="small-input">
              <label for="ratio">Aspect Ratio</label>
              <select id="ratio" v-model="selectedWord">
                <option
                  v-for="word in words"
                  :key="word"
                  :value="word"
                >
                  <!-- TODO: this index is a issue -->
                  {{ word }}
                </option>
              </select>
            </div>
            <div class="small-input">
              <label for="invert_rotate">Invert</label>
              <input
                type="checkbox"
                name="invert_rotate"
                id="invert_rotate"
                v-model="inverted"
              />
            </div>
            <div class="small-input">
              <label for="crop-boost">Crop Size</label>
              <input
                id="crop-boost"
                type="range"
                min="3"
                max="10"
                value="10"
                v-model="crop_boost"
              />
            </div>
          </div>
          <CropPreview
            :cropSize="processedWord"
            :inputSize="input_aspec"
            :isInverted="inverted"
            :scale="crop_boost"
            id="cPreview"
          ></CropPreview>
        </div>
        <div id="basic" class="container">
          <div class="normal-input">
            <label for="divisions">dupliates</label>
            <input
              id="divisions"
              type="range"
              min="2"
              max="8"
              value="2"
              v-model="duplicates"
            />
            <span class="display-input">{{ duplicates }}</span>
          </div>

          <div class="normal-input">
            <label for="x-axis">x axis</label>
            <input
              id="x-axis"
              type="range"
              min="2"
              max="32"
              value="2"
              v-model="xAxis"
            />
            <span class="display-input">{{ xAxis }}</span>
          </div>

          <div class="normal-input">
            <label for="y-axis">y axis</label>
            <input
              id="y-axis"
              type="range"
              min="2"
              max="32"
              value="2"
              v-model="yAxis"
            />
            <span class="display-input">{{ yAxis }}</span>
          </div>

          <!-- size, how many divisions in picture, x-how many line, y-how many line, -->
        </div>
        <div id="output" class="container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "../util/eventBus";
import CropPreview from "./crop/CropPreview.vue";

export default {
  name: "TogglesInput",

  components: {
    CropPreview,
  },

  data() {
    return {
      selectedWord: "",
      words: ["original", "1:1", "2:3", "3:4", "4:5"],
      imageSource: null,
      fileName: "Input Image",
      duplicates: 4,
      xAxis: 2,
      yAxis: 2,
      input_aspec: 1,
      crop_boost: 10,
      inverted: false,
    };
  },

  created() {
    // Set the default selected word to the first element in the words array
    this.selectedWord = this.words[0];
    this.emitImage(require('@/assets/1.png'));
  },

  mounted() {
    
  },

  computed: {
    // Process the selectedWord here
    processedWord() {
      if(this.selectedWord == 'original'){
        return this.input_aspec;
      } else {
        const sizeArr = this.selectedWord.split(":");
        let w = sizeArr[0];
        let h = sizeArr[1];

        return w / h;
      }
    }
  },

  methods: {
    onPickFile() {
      this.$refs.myFiles.click();
    },
    previewFiles(event) {
      // this.fileName =

      // this.$refs.form.reset();
      const file = event.target.files[0];
      if (file) {
        this.fileName = this.limitNameLength(file.name, 10);
        this.file = file;

        if (file.type.startsWith("image/")) {
          // console.log('FileReader onload event triggered');
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imageSource = e.target.result;
            this.$nextTick(() => {
              // console.log(reader.result);
              // console.log('Image source updated:', this.imageSource);
            });

            this.emitImage(reader.result);
          }
          

          reader.readAsDataURL(file);
        } else {
          // this.imageSource = "";
          alert("Please select an image file.");
        }

        event.target.value = null;

        // console.log(file);
      }
    },

    emitImage(source) {
      var img = new Image();
      img.src = source;
      img.onload = () => {
        this.input_aspec = img.width / img.height;
          // eventBus.emit("imageSize", img.width / img.height);
        };

      eventBus.emit("imageUploaded", this.imageSource);
    },

    limitNameLength(name, limit) {
      if(name.length > limit){
        var truncatedName = name.slice(0, limit); // Get the first 'limit' characters
        return truncatedName + '...';
      }
      return name;
    }
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
  border: 1px solid #f9f6f6;
  border-radius: 13px;

  margin: 0 10px;
  padding: 5px;

  z-index: 1;

  > div {
    //   // transform: scale(0.9);
    //   // TODO: change this scaling
    // margin: 0;
    margin-bottom: 5px;

    &:last-of-type {
      margin-bottom: 0; // Remove margin-bottom for the first input (image drop)
    }
  }
}

.container {
  position: relative;
  // height: auto;
  width: 100%;
  padding: 3px 0;
  // margin-bottom: 0;

  .normal-input {
    position: relative;
    display: flex;
    // margin-left: 5px;
    width: 100%;
    height: 1.1rem;
    justify-content: space-between;

    margin-bottom: 5px;

    .img-drop {
      height: 1.4rem !important;
    }

    &:last-of-type {
      margin-bottom: 0; // Remove margin-bottom for the first input (image drop)
    }

    > label {
      width: 25%;
      text-align: center;
      display: inherit;
      font-size: 0.9rem;

      align-items: center;
    }

    input[type="file"] {
      display: none;
    }

    input {
      position: relative;
      width: 33%;
      display: flex;
      align-items: center;
      // margin-left: auto;
      margin: 0 auto;
    }

    select {
      position: relative;
      width: 30%;
      //   right:0;
      display: flex;
      align-items: center;
      // margin-left: auto;
      margin-left: auto;
    }

    .display-input {
      background-color: #f9f6f6;
      width: 30%;
      margin-left: 0.5%;
      // margin: 0 10px;
      text-align: right;
      font-size: 0.8rem;
      border-radius: 2px;
    }

    .img-drop-button {
      position: relative;
      // background-color: red;
      width: auto;
      height: 100%;
      border: 0.7px solid black;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        // transform: invert(100%);
        background-color: black;

        img {
          filter: invert(1);
        }
      }
      img {
        // transform: scale(0.9);
        position: relative;
        height: 100%;
        width: auto;
        padding: 10%;
        transition: all 0.3s ease;
      }
    }
  }
}

#for_crop_img {
  width: 100%;
  height: 110px;
  display: flex;
  align-content: space-between;
  // position: ;
  .sub_section {
    // background-color: red;
    // margin-top:auto;
    // font-size: 0.5rem;
    height: 100%;
    width: 65%;
    margin-right: auto;
  }

  #cPreview {
    width: 110px;
    height: 110px;
    // margin-left: auto;
    // margin-bottom: auto;
    margin: auto 0;
  }

  margin-bottom: 10px;
}
// CropPreview {
//   position: relative;
//   display: flex;
//   width: 33%;
//   // background-color: red;
// }
.small-input {
  // background-color:
  position: relative;
  display: flex;
  // margin-left: 5px;
  width: 100%;
  height: 0.9rem;
  font-size: 1rem;
  justify-content: space-between;

  margin-bottom: 5px;
  padding-right: 5px;

  .img-drop {
    height: 1.4rem !important;
  }

  &:last-of-type {
    margin-bottom: 0; // Remove margin-bottom for the first input (image drop)
  }

  > label {
    width: 60%;
    text-align: center;
    display: inherit;
    font-size: 0.8rem;

    align-items: center;
  }

  input[type="file"] {
    display: none;
  }

  input {
    position: relative;
    width: 40%;
    display: flex;
    align-items: right;
    // padding-right: 10px;
    // margin-right: auto;
    margin: auto;
    // margin: 0 auto;
  }

  select {
    position: relative;
    width: 40%;
    //   right:0;
    font-size: 0.65rem;
    display: flex;
    // text-align: center;
    align-items: center;
    // margin-left: auto;
    margin: auto 0;
  }

  .display-input {
    background-color: #f9f6f6;
    width: 30%;
    margin-left: 0.5%;
    // margin: 0 10px;
    text-align: right;
    font-size: 0.8rem;
    border-radius: 2px;
  }

  .img-drop-button {
    position: relative;

    width: auto;
    height: 100%;
    border: 0.7px solid black;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      // transform: invert(100%);
      background-color: black;

      img {
        filter: invert(1);
      }
    }
    img {
      // transform: scale(0.9);
      position: relative;
      height: 100%;
      width: auto;
      padding: 10%;
      transition: all 0.3s ease;
    }
  }
}
</style>
