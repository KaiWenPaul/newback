<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
               <div class="handle-box">
              <el-input v-model="classify_name" placeholder="输入分类名" class="handle-input mr10"></el-input>
              <el-input v-model="classify_id" placeholder="输入分类编号" class="handle-input mr10"></el-input>
             <!-- <el-input v-model="corporateName" placeholder="输入公司名称" class="handle-input mr10"></el-input>
              <el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>-->
              <el-select v-model="check_state" placeholder="状态" class="handle-select mr10">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="开启" value="0"></el-option>
                    <el-option key="1" label="关闭" value="1"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData()">搜索</el-button>
            </div>
            <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="showAddDialog">新增</el-button>
             <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
               <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="classify_id" label="分类编号"  align="center" ></el-table-column>
                <el-table-column prop="classify_name" label="分类名称"  align="center"></el-table-column>
                <el-table-column prop="article_num" label="文章数量"  align="center"></el-table-column>
                <el-table-column label="可见范围" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.is_look=='1'">全平台</span>
                   <span v-else-if="scope.row.is_look=='2'">登录用户</span>
                   <span v-else-if="scope.row.is_look=='3'">会员</span>
                   <span v-else>其它</span>
                  </template>
                </el-table-column>
                 <el-table-column  label="状态" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.is_check=='0'">开启</span>
                   <span v-else-if="scope.row.is_check=='1'">关闭</span>
                   <span v-else>{{scope.row.is_check}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间"  align="center"></el-table-column>
                <el-table-column label="操作" width="270" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-arrow-left" v-if="isUp==true" @click="getUp(scope.row)">上一级</el-button>
                        <el-button type="text" icon="el-icon-circle-plus-outline" @click="getDown(scope.row.classify_id)">下一级</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
             </el-table>
            <div class="pagination">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="10"
                layout="total,prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
        
        <!-- 编辑页面-->
        <el-dialog title="编辑分类" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" ref="editForm">
            <el-form-item label="栏目分类名称">
                <el-input v-model="editForm.classify_name" auto-complete="off" placeholder="1-10个字"></el-input>
            </el-form-item>

           <el-form-item label="一级分类">
              <el-select v-model="level_1" :disabled="disabledA" @change="getClass($event,2,1)" splaceholder="请选择">
                <el-option
                v-for="item in optionsA"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
               <span style="margin:0 10px;">二级分类</span>
               <el-select v-model="level_2" :disabled="disabledB" placeholder="请选择">
                <el-option
                v-for="item in optionsB"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
            </el-form-item>
           <el-form-item label="权重">
                <el-input v-model="editForm.sort" placeholder="大于等于0的整数，不写默认排在最前面"></el-input>
           </el-form-item>
           <el-form-item label="当前状态">
                <el-col :span="5">
                  <el-switch v-model="delivery"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="可见范围">
              <el-select v-model="editForm.is_look" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
               </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="备注">
                  <el-input type="textarea" :rows="4" placeholder="请输入活动规则" v-model="editForm.remake"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="editSubmit">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
            </el-form>
           
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增分类" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item label="栏目分类名称">
                <el-input v-model="addForm.classify_name" auto-complete="off" placeholder="1-10个字"></el-input>
            </el-form-item>
            <el-form-item label="一级分类">
              <el-select v-model="level_1" @change="getClass($event,2,1)" placeholder="请选择">
                <el-option
                v-for="item in optionsA"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
               <span style="margin:0 10px;">二级分类</span>
               <el-select v-model="level_2" placeholder="请选择">
                <el-option
                v-for="item in optionsB"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权重">
                <el-input v-model="addForm.sort" placeholder="大于等于0的整数，不写默认排在最前面"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-col :span="5">
                  <el-switch v-model="delivery"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="可见范围">
              <el-select v-model="addForm.is_look" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
               </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="备注">
                  <el-input type="textarea" :rows="4" placeholder="请输入活动规则" v-model="addForm.remake"></el-input>
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
                delivery:false,
                disabledA:false,
                disabledB:false,
                options:[{value:1,label:"全平台"},{value:2,label:"登录用户"},{value:3,label:"会员"}],
                optionsA:[], //分类数据
                optionsB:[],
                level_1:'',
                level_2:'',
                title:'',
                state:'',
                classify_name:'',
                classify_id:'',
                editForm: {
                },
                idx: -1,
                isAdd:false,
                articleId:'',
                isUp:false,
                delId:'',
                testData:{}
            }
        },
        created() {
            this.getData(0);
            this.getClass(0,1,0);
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
           getData(arr,crr) {
                var filter = {};
                filter.pageNum   = this.cur_page;
                filter.pageSize =10;
                filter.parent_id = arr;
                if(this.classify_name!=''){filter.classify_name=this.classify_name}
                if(this.check_state!=''){
                    if(this.check_state==3){
                       filter.is_check='' 
                    }else{
                       filter.is_check=this.check_state
                    }
                    }
                if(this.classify_id!=''){filter.classify_id=this.classify_id}
                   this.$ajax.postu(urlA+'/college/articleClassify/getArticleClassifyList', filter).then((res) => {
                    if (res.msg == "success") {
                        if(res.data.list!=''){
                           this.tableData = res.data.list;
                           this.total = res.data.total;
                           if(res.data.list[0].level=='2'||res.data.list[0].level=='3'){this.isUp=true}else{this.isUp=false}
                        }else{
                            if(crr){
                               if(crr.level=='3'){this.getData(crr.level_1)}else {this.getData(0)}
                            }else{
                               this.$message({
                                message:'没有东西了哟',
                                type: 'warning'
                                });
                            }
                           
                            
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                    }
                });
            },
            // 获取分类
            getClass(arr,brr,crr) {
                var filter = {};
                filter.parent_id =arr;
                this.$ajax.postu(urlA+'/college/articleClassify/getArticleClassify', filter).then((res) => {
                    if (res.msg == "success") {
                        if(brr=='1'){
                          this.optionsA = res.data;
                          this.optionsB = [];
                        }else if(brr=='2'){
                          this.optionsB = res.data;
                          if(crr=='1'){
                            this.level_2='';
                          }
                        }
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            // 下一级
            getDown(arr){
                var filter = {};
                filter.pageNum   = 1;
                filter.pageSize =10;
                filter.parent_id = arr;
                this.$ajax.postu(urlA+'/college/articleClassify/getArticleClassifyList', filter).then((res) => {
                    if (res.msg == "success") {
                        if(res.data.list!=''){
                           this.tableData = res.data.list;
                           this.total = res.data.total;
                           if(res.data.list[0].level=='2'||res.data.list[0].level=='3'){this.isUp=true}else{this.isUp=false}
                        }else{      
                               this.$message({
                                message:'没有东西了哟',
                                type: 'warning'
                                });                          
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                    }
                });
            },
            // 返回上一级
            getUp(row){
                var filter = {};
                filter.pageNum   = 1;
                filter.pageSize =10;
                if(row.level=='2'){
                   filter.parent_id = 0;
                }else if(row.level=='3'){
                   filter.parent_id = row.level_1;
                }
                this.$ajax.postu(urlA+'/college/articleClassify/getArticleClassifyList', filter).then((res) => {
                    if (res.msg == "success") {
                       this.tableData = res.data.list;
                       this.total = res.data.total;
                       if(res.data.list[0].level=='2'||res.data.list[0].level=='3'){this.isUp=true}else{this.isUp=false;}
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            showAddDialog() {
                this.addFormVisible = true;
                console.log(123)
                this.addForm = {};
                this.level_1 ='';
                this.level_2 ='';
                this.delivery=false;
            },
            //新增
            addSubmit() {
                if(this.level_1!=''&&this.level_2!=''){
                    this.addForm.parent_id = this.level_2;
                }
                if(this.level_1!=''&&this.level_2==''){
                    this.addForm.parent_id = this.level_1;
                }
                if(this.level_1==''&&this.level_2==''){
                    this.addForm.parent_id = 0;
                }
                if(this.delivery=true){this.addForm.is_check=0;}else{this.addForm.is_check=1;}
                this.$ajax.postu(urlA+'/college/articleClassify/saveArticleClassify',this.addForm).then((res) => {
                    if (res.msg == "success") {
                         this.$message({
                            message:'添加成功',
                            type: 'success'
                        });
                        this.addFormVisible = false;
                        this.getData(0);
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            // 编辑
            handleEdit(index, row) {
              this.editFormVisible = true;
              console.log(row);
              if(row.level=='1'){
                this.disabledA=true;
                this.disabledB=true;
              }else if(row.level=='2'){
                 this.level_1=row.level_1;
                 this.disabledA=false;
                 this.disabledB=true;
              }else if(row.level=='3'){
                  this.level_1=row.level_1;
                  this.level_2=row.level_2;
                  this.getClass(row.level_1,2,0);
                  this.disabledA=true;
                  this.disabledB=false;
              }
              if(row.is_check=='0'){
                  this.delivery=true;
              }else if(row.is_check=='1'){
                  this.delivery=false;
              }
              this.editForm=row;
            },
            // 保存编辑
            editSubmit() {
                var params={};
                if(this.level_1!=''&&this.level_2!=''){
                    params.parent_id = this.level_2;
                }
                if(this.level_1!=''&&this.level_2==''){
                   params.parent_id = this.level_1;
                }
                if(this.level_1==''&&this.level_2==''){
                    params.parent_id = 0;
                }
                if(this.delivery==true){params.is_check=0;}else{params.is_check=1;}
                params.classify_id=this.editForm.classify_id;
                params.classify_name =this.editForm.classify_name;
                params.is_look = this.editForm.is_look;
                params.sort = this.editForm.sort;
                params.remake = this.editForm.remake;
                console.log(params)
                this.$ajax.postu(urlA+'/college/articleClassify/updateArticleClassify',params).then((res) => {
                    if (res.msg == "success") {
                         this.$message({
                            message:'修改成功',
                            type: 'success'
                        });
                        this.editFormVisible = false;
                        this.getData(params.parent_id);
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
                this.idx = row.classify_id;
                this.delVisible = true;  
                if(row.level=='2'){this.delId=row.level_1}else if(row.level=='3'){this.delId=row.level_2};
                this.testData = row;
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(urlA+'/college/articleClassify/deleteArticleClassify',{classify_id:this.idx}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData(this.delId,this.testData);
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                       this.delVisible = false;
                    }
                });
            }
           
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
