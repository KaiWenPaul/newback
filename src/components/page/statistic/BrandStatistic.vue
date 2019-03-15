<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                  <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="form.templateId" placeholder="活动编号" class="handle-input mr10"></el-input>
                <el-input v-model="form.goodsName" placeholder="商品名称" class="handle-input mr10"></el-input>
                <el-input v-model="form.goodsarray" placeholder="商品ID" class="handle-input mr10"></el-input> 
                <el-input v-model="form.brandId" placeholder="品牌ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
             <!--统计饼状图-->
            <div class="handle-box" style="width:100%;height:200px;border:1px solid #ebeef5;">
                <el-col :span="3">
                  <div  style="width:100%; height:200px;">
                   <div style="width:100%;height:40px;line-height:40px;padding-left:20px;font-size:14px;font-weight:bold;color:#909399">订单总数：{{totalNum}}</div>
                   <div style="width:100%;height:40px;line-height:40px;padding-left:20px;font-size:14px;font-weight:bold;color:#909399">订单总额：{{totalSum}}</div>
                  </div>
                 </el-col>
                <el-col :span="5">
                    <div id="chartPie" style="width:100%; height:200px;"></div>
                </el-col>
            </div>
            <el-table :data="tableData" :header-cell-style="{'background':'#eef1f6','font-size':'15px'}" style="width: 100%;" highlight-current-row  @selection-change="handleSelectionChange">
                <el-table-column prop="brandId"  align="center" label="品牌ID"></el-table-column>
                <el-table-column prop="brandName" align="center" label="品牌名称"> </el-table-column>
                <el-table-column prop="goodsId"   align="center" label="商品ID"></el-table-column>
                <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
                <el-table-column prop="goodsSku"  align="center" label="商品SKU"></el-table-column>
                <el-table-column prop="goodsNum"  align="center" label="促销量"></el-table-column>
                <el-table-column prop="totalPrice" align="center" label="销售金额"></el-table-column>

            <!-- <el-table-column prop="address" label="商品ID" :formatter="formatter">
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  :page-size="10" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
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
                form: {
                    brandId: '',
                    goodsName: '',
                    templateId: '',
                    goodsarray:''
                },
                data1:{
                    tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '50%'],
                        data: [
                    
                        ],
                        itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                        }
                    }
                    ]
            },
                idx: -1
            }
        },
        created() {
            this.getData();
            this.getListData();
        },
        mounted:function(){
         
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getListData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                 this.filter.brandId = this.form.brandId;
                 this.filter.goodsName = this.form.goodsName;
                 this.filter.templateId = this.form.templateId;
                 this.filter.goodsarray = this.form.goodsarray;
                 this.$ajax.postu(url+'distributor/activitystatistics/selectStatistics', this.filter).then((res) => {
                    if (res.description == "success") {
                        this.totalNum = res.data.total;
                        this.totalSum = res.data.totalsum;
                    for(var i=0;i<res.data.list.length;i++){
                        var obj = {};
                        obj.name = res.data.list[i].brandName;
                        obj.value = res.data.list[i].totalPrice;
                        this.data1.series[0].data.push(obj);
                    }
                     this.chartPie = echarts.init(document.getElementById('chartPie'));
                     this.chartPie.setOption(this.data1);
                } else {
                    this.$message({
                    message: res.error,
                    type: 'error'
                    });
                }
                });
            },
            getListData(){
                 this.filter.pageNum  = this.cur_page;
                 this.filter.pageSize=10;
                 this.filter.brandId = this.form.brandId;
                 this.filter.goodsName = this.form.goodsName;
                 this.filter.templateId = this.form.templateId;
                 this.filter.goodsarray = this.form.goodsarray;
                 this.$ajax.postu(url+'distributor/activitystatistics/select', this.filter).then((res) => {
                    if (res.description == "success") {
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
            search() {
                this.getListData();
                this.getData();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
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
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
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
