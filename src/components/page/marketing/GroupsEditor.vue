<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>拼团管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
              <div class="handle-box">
              <el-form ref="form" :model="form" label-width="100px" style="width:100%;">
                    <el-form-item label="开始时间">
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="form.startTime"></el-date-picker>
                        <span style="margin-left:20px;margin-right:5px;color:#606266">结束时间</span>
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="form.endTime"></el-date-picker>
                        <span style="margin-left:20px;margin-right:5px;color:#606266">成团有效时间</span>
                         <el-input v-model="form.validHour" placeholder="小时" class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item label="成团人数">
                         <el-input v-model="form.personNum" placeholder="" class="handle-input mr10"></el-input>
                        <span style="margin-left:20px;margin-right:5px;color:#606266">每人限购</span>
                         <el-input v-model="form.buyNum" placeholder="" class="handle-input mr10"></el-input>
                         <el-button type="primary" icon="search" @click="save()">保存</el-button>
                    </el-form-item>   
              </el-form>
            </div>
           <div class="handle-box add">
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="addShops">添加商品</el-button>
           </div>
            <!-- 添加产品 -->
           <div class="handle-box add">
               <el-table :data="tableData" border class="table" ref="multipleTable">
                    <el-table-column  label="商品id" align="center">
                        <template slot-scope="scope">
                            <!--<el-input v-if="configStatus=='1'||configStatus=='2'||configStatus=='3'" v-model="scope.row.goodsId" style="width:100px;" @change="handleEdit(scope.$index, scope.row)" disabled></el-input>-->
                            <el-input  v-model="scope.row.goodsId" style="width:100px;" @change="handleEdit(scope.$index, scope.row)"></el-input>
                            <el-button type="success" @click="searchs(scope.row.goodsId,scope.row,1)">搜索</el-button>
                        </template>        
                    </el-table-column>
                    <el-table-column label="商品货号" align="center">
                        <template slot-scope="scope">
                            <!--<el-input v-if="configStatus=='1'||configStatus=='2'||configStatus=='3'" v-model="scope.row.goodsId" style="width:100px;" @change="handleEdit(scope.$index, scope.row)" disabled></el-input>-->
                            <el-input  v-model="scope.row.goodsSku" style="width:100px;" @change="handleEdit(scope.$index, scope.row)"></el-input>
                            <el-button type="success" @click="searchs(scope.row.goodsSku,scope.row,2)">搜索</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsName" :show-overflow-tooltip="true" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="goodsOriginPrice" label="原价" align="center"></el-table-column>
                    <el-table-column prop="goodsNowPrice" label="促销价" align="center"></el-table-column>
                    <el-table-column  label="拼团价" align="center">
                       <template slot-scope="scope">
                            <!--<el-input v-if="configStatus=='1'||configStatus=='2'||configStatus=='3'" v-model="scope.row.groupBuyPrice" style="width:100px;" @change="handleEdit(scope.$index, scope.row)" disabled></el-input>-->
                            <el-input  v-model="scope.row.groupBuyPrice" style="width:100px;" @change="handleEdit(scope.$index, scope.row)"></el-input>
                        </template>       
                    </el-table-column>
                    <el-table-column label="操作" width="250" align="center">
                        <template slot-scope="scope">
                            <el-button  type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                         <!--<template slot-scope="scope" v-if="configStatus=='0'">
                            <el-button  type="text" icon="el-icon-delete" class="red" @click="updateGoods(scope.$index, scope.row)">更新商品</el-button>
                        </template>-->
                    </el-table-column>
                </el-table>
           </div>
           
        </div>
   
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
                addFormVisible:false,//新增
                addForm:[],
                isView:false,//判断是否是查看和编辑
                disabled:false,
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
                groupBuyActivityQo:{},
                configStatus:''
            }
        },
        created() {
            if(this.$route.query.id){
              this.getData();
            }
           
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
                filter.groupBuyConfigId  = this.$route.query.id;
                this.$ajax.postu(url+'groupBuyActivityBackendInterfaces.api?getGroupBuyActivityConfigDetail', filter).then((res) => {
                    if (res.status == "ok") {
                        this.form = res.data.config;
                        // this.tableData = res.data.goodsList;
                        this.configStatus = res.data.config.status;
                        for(var i=0;i<res.data.goodsList.length;i++){
                            res.data.goodsList[i].status =res.data.config.status;
                        }
                         this.tableData = res.data.goodsList;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
           addShops(){
             var newLine={};
             newLine.goodsSku = '';
             newLine.goodsId ='';
             newLine.goodsName ='';
             newLine.goodsOriginPrice ='';
             newLine.goodsNowPrice ='';
             newLine.groupBuyPrice ='';
             this.tableData.unshift(newLine)
           },
           searchs(arr,brr,crr){ 
                var params = {};
                if(crr==1){
                  params.goodsId = arr;
                }else{
                   params.sku = arr;  
                }
                this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?getGoodsInfo', params).then((res) => {
                    if (res.status == "ok") { 
                        brr.goodsId = res.data[0].goodsId;
                        brr.goodsName =res.data[0].goodsName; 
                        brr.goodsOriginPrice =res.data[0].goodsOriginPrice; 
                        brr.goodsNowPrice =res.data[0].goodsNowPrice; 
                        brr.goodsSku =res.data[0].goodsSku; 
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                }); 
           },
           // 行值改变
            handleEdit(index, row){
               console.log(row)
            },
            handleDelete(index, row) {
               
                if(row.status===this.configStatus){
                    var params = {};
                    params.goodsId = row.goodsId;
                    params.groupBuyConfigId = this.$route.query.id;
                    this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?deleteGroupBuyActivityGoods',params ).then((res) => {
                        if (res.status == "ok") {
                        this.$message.success('删除成功');
                        this.getData();
                        } else {
                            this.$message({
                            message: res.error,
                            type: 'error'
                            });
                        }
                    });  
                }else{
                    this.tableData.splice(index,1);
                }
            },
            save(){
                var json = {};
                this.groupBuyActivityQo.buyNum = this.form.buyNum;
                this.groupBuyActivityQo.startTime = this.form.startTime;
                this.groupBuyActivityQo.endTime = this.form.endTime;
                this.groupBuyActivityQo.personNum = this.form.personNum;
                this.groupBuyActivityQo.validHour = this.form.validHour;
                if(this.$route.query.id){
                   this.groupBuyActivityQo.activityConfigId =this.$route.query.id;
                }
                json.goodsList = this.tableData;
                json.groupBuyActivityQo = this.groupBuyActivityQo;
                if(this.$route.query.id){
                    this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?updateGroupBuyActivity', {json:JSON.stringify(json)}).then((res) => {
                        if (res.status == "ok") {
                        this.$message.success('修改成功');
                        this.$router.push({ path: '/groups'})
                        } else {
                            this.$message({
                            message: res.error,
                            type: 'error'
                            });
                        }
                    });  
                }else{
                    this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?addGroupBuyActivity', {json:JSON.stringify(json)}).then((res) => {
                        if (res.status == "ok") {
                        this.$message.success('添加成功');
                        this.$router.push({ path: '/groups'})
                        } else {
                            this.$message({
                            message: res.error,
                            type: 'error'
                            });
                        }
                    });
                }
                
            },
            // updateGoods(index, row){
            //     this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?addGroupBuyActivity', {json:JSON.stringify(json)}).then((res) => {
            //             if (res.status == "ok") {
            //             this.$message.success('添加成功');
            //             this.$router.push({ path: '/groups'})
            //             } else {
            //                 this.$message({
            //                 message: res.error,
            //                 type: 'error'
            //                 });
            //             }
            //         });
            // },
            cancel(){
               this.editVisible = false;
               this.pwVisible = false;
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
   .el-upload--text{
       width:0px !important;
       height:0px !important;
   }
   .mr10{margin-bottom:10px;margin-right:10px;}
</style>
