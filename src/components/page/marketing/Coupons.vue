<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-input v-model="couponNo" placeholder="输入优惠券编号" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
               <!--<el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>
              <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="reload">刷新</el-button>
                -->
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
           <div class="handle-box add">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleEdit">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="优惠券id" align="center"></el-table-column>
                <el-table-column prop="couponNo" label="优惠券编号" align="center"></el-table-column>
                <el-table-column prop="couponTitle" label="优惠券标题" align="center"></el-table-column>
                <el-table-column prop="couponNumber" label="优惠券数量" align="center"></el-table-column>
                <el-table-column prop="couponPrice" label="优惠券金额" align="center"></el-table-column>
                <el-table-column prop="couponFullPrice" label="满减" align="center"></el-table-column>
                <el-table-column  label="抵扣条件" align="center">
                     <template slot-scope="scope">
                        <span v-if="scope.row.couponDeduction == '0'">所有商品</span>  
                         <span v-else-if="scope.row.couponDeduction == '1'">指定商品</span>
                        <span v-else>{{scope.row.couponDeduction}}</span>
                   </template>
                </el-table-column>
                <el-table-column prop="couponStarttime" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="couponEndtime" label="结束时间" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row,1)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-tickets" v-if="scope.row.couponDeduction=='1'" @click="goGoods(scope.row)">查看商品</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
             <!--<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>-->
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
             <el-form ref="form" :model="form" label-width="100px" style="width:600px;">
                    <el-form-item label="优惠券编号" v-if="isAdd===false">
                        <el-input v-model="form.couponNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券标题">
                        <el-input v-model="form.couponTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券内容">
                        <el-input v-model="form.couponName"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券数量">
                        <el-input v-model="form.couponNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券金额">
                        <el-input v-model="form.couponPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="满减金额">
                        <el-input v-model="form.couponFullPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="抵扣条件">
                        <el-radio v-model="form.couponDeduction" label="0">全部商品</el-radio>
                        <el-radio v-model="form.couponDeduction" label="1">指定商品</el-radio>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" format="yyyy/MM/dd HH:mm:ss" placeholder="开始时间" v-model="form.couponStarttime" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" align="center">-</el-col>
                        <el-col :span="11">
                            <el-date-picker  type="datetime" format="yyyy/MM/dd HH:mm:ss"  placeholder="结束时间" v-model="form.couponEndtime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">提交</el-button>
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
    import moment from 'moment'
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                isAdd:false,
                title:'',
                form: {
                },
                couponNo:'',
                id:'',
                idx: -1,
                userId: localStorage.getItem('account_id')
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
            reload(){
                this.getData();
            },
            //去查看产品
            goGoods(arr){
             this.$router.push({ path: '/coupon_goods',query:{id:arr.id}})
            },
            // 获取列表数据
            getData() {
                var filter = {};
                filter.page  = this.cur_page;
                filter.limit =10;
                filter.couponNo = this.couponNo;
                 
                 this.$ajax.postu(url+'havecoupon.api?selectpage',filter).then((res) => {
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
            search() {
                this.is_search = true;
            },
            handleEdit(index, row,arr) {
                this.editVisible = true;
                console.log(row)
                if(arr==1){
                   this.isAdd = false;
                   this.title ="编辑优惠券";
                   this.form={
                     couponNo:row.couponNo,
                     couponTitle:row.couponTitle,
                     couponName:row.couponName,
                     couponNumber:row.couponNumber,
                     couponPrice:row.couponPrice,
                     couponFullPrice:row.couponFullPrice,
                     couponDeduction:row.couponDeduction.toString(),
                     couponStarttime:row.couponStarttime,
                     couponEndtime:row.couponEndtime,
                     id:row.id
                   }
                }else{
                   this.isAdd = true;
                   this.title ="添加优惠券";
                   this.form ={};
                }
                
            },
            // 保存编辑
            saveEdit() {
                if(this.isAdd===false){
                    this.isAdd = false;
                    this.form.couponStarttime= moment(this.form.couponStarttime).format('YYYY/MM/DD HH:mm:ss'),
                    this.form.couponEndtime= moment(this.form.couponEndtime).format('YYYY/MM/DD HH:mm:ss'),
                    delete  this.form.couponNo;
                    this.$ajax.postu(url+'havecoupon.api?updateByPrimaryKeySelective',this.form).then((res) => {
                    if (res.status == "ok") {
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
                }else{
                    this.isAdd = true;
                    this.form.id = this.id;
                    this.$ajax.postu(url+'havecoupon.api?insert',this.form).then((res) => {
                    if (res.status == "ok") {
                       this.$message.success('添加成功');
                       this.editVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                  });
                }
            //    this.form.id= this.idx;
            //    this.form.moveImage = 
              
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
                 this.$ajax.postu(url+'havecoupon.api?deleteByPrimaryKey',{id:this.idx}).then((res) => {
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
            handleAvatarSuccess1(res, file) {
                this.moveImage = URL.createObjectURL(file.raw);
                console.log(res)
                this.form.moveImage=res.data;
            },
            handleAvatarSuccess2(res, file) {
                this.webImage = URL.createObjectURL(file.raw);
                this.form.webImage=res.data;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
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
   
</style>
