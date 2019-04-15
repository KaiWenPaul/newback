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
              <el-input v-model="phone" placeholder="输入电话" class="handle-input mr10"></el-input>
              <el-input v-model="name" placeholder="输入店铺名字" class="handle-input mr10"></el-input>
               <!--<el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>
              <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
           <div class="handle-box add">
               <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="handleEdit">新增</el-button>-->
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="shopId" label="店铺id" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户id" align="center"></el-table-column>
                <el-table-column prop="name" label="店铺名字" align="center"></el-table-column>
                <el-table-column prop="phone" label="店铺签名" align="center"></el-table-column>
                <el-table-column prop="address" label="店铺地址" align="center"></el-table-column>
                <el-table-column prop="phoneNumber" label="店铺电话" align="center"></el-table-column>
                <el-table-column prop="wechatNumber" label="店铺微信" align="center"></el-table-column>
                <el-table-column label="logo" align="center">
                  <template slot-scope="scope">
                    <img  :src="scope.row.logo" alt="" style="width: 50px;height: 50px">
                  </template>
                </el-table-column>
                <el-table-column prop="timeCreated" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="view(scope.$index,scope.row,1)">查看</el-button>
                        <!-- <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
       <!-- 查看弹出框 -->
        <el-dialog title="查看详情" :visible="listVisible" width="50%">
             <el-form ref="form" :model="form" label-width="100px" style="width:600px;">
                    <el-form-item label="店铺id"><el-input v-model="form.shopId" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="用户id"><el-input v-model="form.userId" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺名字"><el-input v-model="form.name" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺手机"><el-input v-model="form.phone" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺地址"><el-input v-model="form.address" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺电话"><el-input v-model="form.phoneNumber" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺微信"><el-input v-model="form.wechatNumber" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="店铺logo"><img  :src="form.logo" alt="" style="width: 50px;height: 50px"></el-form-item>
                </el-form>
        </el-dialog>
      
        <!-- 编辑弹出框 -->
        <el-dialog title="活动编辑" :visible="editVisible" width="50%">
             <el-form ref="form" :model="form" label-width="100px" style="width:600px;">
                    <el-form-item label="店铺id" v-if="isAdd===false"><el-input v-model="form1.shopId" :disabled="true"></el-input></el-form-item>
                    <el-form-item label="用户id"><el-input :disabled="true" v-model="form1.userId"></el-input></el-form-item>
                    <el-form-item label="名字"><el-input v-model="form1.name"></el-input></el-form-item>
                    <el-form-item label="手机"><el-input v-model="form1.phone"></el-input></el-form-item>
                    <el-form-item label="地址"><el-input v-model="form1.address"></el-input></el-form-item>
                    <el-form-item label="电话"><el-input v-model="form1.phoneNumber"></el-input></el-form-item>
                    <el-form-item label="微信"><el-input v-model="form1.wechatNumber"></el-input></el-form-item>
                    <el-form-item label="logo">
                        <el-upload
                            class="avatar-uploader"
                            action="http://47.99.133.23:10300/distributor/uploadimg/fileUpload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="moveImage" :src="moveImage" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="维度"><el-input v-model="form1.lat"></el-input></el-form-item>
                    <el-form-item label="经度"><el-input v-model="form1.lon"></el-input> </el-form-item>
                  
                 
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
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                listVisible:false,
                moveImage:'',//logo
                name:'',
                userId:'',
                phone:'',
                shopId:'',
                form: {
                    shopId: '',
                    userId:'',
                    name:'',
                    phone:'',
                    address:'',
                    phoneNumber:'',
                    wechatNumber:'', 
                    logo:'',
                    lat:'',
                    lon:'',
                },
                form1: {
                    shopId: '',
                    userId:'',
                    name:'',
                    phone:'',
                    address:'',
                    phoneNumber:'',
                    wechatNumber:'', 
                    logo:'',
                    lat:'',
                    lon:'',
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
                filter.userId = this.userId;
                filter.phone = this.phone;
                filter.name = this.name;
                this.$ajax.postu(urlB+'yzb/shop/listShopPage', filter).then((res) => {
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
            //查看
            view(index, row){
              this.listVisible = true;
              const item = this.tableData[index];
              this.form={
                    shopId: item.shopId,
                    userId:item.userId,
                    name:item.name,
                    phone:item.phone,
                    address:item.address,
                    phoneNumber:item.phoneNumber,
                    wechatNumber:item.wechatNumber, 
                    logo:item.logo,
                }
            },
            // 编辑
            handleEdit(index, row) {
                this.editVisible = true;
                if(row){
                const item = this.tableData[index];
                this.isAdd =false;
                this.moveImage='http://47.99.133.23:10400/'+item.logo;
                this.form1 = {
                    shopId: item.shopId,
                    userId:item.userId,
                    name:item.name,
                    phone:item.phone,
                    address:item.address,
                    phoneNumber:item.phoneNumber,
                    wechatNumber:item.wechatNumber, 
                    lat:item.lat,
                    lon:item.lon,
                }
                }else{
                   this.isAdd =true;
                   this.moveImage ='';
                   this.form1 = {
                    userId:'',
                    name:'',
                    phone:'',
                    address:'',
                    phoneNumber:'',
                    wechatNumber:'', 
                    logo:'',
                    lat:'',
                    lon:'',
                }
                }
            },
            // 保存编辑
            saveEdit() {
                if(this.isAdd===false){
                   this.form1.logo=this.moveImage;
                   this.$ajax.postu(urlB+'yzb/shop/update',this.form1).then((res) => {
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
                }else if(this.isAdd===true){
                   this.form1.logo=this.moveImage;
                   this.$ajax.postu(urlB+'yzb/shop/insert',this.form1).then((res) => {
                    if (res.msg == "success") {
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
            handleAvatarSuccess(res, file) {
                this.moveImage = URL.createObjectURL(file.raw);
                console.log(res)
                this.form.moveImage=res.data;
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
   
</style>
