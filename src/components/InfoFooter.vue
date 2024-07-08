<template>
  <div id="menu" ref="menu">
    <el-collapse-transition>
      <div v-show="isInfoShow">
        <el-row>
          <el-col :span="18">
            <el-text size="large" class="word"
              >Sliced Mirror Effect Editor</el-text
            >
          </el-col>
          <el-col :span="6">
            <el-text size="small" class="word">by Ke Xu</el-text>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text">
            <el-text class="word">Graphic Design is my passion </el-text>
          </el-col>
        </el-row>
      </div>
    </el-collapse-transition>

    <el-row style="display: flex; justify-content: flex-end">
      <div ref="buttons" style="display: flex; justify-content: flex-end">
        <el-button round size="small" ref="gitButton"> Git </el-button>
        <el-button circle size="small" @click="toggleInfo" ref="toggleButton">
          <el-icon><TopLeft /></el-icon>
        </el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "InfoFooter",

  data() {
    return {
      isInfoShow: false,

      buttons_width: 75.3 + 10,
    };
  },

  mounted() {
    // this.getButtonWidths();
  },

  methods: {
    toggleInfo() {
      // this.isInfoShow = !this.isInfoShow;
      const menu = this.$refs.menu;

      // const buttons_width = 75.3 + 10;

      if (this.isInfoShow) {
        // Collapse
        // this.isInfoShow = false;
        this.isInfoShow = false;
        gsap.to(".word", {
          opacity: 0,
          ease: "power2.out",
          duration: 0.2,
        });

        gsap.to(menu, {
          width: `${this.buttons_width}px`,
          "min-width": `${this.buttons_width}px`,
          ease: "power2.out",
          duration: 0.4,
          // onComplete: () => {
          //     this.isInfoShow = false;
          //   },
        });
      } else {
        // Expand


        gsap.fromTo(
          menu,
          { width: `${this.buttons_width}px`, "min-width": `${this.buttons_width}px` },
          {
            width: "30%",
            "min-width": "400px",
            // ease: "power2.out",
            duration: 0.4,
            onComplete: () => {
              this.isInfoShow = true;
            },
          }
        );

        gsap.fromTo(
          ".word",
          {
            opacity: 0,
          },
          {
            opacity: 1,
            ease: "power2.out",
            duration: 0.2,
            delay: 0.4,
          }
        );
      }
    },
  },

  computed: {
    footerSizeStyle() {
      return {
        width: `${this.buttons_width}`,
        "min-width": `${this.buttons_width}`,
      }
    }
  }

  //   mounted: {},
};
</script>
<style lang='scss' scoped>
#menu {
  position: fixed;

  right: 0;
  bottom: 0;

  // width: 30%;
  // min-width: 400px;
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

.text {
  text-align: center;
  margin: auto;
  padding: 0 5px;
}

.word {
  opacity: 1;
}
</style>