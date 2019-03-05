<template>
  <section>
    <div class="ml-list-header">
      <el-button @click="$router.push(addPath)" type="primary">新增</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading"  stripe style="width: 100%">
      
      <el-table-column prop='title' label='标题'></el-table-column>
    
      <el-table-column prop='description' label='描述'></el-table-column>
    
      <el-table-column prop='picture' label='头图'></el-table-column>
    
      <el-table-column prop='pictures' label='轮播图'></el-table-column>
    
      <el-table-column prop='createTime' label='时间'></el-table-column>
    
      <el-table-column prop='content' label='内容'></el-table-column>
    
      <el-table-column  label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="mini">修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="ml-pager">
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="size" @current-change="currentChange" />
    </div>
  </section>
</template>
<script>
// 这里的参数要根据情况修改
let serviceLinkBase = '/t/app/index'; // 接口请求的路径，一般和/t/app/article 类似
let editorPath = '${serviceLinkBaseStr}'; //
export default {
  name: 'index',
  data() {
    return {
      addPath: editorPath,
      tableData: [],
      currentPage:1,
      total:0,
      loading:false,
      size:15,
    }
  },
  mounted: function () {
    this.getList(this.currentPage);
  },
  methods: {
    handleDelete: function (row) {
      this.$root.confirm(() => {
        //删除操作
        this.$axios.post(`${serviceLinkBase}/delete`,{
          id:row.fid
        }).then((response) => {
          let res = response.data;
          if(res.code == 200){
            this.getList(this.currentPage);
            this.$root.showTips('删除成功！');
          }else{
            this.$root.showError(res.message || '出错了');
          }
        });
      })
    },
    handleUpdate(row) {
      this.$router.push({path: `${editorPath}/${row.fid}`});
    },
    //跳转分页
    currentChange(e) {
      this.currentPage = e;
      this.getList(e);
    },
    getList(page) {
      if(this.loading){
        return false;
      }else{
        this.loading = true;
        this.currentPage = page;
      }
      const fcontrolunitid =  this.$root.getFcontrolunitid();
      this.$axios.post(`${serviceLinkBase}/list`,{
        page:page,
        size:this.size,
        fcontrolunitid:fcontrolunitid,
      }).then((response) => {
        let res = response.data.data;
        this.total = res.total;
        this.tableData = res.list;
      }).finally((res) =>{
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>
</style>
