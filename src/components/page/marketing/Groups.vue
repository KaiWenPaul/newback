<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>拼团管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
              <div class="handle-box">
              <el-input v-model="search_form.activityConfigId" placeholder="输入活动ID" class="handle-input mr10"  @keyup.enter.native="getData"></el-input>
              <el-input v-model="search_form.goodsId" placeholder="输入商品ID" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-input v-model="search_form.goodsSku" placeholder="输入商品货号" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-input v-model="search_form.goodsName" placeholder="输入商品名称" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="search_form.startTime"></el-date-picker>
              <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" v-model="search_form.endTime"></el-date-picker>
              <el-select v-model="search_form.status" placeholder="活动状态" class="handle-select mr10" @keyup.enter.native="getData">
                     <el-option key="" label="全部" value=""></el-option>
                    <el-option key="0" label="未开始" value="0"></el-option>
                    <el-option key="1" label="活动中" value="1"></el-option>
                    <el-option key="2" label="已结束" value="2"></el-option>
                    <el-option key="3" label="已失效" value="3"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="goEditor">新建拼团</el-button>
            <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除文章</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="exportAll">批量导入文章</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">下载模板</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                     <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="configId" label="活动id" align="center"></el-table-column>
                <el-table-column prop="personNum" label="参团人数" align="center"></el-table-column>
                <el-table-column prop="buyNum" label="每人限购" align="center"></el-table-column>
                <el-table-column prop="validHour" label="成团时间" align="center"></el-table-column>
                <el-table-column label="活动状态" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.status=='0'">未开始</span>
                   <span v-if="scope.row.status=='1'">活动中</span>
                   <span v-else-if="scope.row.status=='2'">已结束</span>
                   <span v-else-if="scope.row.status=='3'">已失效</span>
                
                  </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                       <!-- <el-button v-if="scope.row.status!='0'" type="text" icon="el-icon-tickets" @click="handleEdit(scope.row)">查看</el-button>-->
                        <el-button  type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button  type="text" icon="el-icon-tickets" @click="openCopy(scope.row)">复制拼团</el-button>
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
         <!-- 拼团复制提示框 -->
        <el-dialog title="提示" :visible="copyVisible" width="300px" center>
            <div class="del-dialog-cnt">复制后会出现在列表第一行，是否继续？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="copyVisible = false">取 消</el-button>
                <el-button type="primary" :loading="copyloading" @click="copyActivity">确 定</el-button>
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
                editVisible: false,
                delVisible: false,
                listVisible:false,
                copyVisible:false,//复制拼团
                addFormVisible:false,//新增
                addForm:[],
                isView:false,//判断是否是查看和编辑
                disabled:true,
                copyloading:false,
                title:'',
                state:'',
                form: {
                },
                idx: -1,
                isAdd:false,
                exportVisible:false,
                search_form:{},
                startTime:'',
                endTime:'',
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
                filter.page  = this.cur_page;
                this.search_form.page = this.cur_page;
                if(this.search_form.activityConfigId==''){
                    this.search_form.activityConfigId = 0;
                }
                this.$ajax.postu(url+'groupBuyActivityBackendInterfaces.api?getAllGroupBuyActivityList', this.search_form).then((res) => {
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
           
            // 编辑
            handleEdit(row) {
            console.log(row)
             this.$router.push({ path: '/groups_editor',query: {id:row.configId}})
            //   this.$router.push({ name: '文章编辑',query: {id:row.article_id,str:'<p>123456789</p>'}})
            
            },
            openCopy(row){
            //   this.copyVisible = true;
            //   this.idx = row.configId
               this.$router.push({ path: '/groups_copy_editor',query: {id:row.configId}})
            },
            copyActivity(){
                this.copyloading = true;
                this.$ajax.postu(url+'groupBuyActivityBackendInterfaces.api?addCopyGroupBuyActivity',{groupBuyConfigId:this.idx}).then((res) => {
                    if (res.status == "ok") {
                       this.$message.success('复制成功');
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                     this.copyVisible = false;
                     this.copyloading = false;
                });
            },
            // 去添加和编辑拼团
           goEditor(){
               this.$router.push({ path: '/groups_editor'})
            },
            cancel(){
               this.editVisible = false;
               this.pwVisible = false;
               this.copyVisible = false;
               this.delVisible=false;
            },
            handleDelete(index, row) {
                this.idx = row.configId;
                this.delVisible = true;
                
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?deleteGroupBuyActivity',{groupBuyConfigId:this.idx}).then((res) => {
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
 
   .mr10{margin-bottom:10px;margin-right:10px;}
</style>
