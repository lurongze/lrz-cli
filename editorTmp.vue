<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
      ${formItem}
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">保存</el-button>
        <el-button @click.native.prevent="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
${importStr}

// 这里的参数要根据情况修改
let serviceLinkBase = '${serviceLinkBaseStr}'; // 接口请求的路径
let listPath = '${serviceLinkBaseStr}'; // 列表的路由，修改成功后跳转

export default {
  name: "${NAME}",
  components: {${componentsStr}},
  data(){
    return {
      loading:false,
      form:{${formData}
      },
      rules:{
      }
    }
  },
  mounted() {
    this.onMounted();
  },
  methods:{
    onMounted() {
      let id = this.$route.params.id || '';
      if(id && id.length){
        this.getDetail(id);
      }else{
        let userInfo = this.$root.getUserInfo();
        this.form.fcreatorid = userInfo.fpersonid;
        this.form.flastupdateuserid = userInfo.fpersonid;
        this.form.fcontrolunitid = userInfo.fcontrolunitid;
      }
    },
    submit() {
      let _this = this;
      let serviceLink = "";
      let tip = "";
      let id = this.$route.params.id || '';

      this.$refs.form.validate((valide)=>{
        if(valide){
          this.loading = true;
          if(id && id.length){//修改
            serviceLink = `${serviceLinkBase}/update`;
            tip = "修改";
            delete this.form.fcreatetime;
            delete this.form.fcreatorid;
            delete this.form.flastupdatetime;
            delete this.form.flastupdateuserid;
          }else{
            serviceLink = `${serviceLinkBase}/add`;
            this.form.isback = 1;//后台添加的
            tip = "新增";
          }

          ${formEditorGet}

          this.$axios.post(serviceLink,this.form)
            .then((response) => {
              let res = response.data;
              if(res.code == 200){
                this.$root.showTips(tip+"成功！");
                this.$router.push('/ask-list');
              }else{
                this.$root.showError(tip+"失败！");
              }
            })
        }
      });
    },
    getDetail(id) {
      this.$axios.post(`${serviceLinkBase}/detail`,{
        id:id
      }).then((response) => {
        let res = response.data;
        this.form = res.data;
        ${formEditorSet}
      })
    }
  }
}
</script>

<style scoped>

</style>
