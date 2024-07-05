<template>
  <div id="menu" ref="menu">
    <transition name="el-fade-in">
      <div v-show="isInfoShow">
        <el-row>
          <el-col :span="18">
            <el-text size="large">Sliced Mirror Effect Editor</el-text>
          </el-col>
          <el-col :span="6">
            <el-text size="small">by Ke Xu</el-text>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text">
            <el-text>Graphic Design is my passion </el-text>
          </el-col>
        </el-row>
      </div>
    </transition>

    <el-row>
      <div ref="buttons" style="display: flex; justify-content: space-between">
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
  name: "InfoHeader",

  data() {
    return {
      isInfoShow: false,
    };
  },
  
  mounted() {
    // this.getButtonWidths();
  },

  methods: {
    toggleInfo() {
      // this.isInfoShow = !this.isInfoShow;
      const menu = this.$refs.menu;

      const buttons_width = 75.3 + 10;
      
      if (this.isInfoShow) {
        // Collapse
        // this.isInfoShow = false;
        gsap.to(menu, {
          width: `${buttons_width}px`,
          'min-width': `${buttons_width}px`,
          duration: 0.3,
          onComplete: () => {
              this.isInfoShow = false;
            },
        });
      } else {
        // Expand
        gsap.fromTo(
          menu,
          { width: `${buttons_width}px`, 
            'min-width': `${buttons_width}px`, 
        },
          {
            width: "30%",
            'min-width': '400px',
            duration: 0.3,
            onComplete: () => {
              this.isInfoShow = true;
            },
          }
        );
        // });
      }
    },

    // getButtonWidths() {
    //   // This will ensure the initial width is set correctly
    //   this.$nextTick(() => {
    //     const totalButtonWidth = this.$refs.gitButton.offsetWidth + this.$refs.toggleButton.offsetWidth + 10; // Added 10px for margin
    //     this.$refs.menu.style.width = `${totalButtonWidth}px`;
    //   });
    // },

  },

  //   mounted: {},
};
</script>
<style lang='scss' scoped>
#menu {
  position: fixed;

  right: 0;
  bottom: 0;

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

.text {
  text-align: center;
  margin: auto;
  padding: 0 5px;
}
</style>