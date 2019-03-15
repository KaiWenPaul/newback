<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布-新增活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-steps :space="400" :active="active" finish-status="success">
                    <el-step title="选择模板"></el-step>
                    <el-step title="新建活动"></el-step>
                    <el-step title="导入产品"></el-step>
                </el-steps>
            </div>
            <div class="handle-box" style="width:96%;min-height:500px;margin:0 auto;padding:20px 30px;border:1px solid #f5f5f5;">
            <!--选择模板-->
             <div style="width:100%;height:100%;" class="select">
              <div style="height:500px;width:250px;float:left;">
                <div style="width:100%;height:400px;border:1px solid #f5f5f5;">
                  <img src="static/img/12.png" class="user-avator" alt="">
                </div>
                <div style="width:100%;height:35px;text-align:center;margin-top:15px;">
                  <el-button type="primary" @click="createActivity(1)">创建活动</el-button>
                </div>
              </div>

              <div style="height:500px;width:250px;float:left;margin-left:30px;">
                <div style="width:100%;height:400px;border:1px solid #f5f5f5;">
                 <img src="static/img/tm2.png" class="user-avator" alt="">
                </div>
                <div style="width:100%;height:35px;text-align:center;margin-top:15px;">
                  <el-button type="primary" @click="createActivity(2)">创建活动</el-button>
                </div>
              </div>
    
              <div style="height:500px;width:250px;float:left;margin-left:30px;">
                <div style="width:100%;height:400px;border:1px solid #f5f5f5;">
                  <img src="static/img/tm3.png" class="user-avator" alt="">
                </div>
                <div style="width:100%;height:35px;text-align:center;margin-top:15px;">
                  <el-button type="primary" @click="createActivity(3)">创建活动</el-button>
                </div>
              </div>
              <div style="height:500px;width:250px;float:left;margin-left:30px;">
                <div style="width:100%;height:400px;border:1px solid #f5f5f5;">
                  <img src="static/img/tm4.png" class="user-avator" alt="">
                </div>
                <div style="width:100%;height:35px;text-align:center;margin-top:15px;">
                  <el-button type="primary" @click="createActivity(4)">创建活动</el-button>
                </div>
              </div>
            </div>
            

            </div>
         
           
        </div>

       
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                active:1,
                idx: -1,
               
            }
        },
        created() {
        },
        mounted(){
           this.active = 1;
        },
        methods: {
            // 新建活动
            createActivity(arr){
                this.$router.push({ path: '/add_activity_add',query: {id:arr}})
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
   .el-steps--horizontal{
       padding-left:300px;
   }
    .handle-select {
        width: 120px;
    }
   .handle-box .select.act{
       display:none;
   }
   .handle-box .create.act{
       display:block;
   }
    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
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
  .el-upload--text{
      width:180px !important;
  }
</style>
