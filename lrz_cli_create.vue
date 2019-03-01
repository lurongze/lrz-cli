<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
      <el-form-item label="标题" prop="fdescribe">
        <el-input v-model="form.fdescribe"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="fcontext">
        <el-input type="textarea" :rows=10  v-model="form.fcontext"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">保存</el-button>
        <el-button @click.native.prevent="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "editor",
  data : function(){
    return {
      loading:false,
      form:{
      },
      rules:{
      }
    }
  },
  mounted:function () {
    this.onMounted();
  },
  methods:{
    onMounted:function () {
      let _this = this;
      let id = _this.$route.params.id || '';
      if(id && id.length){
        _this.getDetail(id);
      }else{
        let userInfo = _this.$root.getUserInfo();
        _this.form.fcreatorid = userInfo.fpersonid;
        _this.form.flastupdateuserid = userInfo.fpersonid;
        _this.form.fcontrolunitid = userInfo.fcontrolunitid;
      }
    },
    submit:function () {
      let _this = this;
      let serviceLink = "";
      let tip = "";
      let id = _this.$route.params.id || '';

      _this.$refs.form.validate((valide)=>{
        if(valide){
          _this.loading = true;
          if(id && id.length){//修改
            serviceLink = "/t/app/ask/update";
            tip = "修改";
            delete _this.form.fcreatetime;
            delete _this.form.fcreatorid;
            delete _this.form.flastupdatetime;
            delete _this.form.flastupdateuserid;
            delete _this.form.commentlist;
            delete _this.form.creater;
            delete _this.form.tiplist;
            delete _this.form.cyclopediatypelist;
          }else{
            serviceLink = "/t/app/ask/add";
            _this.form.isback = 1;//后台添加的
            tip = "新增";
          }
          _this.$axios.post(serviceLink,_this.form)
            .then(function (response) {
              let res = response.data;
              if(res.code == 200){
                _this.$root.showTips(tip+"成功！");
                _this.$router.push('/ask-list');
              }else{
                _this.$root.showError(tip+"失败！");
              }
            })
        }
      });
    },
    getDetail:function (id) {
      let _this = this;
      _this.$axios.post("/t/app/ask/detail",{
        id:id
      }).then(function (response) {
        let res = response.data;
        let id2List = [];
        let name2List = [];
        if(res.code == 200){
          _this.form = res.data;
          console.log('_this.form',_this.form)
          if(res.data.cyclopediatypelist){
            let type2List = res.data.cyclopediatypelist;
            type2List.forEach(function (value) {
              id2List.push(value.fid);
              name2List.push(value.fname);
            })
            _this.form.cyclopediaCategoryName = name2List.join(",");
            _this.form.fcyclopediatypeid = id2List.join(",");
          }
        }else{
          _this.$root.showError(res.message || '参数确实！');
        }
      })
    },
    selectProduct:function () {
      let _this = this;
      _this.dialogFormVisible = true;
    },
  }
}
</script>

<style scoped>

</style>
