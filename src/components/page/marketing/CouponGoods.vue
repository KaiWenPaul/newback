<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" style="padding-left:300px;">
               
           </div>
           <div class="handle-box">
                 <!--<el-button size="small" type="primary" @click="open">导入</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button size="small" type="primary" @click="download">下载模板</el-button>-->
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="addOpen">新增</el-button>
              
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="couponId" label="优惠券ID" align="center"></el-table-column>
                <!--<el-table-column prop="tstgoodsbrief.goodsName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="tstgoodsbrief.goodsSku" label="商品货号" align="center"></el-table-column>
                <el-table-column prop="activityPrice" label="活动价格" align="center"></el-table-column>
                <el-table-column prop="classifiedLabel" label="分类标签" align="center"></el-table-column>
                <el-table-column label="有无积分">
                 <template slot-scope="scope">
                        <span v-if="scope.row.haveIntegral == '0'">无</span>  
                         <span v-else-if="scope.row.haveIntegral == '1'">有</span>
                         <span v-else>{{scope.row.haveIntegral}}</span>
                 </template>
                </el-table-column>-->
              
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog title="上传产品" :visible.sync="dialogVisible" width="30%">
           <div style="width:100%;height:100px;">
              <form  id="form" enctype="multipart/form-data">
                <!--<input type="text" value="1" v-model="id">-->
                <div style="width:100%;line-height:30px;"><input type="file" @change="getFile($event)"></div>
                <div style="width:100%;margin-top:20px;"> <button @click="submitForm($event)" style="width:70px;height:30px;text-align:center;background:#409EFF;border:none;border-radius:3px;color:#fff;">提交</button></div>
              </form>
              </div>
        </el-dialog>
          <!-- 新增弹出框-->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="100px">
                <el-form-item label="商品ID">
                    <el-input v-model="addForm.goodsId"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框-->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="商品ID">
                    <el-input v-model="form.goodsId"></el-input>
                </el-form-item>
                <!--<el-form-item label="活动价格">
                    <el-input v-model="form.activityPrice"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-model="form.classifiedLabel"></el-input>
                </el-form-item>
                <el-form-item label="有无积分">
                        <el-select v-model="form.haveIntegral" placeholder="请选择">
                            <el-option key="1" label="有" value="1"></el-option>
                            <el-option key="0" label="无" value="0"></el-option>
                        </el-select>
                </el-form-item>-->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
//    Vue.prototype.$http = axios;
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                is_search: false,
                editVisible: false,
                addVisible:false,
                delVisible: false,
                dialogVisible:false,
                couponId:this.$route.query.id,
                active:3,
                cur_page:1,
                id:'',
                file:'',
                idx: -1,
                page:1,
                total:0,
                addForm:{},
                form:{
                }
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
          this.getData();
        },
        methods: {
            getData(){
                 var filter = {};
                //   filter.page  = this.cur_page;
                //   filter.limit =10;
                 filter.couponId =this.couponId;
                 this.$ajax.postu(url+'/statecoupon.api?selectByPrimaryKey',filter).then((res) => {
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
            //下载模板
            download(){
              location.href=imgUrl+'distributor/resolve/download';
            },
            submitForm(event) {
                var self =this;
                event.preventDefault();
                let formData = new FormData();
                formData.append('addactivityId', this.addactivityId);
                formData.append('file', this.file);
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.$axios.post(imgUrl+'distributor/resolve/upload', formData, config).then(function(res) {
                    if(res.data.description === 'success') {
                        /*这里做处理*/
                        self.dialogVisible=false;
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
            // 打开新增弹框
            addOpen(){
                this.addVisible = true;
            },
            saveAdd(){
                this.addForm.couponId = this.couponId;
                this.$ajax.postu(url+'/statecoupon.api?insert',this.addForm).then((res) => {
                    if (res.status == "ok") {
                      this.addVisible = false;
                      this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            handleEdit(index, row) {
                this.form={
                   goodsId:row.goodsId
                }
                this.id = row.id;
                this.editVisible = true;
            },
              // 保存编辑
            saveEdit() {
                this.form.id = this.id;
                this.form.couponId = this.couponId;
                 this.$ajax.postu(url+'statecoupon.api?updateByPrimaryKeySelective',this.form).then((res) => {
                    if (res.status == "ok") {
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
                this.idx = row.id;
                this.delVisible = true;
            },
              // 确定删除
            deleteRow(){
                this.$ajax.postu(url+'/statecoupon.api?delete',{id:this.idx}).then((res) => {
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

<style scoped>
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
</style>
