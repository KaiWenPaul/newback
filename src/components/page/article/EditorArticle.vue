<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>文章编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">      
     <!-- 新增文章-->
            <el-form :model="addForm" label-width="100px" ref="addForm">
            <el-form-item label="文章标题">
                <el-input v-model="addForm.title" auto-complete="off" placeholder="1-10个字"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
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
                <span style="margin-left:42px;margin-right:5px;color:#606266">机构</span>
                <el-input v-model="addForm.company" placeholder="" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="addForm.project_name" placeholder="" style="width:230px;"></el-input>
                <span style="margin-left:15px;margin-right:5px;color:#606266">项目编号</span>
                <el-input v-model="addForm.project_number" placeholder="" style="width:230px;"></el-input>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="addForm.keywords" auto-complete="off" style="width:545px;"></el-input>
            </el-form-item>
           <el-form-item label="权重">
                <el-input v-model="addForm.sort" placeholder="大于等于0的整数，不写默认排在最前面" style="width:260px;"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-col :span="5">
                  <!--<el-switch 
                   active-value="0"
                   inactive-value="1"
                  @change="handleSwitch"
                  v-model="delivery"></el-switch>-->
                   <el-switch
                    v-model="addForm.is_check"
                    active-value="0"
                    inactive-value="1">
                </el-switch>
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
            <el-form-item label="封面图片">
                        <el-upload
                        class="avatar-uploader"
                        :action="loadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="image" :src="image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <!--<div class="editor-container">
                    <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
                 </div>-->
                  <div style="width:1000px;">
                    <script id="editor" type="text/plain"></script>
                  </div>
            </el-form-item> 
            <el-form-item>
                <el-button type="primary" @click="Submit">提交</el-button>
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
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                tableData: [],
                addForm:{},
                disabled:true,
                title:'',
                form: {
                },
                id:this.$route.query.id,
                idx: -1,
                isAdd:false,
                delivery:false,
                switchValue:1,
                value5:'0',
                level_1:'',
                level_2:'',
                image:'',
                loadImg:imgUrlA+"/college/article/uploadGoodsImg",
                options:[{value:1,label:"全平台"},{value:2,label:"登录用户"},{value:3,label:"会员"}],
                pay_options:[{value:0,label:"积分"},{value:1,label:"人民币"}],
                optionsA:[],
                optionsB:[],
                detailDatas:{},
                msg:'',

            }
        },
        created() {
            this.getClass(0,1);
            if(this.$route.query.id){
              this.getDetail();
            }
        },
        mounted(){
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
            if(this.$route.query.id){
                this.editor.addListener("ready", function () {

                        var filter = {};
                        filter.pageNum  = 1;
                        filter.pageSize =1;
                        filter.article_id = _this.$route.query.id;
                        _this.$ajax.postu(urlA+'college/article/getArticle', filter).then((res) => {
                            if (res.msg == "success") {
                                _this.editor.setContent(res.data.content);
                            } else {
                                _this.$message({
                                message: res.msg,
                                type: 'error'
                                });
                            }
                        });
             });
            }
           
        },
        methods: {
            // 获取列表数据
            getDetail() {
                // this.defaultMsg="123455%78888";
                var filter = {};
                filter.pageNum  = 1;
                filter.pageSize =1;
                filter.article_id = this.id;
                this.$ajax.postu(urlA+'college/article/getArticle', filter).then((res) => {
                    if (res.msg == "success") {
                       this.detailDatas = res.data;
                       this.addForm = res.data;
                       this.image =imgUrlB+res.data.image;
                       this.addForm.is_check = res.data.is_check.toString();
                       if(res.data.level_1!='0'){
                           this.getClass(res.data.level_1,2);
                           this.level_1 =  res.data.level_1;
                           this.level_2 = res.data.classify_id;
                       }
                       if(res.data.level_2!='0'){
                           this.level_2 = res.data.level_2;
                       }
                       this.addForm.is_pay =  res.data.is_pay.toString();
                       if(res.data.is_check==0){
                         this.delivery = true;
                         this.switchValue = 0;
                       }else{
                         this.delivery = false;
                         this.switchValue = 1;
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
                this.$ajax.postu(urlA+'/college/articleClassify/getArticleClassify', filter).then((res) => {
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
                    params.article_id = this.addForm.article_id;
                    params.title = this.addForm.title;
                    params.author = this.addForm.author;
                    params.company = this.addForm.company;
                    params.copyright = this.addForm.copyright;
                    params.project_name = this.addForm.project_name;
                    params.keywords = this.addForm.keywords;
                    params.sort = this.addForm.sort;
                    params.is_look = this.addForm.is_look;
                    params.integral = this.addForm.integral;
                    params.pay_method = this.addForm.pay_method;
                    params.project_number = this.addForm.project_number;
                    params.image = this.addForm.image;
                    params.is_check = this.addForm.is_check;
                    params.is_pay = this.addForm.is_pay;
                    params.content = this.getUEContent();
                    this.$ajax.postu(urlA+'/college/article/updateArticle',params).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('更新成功');
                        this.$router.push({ path: '/article'});
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
                    this.addForm.content = this.getUEContent();
                    this.$ajax.postu(urlA+'/college/article/saveArticle',this.addForm).then((res) => {
                        if (res.msg == "success") {
                        this.$message.success('添加成功');
                        this.$router.push({ path: '/article'});
                        } else {
                            this.$message({
                            message: res.msg,
                            type: 'error'
                            });
                        }
                    });
                }
            
            },
           handleSwitch(row){
             console.log(row)
             this.switchValue = row;
           },
            cancel(){
               this.$router.go(-1);
            },
            
            handleAvatarSuccess(res, file) {
                this.image = URL.createObjectURL(file.raw);
                console.log(res)
                this.addForm.image=res.data;
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                 return  isLt2M;
            },
             getUEContent() { // 获取内容方法
                    return this.editor.getContent()
                }   
        },
         destroyed() {
                this.editor.destroy();
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
