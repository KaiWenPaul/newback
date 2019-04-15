<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>拼团管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
              <div class="handle-box">
              <el-input v-model="member_account" placeholder="输入用户账号" class="handle-input mr10"  @keyup.enter.native="getData(1)"></el-input>
              <el-input v-model="receive_mobile" placeholder="输入领取手机号" class="handle-input mr10" @keyup.enter.native="getData(1)"></el-input>
              <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="注册开始时间" v-model="startTime"></el-date-picker>
              <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="注册结束时间" v-model="endTime"></el-date-picker>
              <el-select v-model="member_level" placeholder="用户档位" class="handle-select mr10" @keyup.enter.native="getData(1)">
                    <el-option key="0" label="普通用户" value="0"></el-option>
                    <el-option key="1" label="分销商" value="1"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData(1)">搜索</el-button>
            </div>
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="openUpdate">批量更新领奖状态</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="member_id" label="用户id" align="center"></el-table-column>
                <el-table-column prop="member_account" label="用户账号" align="center"></el-table-column>
                <el-table-column  label="用户档位" align="center">
                   <template slot-scope="scope">
                   <span v-if="scope.row.member_level=='0'">普通用户</span>
                   <span v-if="scope.row.member_level=='1'">分销商</span>
                  </template>
                </el-table-column> 
                <el-table-column prop="teacher_name" label="导师姓名" align="center"></el-table-column>
                <el-table-column prop="project_team_name" label="项目组名称" align="center"></el-table-column>
                <el-table-column prop="research_direction" label="研究方向" align="center"></el-table-column>
                <el-table-column prop="company_name" label="单位名称" align="center"></el-table-column>
                <el-table-column prop="receive_mobile" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="shipping_address_detail" label="收货地址" align="center"></el-table-column>
                <el-table-column label="获奖状态" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.obtain_prize_status=='0'">未领取</span>
                   <span v-if="scope.row.obtain_prize_status=='1'">已领取</span>
                  </template>
                </el-table-column>
                 <el-table-column label="奖品发放状态" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.gran=='0'">未发放</span>
                   <span v-if="scope.row.gran=='1'">已发放</span>
                  </template>
                </el-table-column>
                <el-table-column prop="register_time" label="注册时间" align="center"></el-table-column>
                  <!-- <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button  type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button  type="text" icon="el-icon-tickets" @click="openCopy(scope.row)">复制拼团</el-button>
                    </template>
                </el-table-column>>-->
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
        <!-- 删除提示框 -->
        <el-dialog title="批量更新领奖状态" :visible="openVisible">
            <el-form  label-width="100px" ref="editForm">
            <el-form-item label="领奖状态">
              <el-select v-model="gran" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
               </el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateReward">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
       components: {UE},
        data() {
            return {
               
                tableData: [],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                check_state: '',
                del_list: [],
                is_search: false,
                disabled:true,
                form: {
                },
                options:[{label:'未发放',value:"0"},{label:'已发放',value:"1"}],
                gran:'',
                idx: -1,
                member_account:'',
                endTime:'',
                startTime:'',
                member_level:'',
                receive_mobile:'',
                openVisible:false

            }
        },
        created() {
            this.getData(1);
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(this.cur_page);
            },
            // 获取列表数据
            getData(arr) {
                var filter = {};
                filter.page  = arr;
                filter.limit = 10;
                filter.receive_mobile = this.receive_mobile;
                filter.member_account = this.member_account;
                filter.startTime = this.startTime;
                filter.endTime = this.endTime;
                if(this.member_level!=''){
                    filter.member_level = this.member_level;
                }
                filter.merchants_account_id1 =  localStorage.getItem('account_id');
                filter.merchants_token =  localStorage.getItem('token');
                this.$ajax.postu(url+'registerRewardActivityInterfaces.api?getUserInformation',filter).then((res) => {
                    if (res.status == "ok") {
                       this.tableData = res.data;
                       this.total = res.total;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
          
            cancel(){
               this.openVisible = false;
            },
            openUpdate(){
             this.openVisible = true;
            },
            // 批量更新领奖状态
            updateReward() {
                const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].member_id+',';
                }
               var strs = str.substring(0,str.length-1);
               this.$ajax.postu(url+'registerRewardActivityInterfaces.api?listupdate',{id:strs,gran:this.gran}).then((res) => {
                    if (res.status == "ok") {
                       this.$message.success('批量更新成功');
                       this.openVisible = false;
                       this.getData(1);
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
  
   .mr10{margin-bottom:10px;margin-right:10px;}
</style>
