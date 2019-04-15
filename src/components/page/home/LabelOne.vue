<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>产品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
               <div class="handle-box">
              <el-input v-model="labelOneId" placeholder="输入分类id" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="getData()">搜索</el-button>
            </div>
            <div class="handle-box add">
             <el-button type="primary" icon="el-icon-circle-plus-outline" class="handle-del mr10" @click="showDialog">新增</el-button>
             <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
               <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="labelOneId" label="ID"  align="center" ></el-table-column>
                <el-table-column prop="labelOne" label="名称"  align="center"></el-table-column>
                <el-table-column label="操作" width="270" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-circle-plus-outline" @click="getDown(scope.row)">下一级</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
             </el-table>
            <!--<div class="pagination">
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
        <el-dialog title="一级分类" :visible.sync="addFormVisible" :close-on-click-modal="false" width="80%">
            <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item label="分类名称">
               <el-input v-model="addForm.labelOne" auto-complete="off" placeholder="请输入分类名" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="侧部推荐图">
                 <el-col :span="3">
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
                            <el-input v-model="addForm.imageUrl" auto-complete="off" placeholder="图片链接地址"></el-input>
                    </el-col>
            </el-form-item>
             <el-form-item label="底部推荐图一">
                 <el-col :span="3">
                    <el-upload
                        class="avatar-uploader"
                        :action="loadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageOne" :src="imageOne" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlOne" auto-complete="off" placeholder="图片链接地址"></el-input>
                 </el-col>
                 <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                <el-col class="line" :span="2" align="center">底部推荐图二</el-col>
                <el-col :span="3">
                    <el-upload
                    class="avatar-uploader"
                    :action="loadImg"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageTwo" :src="imageTwo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlTwo" auto-complete="off" placeholder="图片链接地址"></el-input>
                </el-col>
                   <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                <el-col class="line" :span="2" align="center">底部推荐图三</el-col>
                <el-col :span="3">
                    <el-upload
                    class="avatar-uploader"
                    :action="loadImg"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess3"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageThree" :src="imageThree" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlThree" auto-complete="off" placeholder="图片链接地址"></el-input>
                </el-col>
         
            </el-form-item>
               <el-form-item label="底部推荐图四">
                 <el-col :span="3">
                    <el-upload
                        class="avatar-uploader"
                        :action="loadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess4"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageFour" :src="imageFour" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlFour" auto-complete="off" placeholder="图片链接地址"></el-input>
                 </el-col>
                 <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                <el-col class="line" :span="2" align="center">底部推荐图五</el-col>
                <el-col :span="3">
                    <el-upload
                    class="avatar-uploader"
                    :action="loadImg"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess5"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageFive" :src="imageFive" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlFive" auto-complete="off" placeholder="图片链接地址"></el-input>
                </el-col>
                   <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                <el-col class="line" :span="2" align="center">底部推荐图六</el-col>
                <el-col :span="3">
                    <el-upload
                    class="avatar-uploader"
                    :action="loadImg"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess6"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageSix" :src="imageSix" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="font-size:12px;color:#999;">上传图片格式为200 X 98</p>
                    <el-input v-model="addForm.imageUrlSix" auto-complete="off" placeholder="图片链接地址"></el-input>
                </el-col>
         
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
                labelOneId:'',
                parentId:this.$route.query.id,
                loadImg:url+"orderInterfaces.api?uploadAssessmentImg",
                image:'',
                imageOne:'',
                imageTwo:'',
                imageThree:'',
                imageFour:'',
                imageFive:'',
                imageSix:'',
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
                if(this.labelOneId!=''){filter.labelOneId = this.labelOneId;}
                this.$ajax.postu(url+'/HomeLabelOne.api?selectByPrimaryKey',filter).then((res) => {
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
            getDown(row){
                this.$router.push({ path: '/labelTwo',query:{id:row.labelOneId}})
            },
            showDialog() {
                this.addFormVisible = true;
                this.addForm = {};
                this.image = '';
                this.imageOne = '';
                this.imageTwo = '';
                this.imageThree = '';
                this.imageFour = '';
                this.imageFive = '';
                this.imageSix = '';
               
                this.isAdd = true;
            },
            //新增
            addSubmit() {
                if(this.isAdd==true){
                    this.$ajax.postu(url+"/HomeLabelOne.api?insert",this.addForm).then((res) => {
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
                     this.addForm.labelOneId = this.idx;
                     this.$ajax.postu(url+"/HomeLabelOne.api?updateByPrimaryKeySelective",this.addForm).then((res) => {
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
              this.idx = row.labelOneId;
              this.image = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.image;
              this.imageOne = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageOne;
              this.imageTwo = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageTwo;
              this.imageThree ="https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageThree;
              this.imageFour = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageFour;
              this.imageFive ="https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageFive;
              this.imageSix = "https://valubio-static.oss-cn-shanghai.aliyuncs.com/"+row.imageSix;
                        
              this.addForm={
                image:row.image,
                imageOne:row.imageOne,
                imageTwo:row.imageTwo, 
                imageTwo:row.imageTwo,
                imageTwo:row.imageTwo,
                imageFive:row.imageFive,
                imageSix:row.imageSix,
                imageUrl:row.imageUrl,
                imageUrlFive:row.imageUrlFive,
                imageUrlFour:row.imageUrlFour,
                imageUrlOne:row.imageUrlOne,
                imageUrlSix:row.imageUrlSix,
                imageUrlThree:row.imageUrlThree,
                imageUrlTwo:row.imageUrlTwo,
                labelOne:row.labelOne,
              }
            },
            // 保存编辑
            editSubmit() {
                var params={};
                params.name = this.editForm.name;
                params.id = this.editForm.id;
                params.parentId = this.editForm.parentId;
                console.log(params)
                this.$ajax.post('/v1/class/update',params).then((res) => {
                    if (res.code == "200") {
                         this.$message({
                            message:'修改成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getData();
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
               
            },
            cancel(){
               this.addFormVisible = false;
               this.pwVisible = false;
               this.editFormVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.labelOneId;
                this.delVisible = true;  
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(url+'HomeLabelOne.api?deleteByPrimaryKey',{labelOneId:this.idx}).then((res) => {
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
            handleAvatarSuccess1(res, file) {
                this.imageOne = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageOne=res.data;
            },   handleAvatarSuccess2(res, file) {
                this.imageTwo = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageTwo=res.data;
            },   handleAvatarSuccess3(res, file) {
                this.imageThree = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageThree=res.data;
            },   handleAvatarSuccess4(res, file) {
                this.imageFour = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageFour=res.data;
            },   handleAvatarSuccess5(res, file) {
                this.imageFive = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageFive=res.data;
            },   handleAvatarSuccess6(res, file) {
                this.imageSix = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.imageSix=res.data;
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
