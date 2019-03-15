<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--<div class="handle-box">
              <el-input v-model="typeId	" placeholder="输入标签id" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>-->
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="handleEdit">新增标签</el-button>
            </div>
            <el-table :data="typeList" border class="table" style="width:100%;" :row-class-name="tableRowClassName" ref="multipleTable" @selection-change="handleSelectionChange" >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="标签id" align="center"></el-table-column>
                <el-table-column prop="name" label="标签名" align="center"></el-table-column>
                <el-table-column label="类型" align="center">
                   <template slot-scope="scope">
                        <span v-if="scope.row.type == '0'">满减</span>  
                        <span v-else-if="scope.row.type == '1'">折扣</span>
                        <span v-else-if="scope.row.type == '2'">满赠</span>
                        <span v-else>{{scope.row.type}}</span>
                   </template>
                </el-table-column>
                <el-table-column prop="couponPrice" label="优惠金额" align="center"></el-table-column>
                <el-table-column prop="couponFullPrice" label="满减" align="center"></el-table-column>
                <el-table-column prop="discount" label="折扣" align="center"></el-table-column>
                <el-table-column prop="fullGift" label="满赠" align="center"></el-table-column>
                <el-table-column prop="restrictionQuantity" label="限购" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="handleEdit(scope.$index,scope.row,1)">查看</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="50%">
             <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="标签名"><el-input style="width:210px;" v-model="form.name"></el-input></el-form-item>
                    <el-form-item label="类型">
                      <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                        v-for="item in labelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.type=='0'" label="优惠金额"><el-input style="width:210px;" v-model="form.couponPrice"></el-input></el-form-item>
                    <el-form-item v-if="form.type=='0'" label="优惠满多少"><el-input style="width:210px;" v-model="form.couponFullPrice"></el-input></el-form-item>
                    <el-form-item v-if="form.type=='1'" label="整单折扣"><el-input style="width:210px;" v-model="form.discount"></el-input></el-form-item>
                    <el-form-item v-if="form.type=='2'" label="满赠金额"><el-input style="width:210px;" v-model="form.fullGift"></el-input></el-form-item>
                    <el-form-item  label="限购"><el-input style="width:210px;" v-model="form.restrictionQuantity"></el-input></el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
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
                disabled:true,
                title:'',
                state:'',
                form: {
                },
                labelList:[{id:'0',name:'满多少减多少'},{id:'1',name:'打多少折'}, {id:'2',name:'满赠'}],
                idx: -1,
                isAdd:false,
                typeList:[],
                id:-1,
                typeId:''//搜索id
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
                this.$ajax.postu(url+'distributor/distributortype.api?selectlist', filter).then((res) => {
                    if (res.description == "success") {
                       this.typeList = res.data;
                    } else {
                        this.$message({
                        message: res.description,
                        type: 'error'
                        });
                    }
                });
            },
           tableRowClassName({row}) {
                if (row.type=='0') {
                    return 'warning-row';
                } else if(row.type=='1'){
                    return 'blue-row';
                }else if (row.type == '2') {
                    return 'success-row';
                }
                return '';
            },
            // 编辑
            handleEdit(index, row,arr) {
              this.editVisible = true;
              if(arr===1){
                 this.isAdd=true;
                 const item = this.typeList[index];
                 this.form =item;
                 this.title = '编辑标签';
                 this.id = item.id;
              }else{
                 this.title = '添加标签';
                 this.isAdd=false;
                 this.roleValue='';
                 this.form = {
                     name:'',
                     couponPrice:'',
                     couponFullPrice:'',
                     discount:'',
                     fullGift:'',
                     restrictionQuantity:'',
                     type:''
                 }
              }
            },
            // 保存编辑
            saveEdit() {
                   if(this.isAdd===false){
                     this.$ajax.postu(url+'/distributor/distributortype/insert',this.form).then((res) => {
                        if (res.description == "success") {
                        this.$message.success('添加成功');
                        this.editVisible = false;
                        this.getData();
                        } else {
                            this.$message({
                            message: res.description,
                            type: 'error'
                            });
                        }
                    });
                   }else{
                    var params = {};
                    params.id = this.id;
                    params.name = this.form.name;
                    params.type=this.form.type;
                    if(this.form.type=='0'){
                       params.couponPrice = this.form.couponPrice;
                       params.couponFullPrice = this.form.couponFullPrice;
                       params.discount = '';
                       params.fullGift = '';
                    }else if(this.form.type=='1'){
                       params.couponPrice = '';
                       params.couponFullPrice = '';
                       params.discount = this.form.discount;
                       params.fullGift = '';
                    }else if(this.form.type=='2'){
                       params.couponPrice = '';
                       params.couponFullPrice = '';
                       params.discount ='';
                       params.fullGift = this.form.fullGift;
                    }
                    params.restrictionQuantity = this.form.restrictionQuantity;
                    console.log(params)
                    this.$ajax.postu(url+'distributor/distributortype/update',params).then((res) => {
                        if (res.description == "success") {
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.getData();
                        } else {
                            this.$message({
                            message: res.description,
                            type: 'error'
                            });
                        }
                    });
                   }    
            },
            cancel(){
               this.editVisible = false;
               this.pwVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
                
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(url+'/distributor/distributortype/delete',{id:this.idx}).then((res) => {
                    if (res.description == "success") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.description,
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
<style>
 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
 .el-table .blue-row {
    background: #E6A23C;
  }
</style>
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
   .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
