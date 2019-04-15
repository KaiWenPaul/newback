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
                <el-table-column prop="id" label="角色id" align="center"></el-table-column>
                <el-table-column prop="description" label="角色中文" align="center"></el-table-column>
                <el-table-column prop="role" label="角色英文" align="center"></el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="OpenPermission(scope.$index,scope.row)">查看权限</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="handleEdit(scope.$index,scope.row,1)">编辑</el-button>
                       
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
                    <el-form-item label="角色中文"><el-input style="width:210px;" v-model="form.description"></el-input></el-form-item>
                    <el-form-item label="角色英文"><el-input style="width:210px;" v-model="form.role"></el-input></el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
         <!-- 查看修改权限 -->
        <el-dialog :title="title" :visible="PermissionVisible" width="50%">
           
           
            <ul id="leftTree" class="ztree"></ul>
            <span slot="footer" class="dialog-footer">
                <el-button @click="PermissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePermission">确 定</el-button>
            </span>
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
                PermissionVisible:false,
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
                newDatas:[],
                perId:-1,
                setting:{
                     check:{
                            enable:true
                        },
                        view: {
                            showLine: true,//显示节点之间的连线。
                            selectedMulti: false  //允许同时选中多个节点。
                        },
                        data: {
                            simpleData: {
                                enable:true, //使用简单数据模式
                                idKey: "id",//节点数据中保存唯一标识的属性名称
                                pIdKey: "pId",//节点数据中保存其父节点唯一标识的属性名称
                                rootpId: "" //用于修正根节点父节点数据 默认值：null
                            }
                        } ,
                        callback:{
                        	onCheck:this.onCheck
                        }
                },
                nodes:[
                    // {id :"1",pId:"0",name :"山西省"},
                    // {id :"2",pId:"0",name : "河北省"},
                    // {id :"3",pId:"0",name : "内蒙省"},
                    // {id :"4",pId:"0",name : "吉林省"},
                    // {id :"11",pId:"1",name: "大同市"},
                    // {id :"12",pId:"1",name: "朔州市"},
                    // {id :"21",pId:"2",name: "石家庄"},
                    // {id :"22",pId:"2",name: "唐山市"},
                    // {id :"31",pId:"3",name: "赤峰市"},
                    // {id :"32",pId:"3",name: "呼市"},
                    // {id :"41",pId:"4",name: "长春市"},
                    // {id :"42",pId:"4",name: "四平市"},
                    // {id :"43",pId:"4",name: "辽源市"},
                ]
            }
        },
        created() {
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
                filter.pageNum  = this.cur_page;
                filter.pageSize =10;
                this.$ajax.postu('http://47.99.133.23:8081/role/listRolePage', filter).then((res) => {
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
            // 编辑
            handleEdit(index, row,arr) {
              this.editVisible = true;
              if(arr===1){
                 this.isAdd=true;
                 const item = this.tableData[index];
                 this.form =item;
                 this.title = '编辑账号';
              }else{
                 this.title = '添加账号';
                 this.isAdd=false;
                 this.roleValue='';
                 this.form = {
                     description:'',
                     role:'',
                 }
              }
            },
            // 保存编辑
            saveEdit() {
                   if(this.isAdd===false){
                     this.$ajax.postu('http://47.99.133.23:8081/role/addRole',this.form).then((res) => {
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
                    params.id = this.form.id;
                    params.description = this.form.description;
                    params.role = this.form.role;
                    this.$ajax.postu('http://47.99.133.23:8081/role/updateRole',params).then((res) => {
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
            cancel(){
               this.editVisible = false;
               this.PermissionVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
                
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu('http://47.99.133.23:8081/role/deleteRole',{id:this.idx}).then((res) => {
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
                this.delVisible = false;
            },
            // 查看权限
            OpenPermission(index, row){
                this.PermissionVisible = true;
                this.perId =row.id;
                this.$nextTick(function () { 
                this.$ajax.postu('http://47.99.133.23:8081/sys/getTreePermission',{role_id:row.id}).then((res) => {
                    if (res.msg == "success") {
                        this.nodes = res.data;
                        var tree  = $.fn.zTree.init($('#leftTree'),this.setting, this.nodes);
                        tree.expandAll(tree);
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                    });
                })
                
            },
            onCheck(e,treeId,treeNode){
              var treeObj = $.fn.zTree.getZTreeObj('leftTree');
              var node = treeObj.getNodes();
              var nodes = treeObj.transformToArray(node);//ztree官方，获取所有节点数据
              this.newDatas =nodes;
            },
            savePermission(){
              this.$ajax.postu('http://47.99.133.23:8081/sys/updatePermission',{role_id:this.perId,json:JSON.stringify(this.newDatas)}).then((res) => {
                    if (res.msg == "success") {
                        this.$message.success('修改权限成功');
                        this.PermissionVisible = false;
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
