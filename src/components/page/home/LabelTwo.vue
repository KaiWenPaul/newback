<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>二级分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-input v-model="labelTwoId" placeholder="输入分类id" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
            </div>
            <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="showAddDialog">新增</el-button>
             <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
               <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="labelTwoId" label="ID"  align="center" ></el-table-column>
                <el-table-column prop="labelTwo" label="名称"  align="center"></el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-arrow-left" @click="getUp(scope.row)">上一级</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="goGoods(scope.row)">查看产品</el-button>
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
            </div>-->
        </div>

        <!--新增界面-->
        <el-dialog title="二级分类" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item label="分类名称">
                <el-input v-model="addForm.labelTwo" auto-complete="off" placeholder="请输入分类名"></el-input>
            </el-form-item>
            <el-form-item label="侧部推荐图">
                 <el-col :span="5">
                  <el-upload
                        class="avatar-uploader"
                        :action="loadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="image" :src="image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    </el-col>
            </el-form-item>
             <el-form-item label="权重">
                <el-input v-model="addForm.weight" auto-complete="off" placeholder="请输入权重值"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addSubmit">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
            </el-form>
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
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                check_state: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                listVisible:false,
                addFormVisible:false,//新增
                editFormVisible:false,//编辑
                addForm:{},
                editForm: {
                },
                idx: -1,
                isAdd:false,
                articleId:'',
                isUp:false,
                delId:'',
                //搜索条件
                name:'',
                parentId:this.$route.query.id,
                labelTwoId:'',
                image:'',
                 loadImg:url+"distributor/uploadimg/fileUpload",
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取列表数据
           getData() {
                var filter = {};
                 filter.labelOneId = this.$route.query.id
                if(this.labelTwoId!=''){filter.labelTwoId = this.labelTwoId;}
                this.$ajax.postu(url+'/HomeLabelTwo.api?selectByPrimaryKey',filter).then((res) => {
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
            goGoods(row){
                 this.$router.push({ path: '/label_goods',query:{id:row.labelTwoId}})
            },
            getUp(row){
                this.$router.push({ path: '/labelOne'})
            },
            showAddDialog() {
               this.addFormVisible = true;
                this.addForm = {};
                this.image = '';
                this.isAdd = true;
            },
            //新增
            addSubmit() {
                 if(this.isAdd==true){
                    this.addForm.labelOneId = this.$route.query.id;
                    this.$ajax.postu(url+"/HomeLabelTwo.api?insert",this.addForm).then((res) => {
                        if (res.status == "ok") {
                            this.$message({
                                message:'添加成功',
                                type: 'success'
                            });
                            this.addFormVisible = false;
                            this.getData();
                        } else {
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        }
                    });
                }else if(this.isAdd==false){
                     this.addForm.labelTwoId = this.idx;
                     this.$ajax.postu(url+"/HomeLabelTwo.api?updateByPrimaryKeySelective",this.addForm).then((res) => {
                        if (res.status == "ok") {
                            this.$message({
                                message:'修改成功',
                                type: 'success'
                            });
                            this.addFormVisible = false;
                            this.getData();
                        } else {
                        this.$message({
                            message: res.error,
                            type: 'error'
                        });
                        }
                    });
                }
              
            },
            // 编辑
            handleEdit(index, row) {
              this.addFormVisible = true;
              this.isAdd = false;
              this.idx = row.labelTwoId;
              this.image = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.image;
                        
              this.addForm={
                image:row.image,
                labelTwo:row.labelTwo,
                weight:row.weight
              }
            },
           
            cancel(){
               this.addFormVisible = false;
               this.pwVisible = false;
               this.editFormVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.labelTwoId;
                this.delVisible = true;  
            },
             // 确定删除
             deleteRow(){
                 this.$ajax.postu(url+'HomeLabelTwo.api?deleteByPrimaryKey',{labelTwoId:this.idx}).then((res) => {
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
              // 图片上传
            handleAvatarSuccess(res, file) {
                this.image = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.image=res.data;
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                 return  isLt2M;
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
        width: 250px;
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
   .avatar-uploader{
       float:left;
       margin-right:5px;
   }
</style>
