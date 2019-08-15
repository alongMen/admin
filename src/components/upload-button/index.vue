<template>
  <div class="upload-button">
    <div class="button" v-if="!src" @click="open">
      <Icon type="md-cloud-upload" size="30"/>
    </div>

    <div class="img" v-else>
      <img :src="src" width="60" height="60">
      <div class="cover">
        <Icon type="ios-eye-outline" @click.native="handleView" color="#fff" size="24"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove" color="#fff" size="24" v-show='showDelete'></Icon>
      </div>
    </div>

    <Progress :percent="percent" v-show="showProgress" :stroke-width="5"></Progress>

    <input type="file" v-show="false" ref="input" @change="upload" :accept="accept">
    <Modal title="查看图片" v-model="visible">
      <img :src="src" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>


<script>
import { upload_image } from "@/utils/upload";
export default {
  props: {
    value: String,
    accept: String,
    showDelete:{
      type:Boolean,
      default:true,
    }
  },
  data() {
    return {
      percent: 0,
      visible: false,
      showProgress: false,
    };
  },
  computed: {
    src: {
      get() {
        return this.value;
      },
      set(src) {
        this.$emit("input", src);
      }
    }
  },
  methods: {
    handleView() {
      this.visible = true;
    },
    handleRemove() {
      this.src = "";
    },
    open() {
      this.$refs.input.value = "";
      this.$refs.input.click();
    },
    async upload(e) {

      this.showProgress = true;
      const res = await upload_image( e ,"test" , this.progress);
      if(res.res.status < 400 ){
        this.$Notice.success({
          title: "上传成功"
        });
        this.src = res.url;
        this.showProgress = false;
      }
    },
    progress(e) {
      this.percent = parseInt((e.loaded / e.total) * 100);
    }
  }
};
</script>



<style lang="less" scoped>
.upload-button {
  .button {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px #ccc dotted;
    cursor: pointer;
    &:hover {
      color: #2d8cf0;
      border-color: #2d8cf0;
    }
  }

  .img {
    width: 60px;
    height: 60px;
    position: relative;
    .cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    &:hover .cover {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    i {
      cursor: pointer;
      &:hover {
        color: #2d8cf0 !important;
      }
    }
  }
}
</style>
