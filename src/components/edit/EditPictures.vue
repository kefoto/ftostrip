<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import eventBus from "../../util/eventBus";
import { debounce } from "lodash";

export default {
  name: "EditPictures",

  data() {
    return {
      h_invert_img: null,
      v_invert_img: null,
      vh_invert_img: null,
    };
  },
  mounted() {
    // this.checkProps();

    this.debouncedConvert = debounce(this.convertEdit, 300);

    this.createInvertImage(this.imageSource).then(
      ({ h_inv_img, v_inv_img, vh_inv_img }) => {
        this.h_invert_img = h_inv_img;
        this.v_invert_img = v_inv_img;
        this.vh_invert_img = vh_inv_img;

        this.debouncedConvert();
      }
    );
  },

  beforeUnmount() {},

  computed: {},

  methods: {
    checkProps() {
      console.log(
        this.imageSource,
        this.duplicate,
        this.split,
        this.offset,
        this.invert
      );
    },

    srcToImage(src) {
      const img = new Image();
      img.src = src;

      return img;
    },

    createInvertImage(imageSrc) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
          const h_Canvas = document.createElement("canvas");
          const h_Ctx = h_Canvas.getContext("2d");

          h_Canvas.width = image.width;
          h_Canvas.height = image.height;

          h_Ctx.translate(image.width, 0);
          h_Ctx.scale(-1, 1);
          h_Ctx.drawImage(image, 0, 0);
          const h_inv_img = new Image();
          h_inv_img.src = h_Canvas.toDataURL("image/jpeg");

          const v_Canvas = document.createElement("canvas");
          const v_Ctx = v_Canvas.getContext("2d");

          v_Canvas.width = image.width;
          v_Canvas.height = image.height;

          v_Ctx.translate(0, image.height);
          v_Ctx.scale(1, -1);
          v_Ctx.drawImage(image, 0, 0);

          const v_inv_img = new Image();
          v_inv_img.src = v_Canvas.toDataURL("image/jpeg");

          const vh_Canvas = document.createElement("canvas");
          const vh_Ctx = vh_Canvas.getContext("2d");

          vh_Canvas.width = image.width;
          vh_Canvas.height = image.height;

          vh_Ctx.translate(image.width, image.height);
          vh_Ctx.scale(-1, -1);
          vh_Ctx.drawImage(image, 0, 0);
          const vh_inv_img = new Image();
          vh_inv_img.src = vh_Canvas.toDataURL("image/jpeg");

          // console.log(h_inv_img, v_inv_img, vh_inv_img);
          resolve({ h_inv_img, v_inv_img, vh_inv_img });
        };

        image.onerror = reject;
      });
    },

    convertEdit() {
      // this.checkProps();

      const image = new Image();
      image.src = this.imageSource;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      const splitX = this.split.x;
      const splitY = this.split.y;

      const invertX = this.invert.x;
      const invertY = this.invert.y;

      const dupX = this.duplicate.x;
      const dupY = this.duplicate.y;

      const v_inv_img = this.v_invert_img;
      const h_inv_img = this.h_invert_img;
      const vh_inv_img = this.vh_invert_img;

      image.onload = function () {
        const imgWidth = image.width;
        const imgHeight = image.height;

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        const colWidth = imgWidth / splitX;
        const rowHeight = imgHeight / splitY;

        // offsetX = (offsetX / 10) * colWidth;
        // offsetY = (offsetY / 10) * rowHeight;

        // console.log(offsetX, offsetY);
        for (let i = 0; i < splitX; i++) {
          for (let j = 0; j < splitY; j++) {
            const dx = i * colWidth;
            const dy = j * rowHeight;

            for (let di = 0; di < dupX; di++) {
              for (let dj = 0; dj < dupY; dj++) {
                const scaledWidth = colWidth / dupX;
                const scaledHeight = rowHeight / dupY;

                const destX = dx + di * scaledWidth;
                const destY = dy + dj * scaledHeight;

                // let flipHorizontally = di % dupX >= dupX / 2;
                // let flipVertically = dj % dupY >= dupY / 2;

                let flipHorizontally = invertX && di % dupX >= dupX / 2;
                let flipVertically = invertY && dj % dupY >= dupY / 2;

                var temp;

                if (flipHorizontally && flipVertically) {
                  temp = vh_inv_img;
                } else if (flipHorizontally) {
                  temp = h_inv_img;
                } else if (flipVertically) {
                  temp = v_inv_img;
                } else {
                  temp = image;
                }

                ctx.drawImage(
                  temp,
                  dx,
                  dy,
                  colWidth,
                  rowHeight,
                  destX,
                  destY,
                  scaledWidth,
                  scaledHeight
                );
              }
            }
          }
        }
        // Provide the result image
        eventBus.emit("UploadResultImage", canvas.toDataURL("image/jpeg"));

        eventBus.emit("ResultVisibility", true);
      };
    },
  },

  props: {
    imageSource: {
      type: String,
      required: true,
    },
    split: {
      type: Object,
      required: true,
    },
    invert: {
      type: Object,
      required: true,
    },
    duplicate: {
      type: Object,
      required: true,
    },
  },

  watch: {
    imageSource(newVal) {
      this.createInvertImage(newVal).then(
        ({ h_inv_img, v_inv_img, vh_inv_img }) => {
          this.h_invert_img = h_inv_img;
          this.v_invert_img = v_inv_img;
          this.vh_invert_img = vh_inv_img;

          this.debouncedConvert();
        }
      );
    },
    split() {
      this.debouncedConvert();
    },
    offset() {
      this.debouncedConvert();
    },
    invert() {
      this.debouncedConvert();
    },
  },
};
</script>
<style lang="scss">
</style>