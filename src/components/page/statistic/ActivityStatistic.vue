<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
               <!--<div class="handle-box">
                <el-input v-model="addactivityId" placeholder="活动编号" class="handle-input mr10"></el-input>
                <el-input v-model="name" placeholder="活动名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>-->
             <!--统计饼状图-->
          
            <el-table :data="tableData" :header-cell-style="{'background':'#eef1f6','font-size':'15px'}" style="width: 100%;" highlight-current-row>
                <el-table-column prop="name"  align="center" label="活动名称"></el-table-column>
                <el-table-column prop="addactivityId" align="center" label="活动id"> </el-table-column>
                <el-table-column  align="center" label="活动状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.activeState == '0'">开启</span>  
                        <span v-else-if="scope.row.activeState == '1'">关闭</span>  
                    </template>
                </el-table-column>
                <el-table-column prop="carTotle"  align="center" label="加购访客"></el-table-column>
                <el-table-column prop="orderTotle" align="center" label="订单访客"></el-table-column>
                <el-table-column prop="recordTotle"  align="center" label="全部访客"></el-table-column>
                <el-table-column prop="dealTotle"  align="center" label="成交访客"></el-table-column>
                <el-table-column prop="orderPrice" align="center" label="成交金额"></el-table-column>
                <el-table-column prop="carRate" align="center" label="加购转化率"></el-table-column>
                <el-table-column prop="priceRate" align="center" label="付款转化率"></el-table-column>
                <el-table-column prop="dealRate" align="center" label="成交转化率"></el-table-column>
                <el-table-column prop="startTime"   align="center" label="活动开始时间"></el-table-column>
                <el-table-column prop="endTime" align="center" label="活动结束时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  :page-size="10" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        
        
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                filter:{},
                total:0,
                totalSum:'',
                totalNum:'',
                addactivityId:'',
                name:''

            }
        },
        created() {
            this.getListData(1);
        },
        mounted(){
         
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getListData(this.cur_page);
            },
         
            getListData(arr){
                var params = {};
                params.page  =arr;
                params.limit=10;
                // if(this.addactivityId){params.addactivityId=this.addactivityId}
                // if(this.name){params.name=this.name}
                 this.$ajax.postu(url+'distributor/tstdistributoraddactivity.api?selectDistributorCount', params).then((res) => {
                    if (res.code == "200") {
                       this.tableData = res.data;
                       this.total = res.total;
                    } else {
                        this.$message({
                        message: res.description,
                        type: 'error'
                        });
                    }
                });
            },
            search() {
                this.getListData(1);
            },
            formatter(row, column) {
                return row.address;
            },
         
        }
    }

</script>

<style scoped>
    .el-table{
       border-top:1px solid #dfe6ec; 
       border-left:1px solid #dfe6ec; 
       border-right:1px solid #dfe6ec; 
    }
    .handle-box {
        margin-bottom: 20px;
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
</style>
