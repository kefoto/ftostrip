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
    return {};
  },
  created() {
    this.checkProps();

    this.debouncedConvert = debounce(this.convertEdit, 600);
  },

  beforeUnmount() {},

  computed: {},

  methods: {
    checkProps() {
      console.log(
        this.imageSource,
        this.split,
        this.offset,
        this.invert
      );
    },

    convertEdit() {
      this.checkProps();
      const image = new Image();
      image.src = this.imageSource;

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      const splitX = this.split.x;
      const splitY = this.split.y;

      const invertX = this.invert.x;
      const invertY = this.invert.y;


      image.onload = function () {
        const imgWidth = image.width;
        const imgHeight = image.height;

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // const colWidth = imgWidth / splitX;
        // const rowHeight = imgHeight / splitY;

        const colWidth = imgWidth / splitX;
        const rowHeight = imgHeight / splitY;
        
        // for (let di = 0; di < dupX; di++) {
        //     for (let dj = 0; dj < dupY; dj++) {
        //         ctx.drawImage(image, 0, 0, imgWidth, imgHeight, di * colWidth, dj * rowHeight, colWidth, rowHeight);
        //     }
        // }


        for (let i = 0; i < splitX; i++) {
          for (let j = 0; j < splitY; j++) {
            const sx = i * colWidth;
            const sy = j * rowHeight;
            const dx = i * colWidth;
            const dy = j * rowHeight;

            for (let di = 0; di < splitX; di++) {
              for (let dj = 0; dj < splitY; dj++) {

                const scaledWidth = colWidth / splitX;
                const scaledHeight = rowHeight / splitY;

                const destX = dx + di * scaledWidth;
                const destY = dy + dj * scaledHeight;

                ctx.save();

                let flipHorizontally = invertX && (di % 2 === 1);
                let flipVertically = invertY && (dj % 2 === 1);

                if (flipHorizontally && flipVertically) {
                    ctx.translate(destX + scaledWidth, destY + scaledHeight);
                    ctx.scale(-1, -1);
                    ctx.drawImage(image, sx, sy, colWidth, rowHeight, 0, 0, scaledWidth, scaledHeight);
                } else if (flipHorizontally) {
                    ctx.translate(destX + scaledWidth, 0); // Move origin to the right edge
                    ctx.scale(-1, 1); // Flip horizontally

                    ctx.drawImage(
                        image,
                        sx,
                        sy,
                        colWidth,
                        rowHeight,
                        0, // Draw at the translated origin
                        destY,
                        scaledWidth,
                        scaledHeight
                    );
                } else if (flipVertically) {
                    ctx.translate(0, destY + scaledHeight); // Move origin to the right edge
                    ctx.scale(1, -1);

                    ctx.drawImage(
                        image,
                        sx,
                        sy,
                        colWidth,
                        rowHeight,
                        destX, // Draw at the translated origin
                        0,
                        scaledWidth,
                        scaledHeight
                    );
                } else {
                    ctx.drawImage(
                        image,
                        sx,
                        sy,
                        colWidth,
                        rowHeight,
                        destX,
                        destY,
                        scaledWidth,
                        scaledHeight
                    );
                }
                // Restore the canvas state
                ctx.restore();

                // ctx.drawImage(
                //   image,
                //   sx,
                //   sy,
                //   imgWidth,
                //   imgHeight,
                //   destX,
                //   destY,
                //   colWidth,
                //   rowHeight
                // );
              }
            }
          }
        }
        // console.log(canvas.toDataURL("image/jpeg"));
        
        // Provide the result image
        eventBus.emit("UploadResultImage", canvas.toDataURL("image/jpeg"));
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
    offset: {
      type: Object,
      required: true,
    },
    invert: {
      type: Object,
      required: true,
    },
    // duplicate: {
    //   type: Object,
    //   required: true,
    // },
  },

  watch: {
    imageSource() {
      this.debouncedConvert();
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