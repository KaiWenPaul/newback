<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-input v-model="userId	" placeholder="输入用户id" class="handle-input mr10"></el-input>
              <el-input v-model="name" placeholder="输入姓名" class="handle-input mr10"></el-input>
              <el-input v-model="corporateName" placeholder="输入公司名称" class="handle-input mr10"></el-input>
               <!--<el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>-->
              <el-select v-model="check_state" placeholder="审核状态" class="handle-select mr10">
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="审核通过" value="2"></el-option>
                    <el-option key="3" label="审核未通过" value="3"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
           <div class="handle-box add">
               <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleEdit">新增</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="distributorId" label="分销商id" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户id" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名字" align="center"></el-table-column>
                <el-table-column prop="card" label="身份证号" align="center"></el-table-column>
                <el-table-column label="性别" align="center">
                   <template slot-scope="scope">
                    <span v-if="scope.row.sex == '1'">男</span>  
                    <span v-else>女</span>
                  </template>
                </el-table-column>
                <el-table-column prop="corporateName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="companyAddress" label="公司地址" align="center"></el-table-column>
                <el-table-column label="审核状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.audit == '1'">审核中</span> <span v-else-if="scope.row.audit == '2'">审核通过</span><span v-else>审核未通过</span>  
                  </template>
                </el-table-column>
                <el-table-column prop="timeCreated" label="提交时间" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="handleEdit(scope.$index,scope.row)">查看</el-button>
                       
                         <!--<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
        <el-dialog :title="title" :visible.sync="editVisible" width="50%">
             <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="分销商id"><el-input style="width:200px;" v-model="form.distributorId" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="用户id"><el-input style="width:200px;" v-model="form.userId" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="名字"><el-input style="width:200px;" v-model="form.name" :disabled="disabled"></el-input></el-form-item>
                    <el-form-item label="身份证号"><el-input style="width:200px;" v-model="form.card" :disabled="disabled"></el-input></el-form-item>
                    <el-form-item label="性别">
                        <el-radio :disabled="disabled" v-model="sex" label="1">男</el-radio>
                        <el-radio :disabled="disabled" v-model="sex" label="2">女</el-radio>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="state" placeholder="选择状态" :disabled="false" class="handle-select mr10">
                            <el-option key="1" label="审核中" value="1"></el-option>
                            <el-option key="2" label="审核通过" value="2"></el-option>
                            <el-option key="3" label="审核未通过" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核意见"><el-input style="width:500px;" v-model="form.auditCount" :disabled="false"></el-input></el-form-item>
                    <el-form-item label="公司名称"><el-input style="width:200px;" v-model="form.corporateName" :disabled="disabled"></el-input></el-form-item>
                    <el-form-item label="公司地址"><el-input style="width:500px;" v-model="form.companyAddress" :disabled="disabled"></el-input></el-form-item>
                    <el-form-item label="营业执照">
                        <img  :src="form.businessLicense1" alt="" style="width: 80px;height: 80px;border:1px solid red;">
                        <img  :src="form.businessLicense2" alt="" style="width: 80px;height: 80px">
                        <img  :src="form.businessLicense3" alt="" style="width: 80px;height: 80px">
                    </el-form-item>

                    <el-form-item v-if="isAdd===false" label="提交时间"><el-input style="width:200px;" v-model="form.timeCreated" :disabled="true"></el-input></el-form-item>
                  
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
              <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>-->
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
                isView:false,//判断是否是查看和编辑
                moveImage1:'',//企业执照
                moveImage2:'',//企业执照
                moveImage3:'',//企业执照
                name:'',
                userId:'',
                corporateName:'',
                shopId:'',
                disabled:true,
                title:'',
                sex:'1',
                state:'',
                form: {
                },
                idx: -1,
                isAdd:false
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
            // 获取 easy-mock 的模拟数据
            getData() {
                var filter = {};
                filter.pageNum  = this.cur_page;
                filter.pageSize =10;
                if(this.name!=''){ filter.name = this.name;}
                if(this.corporateName!=''){  filter.corporateName = this.corporateName;}
                if(this.userId!=''){  filter.userId = this.userId;}
                if(this.check_state!=''){filter.audit = this.check_state;}
                this.$ajax.postu(urlB+'yzb/distributor/listShopPage', filter).then((res) => {
                    if (res.msg == "success") {
                       this.tableData = res.data.list;
                       this.total = res.data.total;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
            // 编辑
            handleEdit(index, row) {
                this.editVisible = true;
                const item = this.tableData[index];
                this.form =item;
                this.sex = item.sex.toString();
                this.state = item.audit===1?'审核中':item.audit===2?'审核通过':'审核未通过';
            },
            // 保存编辑
            saveEdit() {
               
                    this.form.sex=this.sex;
                    if(this.state==='审核中'){
                        this.form.audit = 1;
                    }else if(this.state==='审核通过'){
                        this.form.audit = 2;
                    }else if(this.state==='审核未通过'){
                        this.form.audit = 3;
                    }

                   this.$ajax.postu(urlB+'yzb/distributor/update',{distributorId:this.form.distributorId,audit:this.form.audit,auditCount:this.form.auditCount}).then((res) => {
                    if (res.msg == "success") {
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
            cancel(){
               this.editVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(url+'distributor/tstdistributoraddactivity/delete',{id:this.idx}).then((res) => {
                    if (res.description == "success") {
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
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
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
