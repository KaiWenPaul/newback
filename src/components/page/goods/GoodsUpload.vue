<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>产品上传管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--<div class="handle-box">
              <el-input v-model="couponNo" placeholder="输入优惠券编号" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>-->
           <div class="handle-box add">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="openLoad">上传商品</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="memberId" label="用户id" align="center"></el-table-column>
                <el-table-column prop="excelName" label="服务器文件名" align="center"></el-table-column>
                <el-table-column prop="primaryExcelName" label="原文件名" align="center"></el-table-column>
                <el-table-column prop="journal" label="返回信息" align="center"></el-table-column>
                <el-table-column prop="completeType" label="上传进度" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.completeType != ''">{{scope.row.completeType}}%</span>  
                        <span v-else>{{scope.row.redisType=='null'?'等待上传':scope.row.redisType+'%'}}</span>
                   </template>
                </el-table-column>
                <el-table-column  label="来源" align="center">
                     <template slot-scope="scope">
                        <span v-if="scope.row.source == '0'">上传</span>  
                        <span v-else-if="scope.row.source == '1'">更新</span>
                        <span v-else>{{scope.row.source}}</span>
                   </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="上传时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="附件" :visible.sync="loadVisible">
            <el-upload
                :action="loadAction"
                :on-success="upload_success"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :limit="1"
                :on-exceed="handleExceed"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">上传成功后，请点击保存,可连续上传多个文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loadVisible = false">关闭</el-button>
                <el-button type="primary" @click.native="save" :loading="saveLoading">保存</el-button>
            </span>
        </el-dialog>
       <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                loadVisible:false,
                isAdd:false,
                title:'',
                form: {
                },
                couponNo:'',
                id:'',
                idx: -1,
                fileList:[],
                loadAction:url+"/goodsController.api?loadExcel",
                timer:null,
                saveLoading:false,
                fileIds:'',
                uploadId:''
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            this.timer = window.setInterval(this.getData, 2000);
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.$ajax.postu(url+'ExcelLogInterfaces.api?delete',{id:this.fileIds,memberId:localStorage.getItem('account_id')}).then((res) => {
                    if (res.status == "ok") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            handlePreview(file) {
                console.log(file);
                
            },
             handleExceed(files, fileList) {
                this.$message.warning(`暂只支持上传一个文件`);
            },
             // 上传成功回调
            upload_success:function(response, file, fileList){
                console.log(fileList)
                var windowName = "/mnt/disha"+response.data;
                this.upLoad(windowName,file.name,0)
            },

            openLoad(){
                this.loadVisible = true;
            },
            // 获取列表数据
            getData() {
                var filter = {};
                this.$ajax.postu(url+'/ExcelLogInterfaces.api?selectlist',{memberId: localStorage.getItem('account_id')}).then((res) => {
                    if (res.status == "ok") {
                       this.tableData = res.data;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            upLoad(arr,brr,crr) {
                var filter = {};
                filter.memberId = localStorage.getItem('account_id');
                filter.excelName = arr;
                filter.primaryExcelName =brr;
                filter.source = crr;
                this.$ajax.postu(url+'/goodsController.api?excelloginsert',filter).then((res) => {
                    if (res.status == "ok") {
                       this.fileIds = res.data;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
           save(){
                this.saveLoading = true;
                var filter = {};
                filter.id = this.fileIds;
                console.log(this.fileIds)
                filter.merchants_account_id1 = localStorage.getItem('account_id');
                this.$ajax.postu(url+"/goodsController.api?loadGoodsDetailExcelNew",filter).then((res) => {
                    this.loadVisible = false;
                    this.saveLoading = false;
                    this.fileList = [];
                    // if (res.status == "ok") {
                    // this.timer =window.setInterval(this.getData, 1000);
                    // } else {
                    //     this.$message({
                    //     message: res.error,
                    //     type: 'error'
                    //     });
                    // }
                }); 
           },
             handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
                
            },
              // 确定删除
            deleteRow(){
                 this.$ajax.postu(url+'ExcelLogInterfaces.api?delete',{id:this.idx,memberId:localStorage.getItem('account_id')}).then((res) => {
                    if (res.status == "ok") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
         
          
           
           
        },
    beforeDestroy() {
        if(this.timer) {
        　　　　clearInterval(this.timer); //关闭
        　　}  
    }
 }

</script>

<style>
    .handle-box {
        margin-bottom: 20px;
    }
   .el-button+.el-button a{
        color:#fff;
    }
    .handle-select {
        width: 120px;
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
    .add a{
        color: #fff;
        width: 58px;
        height: 30px;
        display: block;
        text-align: center;
        line-height: 30px;
        border-radius: 3px;
        background-color:#409EFF;
    }
    .el-icon-plus{
        line-height:180px;
    }
    .avatar{
        width:180px;
        height:180px;
    }
   .el-upload-list__item-name:hover{
      background:#fff !important;
   }
</style>
