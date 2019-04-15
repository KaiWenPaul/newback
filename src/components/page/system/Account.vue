<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
              <!--<div class="handle-box">
              <el-input v-model="userId	" placeholder="输入用户id" class="handle-input mr10"></el-input>
              <el-input v-model="name" placeholder="输入姓名" class="handle-input mr10"></el-input>
              <el-input v-model="corporateName" placeholder="输入公司名称" class="handle-input mr10"></el-input>
              <el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>
              <el-select v-model="check_state" placeholder="审核状态" class="handle-select mr10">
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="审核通过" value="2"></el-option>
                    <el-option key="3" label="审核未通过" value="3"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>-->
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="handleEdit">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="account_id" label="账号id" align="center"></el-table-column>
                <el-table-column prop="username" label="账号" align="center"></el-table-column>
                <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
                <el-table-column prop="role_id" label="角色" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column label="头像" align="center">
                  <template slot-scope="scope">
                    <img  :src="scope.row.img" alt="" style="width: 50px;height: 50px">
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="handleEdit(scope.$index,scope.row,1)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="changePwd(scope.$index,scope.row)">修改密码</el-button>
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
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible="editVisible" width="50%">
             <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="账号"><el-input style="width:210px;" v-model="form.username" :disabled="isAdd"></el-input></el-form-item>
                    <el-form-item label="密码" v-if="isAdd===false"><el-input style="width:210px;" type="password" v-model="form.password"></el-input></el-form-item>
                    <el-form-item label="昵称"><el-input style="width:210px;" type="nickname" v-model="form.nickname"></el-input></el-form-item>
                    <el-form-item label="手机号"><el-input style="width:210px;" type="phone" v-model="form.phone"></el-input></el-form-item>
                    <el-form-item label="角色">
                      <el-select v-model="roleValue" placeholder="请选择">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.description"
                        :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
         <!-- 修改密码 -->
        <el-dialog :title="title" :visible="pwVisible" width="50%">
             <el-form ref="form"label-width="100px">
                    <el-form-item label="新密码"><el-input style="width:200px;" type="password" v-model="password"></el-input></el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="savePwd">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible="delVisible" width="300px" center>
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
                url: './static/vuetable.json',
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
                pwVisible:false,
                isView:false,//判断是否是查看和编辑
                disabled:true,
                title:'',
                state:'',
                form: {
                },
                idx: -1,
                isAdd:false,
                roleList:[],
                roleValue:'',
                password:'',
                pwd_id:-1,
            }
        },
        created() {
            this.getData();
            this.getRole();
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
                filter.pageNum  = this.cur_page;
                filter.pageSize =10;
                this.$ajax.postu('http://47.99.133.23:8081/account/listAccountInfoPage', filter).then((res) => {
                    if (res.msg == "success") {
                       this.tableData = res.data.list;
                       this.total = res.data.total;
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            // 获取角色列表
            getRole(){
              var filter = {};
              filter.pageNum  = this.cur_page;
              filter.pageSize =50;
              this.$ajax.postu('http://47.99.133.23:8081/role/listRolePage', filter).then((res) => {
                    if (res.msg == "success") {
                       this.roleList = res.data.list;
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            // 编辑
            handleEdit(index, row,arr) {
              this.editVisible = true;
              if(arr===1){
                 this.isAdd=true;
                 const item = this.tableData[index];
                 this.form =item;
                 this.title = '编辑账号';
                 this.roleValue = item.role_id;
              }else{
                 this.title = '添加账号';
                 this.isAdd=false;
                 this.roleValue='';
                 this.form = {
                     username:'',
                     nickname:'',
                     password:'',
                     phone:'',
                     role_id:''
                 }
              }
            },
            // 保存编辑
            saveEdit() {
                   if(this.isAdd===false){
                     this.form.role_id = this.roleValue;
                     this.$ajax.postu('http://47.99.133.23:8081/account/addAccountInfo',this.form).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('添加成功');
                        this.editVisible = false;
                        this.getData();
                        } else {
                            this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                        }
                    });
                   }else{
                    var params = {};
                    params.account_id = this.form.account_id;
                    params.role_id = this.roleValue;
                    params.nickname = this.form.nickname;
                    params.phone = this.form.phone;
                    this.$ajax.postu('http://47.99.133.23:8081/account/updateAccountInfo',params).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.getData();
                        } else {
                            this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                        }
                    });
                   }
                
               
            },
            //修改密码
            changePwd(index,row){
              this.pwd_id = row.account_id;
              this.pwVisible = true;
              this.password='';
            },
            savePwd(){
              this.$ajax.postu('http://47.99.133.23:8081/account/updatePassword',{account_id:this.pwd_id,password:this.password}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('修改成功');
                       this.pwVisible = false;
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
               this.editVisible = false;
               this.pwVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.account_id;
                this.delVisible = true;
                
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu('http://47.99.133.23:8081/account/deleteAccountInfo',{account_id:this.idx}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
