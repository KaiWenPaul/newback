<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" style="padding-left:300px;">
              <!--<el-input v-model="labelGoodsId" placeholder="输入产品id" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="getData()">搜索</el-button>-->
           </div>
           <div class="handle-box">
                <el-button size="small" type="primary" @click="open">导入</el-button>
                 <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-button size="small" type="primary" @click="download">下载模板</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                   <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="goods_name" :show-overflow-tooltip="true" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="brand_name" label="品牌名称" align="center"></el-table-column>
                <el-table-column prop="goods_sku" label="商品货号" align="center"></el-table-column>
              
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                           <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
           <!-- <div class="pagination">
         
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="total,prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
             -->
        </div>
        <el-dialog title="上传产品" :visible="dialogVisible" width="30%">
           <div style="width:100%;height:100px;">
              <form  id="form" enctype="multipart/form-data">
                <!--<input type="text" value="1" v-model="id">-->
                <div style="width:100%;line-height:30px;"><input type="file" id="test" @change="getFile($event)"></div>
                <div style="width:100%;margin-top:20px;"> 
                  <button @click="submitForm($event)" style="width:70px;height:30px;text-align:center;background:#409EFF;border:none;border-radius:3px;color:#fff;">提交</button>
                   <button @click="cancel" style="width:70px;height:30px;text-align:center;background:#409EFF;border:none;border-radius:3px;color:#fff;">取消</button>
                </div>
              </form>
              </div>
        </el-dialog>
        <!-- 编辑弹出框-->
        <el-dialog title="编辑" :visible="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商品ID">
                    <el-input v-model="form.goodsId"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="品牌名称">
                    <el-input v-model="form.brand_name"></el-input>
                </el-form-item>
                <el-form-item label="产品货号">
                    <el-input v-model="form.goods_sku"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible="delVisible" width="300px" center @close="cancel">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//    Vue.prototype.$http = axios;
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                dialogVisible:false,
                addactivityId:this.$route.query.id,
                active:3,
                id:'',
                file:'',
                idx: -1,
                page:1,
                total:0,
                form:{
                   goods_name:'',
                   goodsId:'',
                   brand_name:'',
                   goods_sku:'',
                   labelGoodsId:'',
                },
                labelGoodsId:''
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
          this.getData();
          console.log(this.addactivityId)
        },
        methods: {
            getData(){
                 var filter = {};
                //  filter.pageNum  = this.page;
                //  filter.pageSize=10;
                 filter. labelTwoId =this.$route.query.id;
                if(this.labelGoodsId!=''){filter.labelGoodsId = this.labelGoodsId;}
                 this.$ajax.postu(url+'HomeLabelGoods.api?selectByPrimaryKey',filter).then((res) => {
                    if (res.status == "ok") {
                       this.tableData = res.data;
                    //    this.total = res.data.total;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
            },

            // 导入功能方法
            getFile(event) {
                this.file = event.target.files[0];
                console.log(this.file);
			},
            open(){
                this.dialogVisible=true; 
            },
            cancel(){
                this.dialogVisible = false;
                this.delVisible = false;
                $('#test').val('')
            },
            //下载模板
            download(){
             window.open(downUrl+"/excel/uploadlabegoods.xlsx")
            //   window.open(imgUrl+'/HomeLabelGoods.api?download');
            },
            submitForm(event) {
                var self =this;
                event.preventDefault();
                let formData = new FormData();
                formData.append('labelTwoId', this.$route.query.id);
                formData.append('file', this.file);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.$axios.post(imgUrl+'HomeLabelGoods.api?upload', formData, config).then(function(res) {
                    if(res.data.status == 'ok') {
                        /*这里做处理*/
                        self.$message.success('上传成功');
                        self.dialogVisible=false;
                        $('#test').val('')
                        self.getData();
                        console.log(123)
                    }
                })
            
			},
        
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleEdit(index, row) {
                // const item = this.tableData[index];
                this.form={
                   activityPrice:row.activityPrice,
                   classifiedLabel:row.classifiedLabel,
                   haveIntegral:row.haveIntegral,
                   id:row.id,
                   addactivityId:row.addactivityId,
                   googsId:row.googsId
                }
                this.editVisible = true;
            },
              // 保存编辑
            saveEdit() {
                 this.$ajax.postu(url+'distributor/tstdistributorgoods.api?update',this.form).then((res) => {
                    if (res.description == "success") {
                       this.$message.success('修改成功');
                       this.editVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            handleDelete(index, row) {
                this.idx = row.labelGoodsId;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
                this.$ajax.postu(url+'HomeLabelGoods.api?deleteByPrimaryKey',{labelGoodsId:this.idx}).then((res) => {
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
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id+',';
                }
               var strs = str.substring(0,str.length-1);
               this.$ajax.postu(url+'/distributor/tstdistributorgoods.api?doRemoveeMore',{arr:strs}).then((res) => {
                    if (res.description == "success") {
                       this.$message.success('批量删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
          
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
    .el-dialog{
        width:18%;
    }
     .el-dialog__headerbtn .el-dialog__close{
       display:none !important;
   }
</style>
