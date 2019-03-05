<template>
  <div style="display: inline-flex;width: 95%;">
    <el-upload
      class="avatar-uploader"
      :name="formName"
      :action="uploadAction"
      :show-file-list="false"
      :on-success="handleAvatarSuccess">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: "image-upload",
    props:{
      image: {
        type: String,
      },
      tip:{
        type:String
      },
      uploadLink:{
        type:String
      },
      name:{
        type:String
      },
      type:{
        type:Number,
        default:1//1为图片，2为视频
      }
    },
    data : function(){
      return {
        fileType:this.type,
        uploadAction:this.uploadLink || this.$root.uploadLink,
        formName:this.name || "upfile"
      }
    },
    computed:{
      imageUrl:{
        get:function () {
          return this.image
        },
        set:function () {

        }
      }
    },
    mounted:function () {
      let _this = this;
    },
    methods: {
      handleAvatarSuccess(res, file) {
        let _this = this;
        _this.imageUrl = URL.createObjectURL(file.raw);
        _this.$emit("update:image",res.url);
        _this.$emit("onSuccess", res.url);
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
