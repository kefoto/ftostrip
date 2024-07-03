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

    this.debouncedConvert = debounce(this.convertEdit, 300);
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

      const dupX = this.duplicate.x;
      const dupY = this.duplicate.y;

      var offsetX = this.offset.x;
      var offsetY = this.offset.y;


      image.onload = function () {
        const imgWidth = image.width;
        const imgHeight = image.height;

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        
        // const colWidth = imgWidth / splitX;
        // const rowHeight = imgHeight / splitY;

        const colWidth = imgWidth / dupX;
        const rowHeight = imgHeight / dupY;
        

        offsetX = offsetX / 10 * colWidth;
        offsetY = offsetY / 10 * rowHeight;
        
        // console.log(offsetX, offsetY);


        for (let i = 0; i < splitX; i++) {
          for (let j = 0; j < splitY; j++) {
            // const sx = i * colWidth + offsetX;
            // const sy = j * rowHeight + offsetY;
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

                // let flipHorizontally = (di % 2 === 1);
                // let flipVertically = (dj % 2 === 1);

                

                // if ((di % 2 === 1) && (dj % 2 === 1)){

                // } else if (di % 2 === 1) {

                // } else if (dj % 2 === 1) {

                // } else {

                // }
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
                        0, 
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

              }
            }
          }
        }
        
        // Provide the result image
        eventBus.emit("UploadResultImage", canvas.toDataURL("image/jpeg"));
      };
    },

    fillOffset(ctx, offsetX, offsetY, image, sx, sy, colWidth, rowHeight, destX, destY, scaledWidth, scaledHeight) {
        if (offsetX > 0) {
            ctx.drawImage(image, sx - colWidth, sy, colWidth, rowHeight, destX - scaledWidth, destY, scaledWidth, scaledHeight);
        } else if (offsetX < 0) {
            ctx.drawImage(image, sx + colWidth, sy, colWidth, rowHeight, destX + scaledWidth, destY, scaledWidth, scaledHeight);
        }

        if (offsetY > 0) {
            ctx.drawImage(image, sx, sy - rowHeight, colWidth, rowHeight, destX, destY - scaledHeight, scaledWidth, scaledHeight);
        } else if (offsetY < 0) {
            ctx.drawImage(image, sx, sy + rowHeight, colWidth, rowHeight, destX, destY + scaledHeight, scaledWidth, scaledHeight);
        }
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
    duplicate: {
      type: Object,
      required: true,
    },
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