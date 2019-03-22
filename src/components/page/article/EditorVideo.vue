<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>视频编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">      
     <!-- 新增文章-->
            <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item label="视频标题">
                <el-input v-model="addForm.title" auto-complete="off" placeholder="1-10个字"></el-input>
            </el-form-item>
            <el-form-item label="视频分类">
              <el-select v-model="level_1" @change="getClass($event,2)" placeholder="请选择">
                <el-option
                v-for="item in optionsA"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
               <el-select v-model="level_2" placeholder="请选择">
                <el-option
                v-for="item in optionsB"
                :key="item.classify_id"
                :label="item.classify_name"
                :value="item.classify_id">
               </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="addForm.author" placeholder="" style="width:230px;"></el-input>
                <span style="margin-left:42px;margin-right:5px;color:#606266">版权</span>
                <el-input v-model="addForm.copyright" placeholder="" style="width:230px;"></el-input>
            </el-form-item>
             <el-form-item label="标签">
                <el-input v-model="addForm.label" style="width:260px;"></el-input>
            </el-form-item>
           <el-form-item label="权重">
                <el-input v-model="addForm.sort" placeholder="大于等于0的整数，不写默认排在最前面" style="width:260px;"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-col :span="5">
                  <el-switch v-model="delivery"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="可见范围">
              <el-select v-model="addForm.is_look" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
               </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="是否允许下载">
                <el-radio v-model="addForm.is_pay" label="-1">不可下载</el-radio>
                <el-radio v-model="addForm.is_pay" label="1">付费下载</el-radio>
                <el-input v-model="addForm.integral" auto-complete="off" style="width:100px;"></el-input>
                <el-select v-model="addForm.pay_method" placeholder="选择" class="handle-select mr10" style="width:80px;">
                   <el-option
                    v-for="item in pay_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                   </el-option>
                </el-select>
                <el-radio v-model="addForm.is_pay" label="0">免费下载</el-radio>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="Submit">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
            </el-form>
          
       </div>
    </div>
</template>

<script>
// import UE from '../../common/Idtor.vue';
    export default {
        name: 'basetable',
        components: {UE},
        data() {
            return {
                addForm:{},
                disabled:true,
                title:'',
                form: {
                },
                id:this.$route.query.id,
                idx: -1,
                isAdd:false,
                delivery:false,
                level_1:'',
                level_2:'',
                options:[{value:1,label:"全平台"},{value:2,label:"登录用户"},{value:3,label:"会员"}],
                pay_options:[{value:0,label:"积分"},{value:1,label:"人民币"}],
                optionsA:[],
                optionsB:[],
            }
        },
        created() {
            this.getClass(0,1);
            if(this.$route.query.id){
              this.getDetail();
            }
        },
        mounted(){
        },
        methods: {
            // 获取视频详情
            getDetail() {
                var filter = {};
                filter.video_id = this.id;
                this.$ajax.postu(urlA+'video/video/getVideo', filter).then((res) => {
                    if (res.code == "200") {
                        this.detailDatas = res.data;
                        this.addForm =  res.data;
                       if(this.detailDatas.level_1!='0'){
                           this.getClass(this.detailDatas.level_1,2);
                           this.level_1 =  this.detailDatas.level_1;
                           this.level_2 = this.detailDatas.classify_id;
                       }
                       if(this.detailDatas.level_2!='0'){
                           this.level_2 = this.detailDatas.level_2;
                       }
                       this.addForm.is_pay =  this.detailDatas.is_pay.toString();
                       if(this.detailDatas.is_check=='0'){
                         this.delivery = true;
                       }else{
                         this.delivery = false;
                       } 
                       
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            // 获取分类
            getClass(arr,brr) {
                var filter = {};
                filter.parent_id =arr;
                this.$ajax.postu(urlA+'/video/videoClassify/getVideoClassify ', filter).then((res) => {
                    if (res.msg == "success") {
                        if(brr=='1'){
                          this.optionsA = res.data;
                          this.optionsB = [];
                        }else if(brr=='2'){
                          this.optionsB = res.data;
                        }
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            Submit(){
               
                if(this.$route.query.id){
                     var params = {};
                    if(this.level_1!=''&&this.level_2!=''){params.classify_id = this.level_2;}
                    if(this.level_1!=''&&this.level_2==''){params.classify_id = this.level_1;}
                    if(this.level_1==''&&this.level_2==''){params.classify_id = 0;}
                    if(this.delivery=true){params.is_check=0;}else{params.is_check=1;}
                    params.video_id = this.addForm.video_id;
                    params.title = this.addForm.title;
                    params.author = this.addForm.author;
                    params.label = this.addForm.label;
                    params.copyright = this.addForm.copyright;
                    params.sort = this.addForm.sort;
                    params.is_look = this.addForm.is_look;
                    params.is_pay = this.addForm.is_pay;
                    params.integral = this.addForm.integral;
                    params.pay_method = this.addForm.pay_method;
                    this.$ajax.postu(urlA+'video/video/updateVideo',params).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('更新成功');
                        this.$router.push({ path: '/video'});
                        } else {
                            this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                        }
                    });
                }else{
                    if(this.level_1!=''&&this.level_2!=''){this.addForm.classify_id = this.level_2;}
                    if(this.level_1!=''&&this.level_2==''){this.addForm.classify_id = this.level_1;}
                    if(this.level_1==''&&this.level_2==''){this.addForm.classify_id = 0;}
                    if(this.delivery=true){this.addForm.is_check=0;}else{this.addForm.is_check=1;}
                   this.$ajax.postu(urlA+'/video/video/saveVideo',this.addForm).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('添加成功');
                        this.$router.push({ path: '/video'});
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
               this.pwVisible = false;
            },
            
        },

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
