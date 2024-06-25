<template>
    <div class="container">
        <div :style="imgBoxStyles" class="img-box">
            <div class="crop-box">
                <!-- <p v-if="cropSize">{{ cropSize }} {{ inputSize }}</p> -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CropPreview",

        data() {
            return {
                widthI: '100%',
                heightI: '100%',

                widthC: '100%',
                heightC: '100%',
            }
        },
        props: {
            inputSize: {
                type: Number,
                // default: () => require(null)
            }, 
            cropSize: {
                type: String,
                // default: () => require(null)
            },
        },

        methods: {
            updateImage(){
                // width / height
                var temp_h = 100, temp_w = 100;
                if(this.inputSize > 1){
                    temp_h = temp_w / this.inputSize;
                } else {
                    temp_w = temp_h * this.inputSize;
                }
                this.widthI = temp_w + '%';
                this.heightI = temp_h + '%';
            },
        },
        computed: {
            imgBoxStyles() {
                return {
                    width: this.widthI,
                    height: this.heightI,
                };
            }
        },

    }

</script>

<style lang="scss" scoped>
.container {
    position: inherit;
    display: flex;
    width: 100%;
    height: 100%;
    // background-color:red;

    .img-box {
        position:relative;
        display:flex;
        
        // width: 80%;
        // height: 80%;
        // margin-top: auto;
        margin: 0 auto auto auto;
        background-color: red;
        // .crop-box {

        // }
    }
}

</style>