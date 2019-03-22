<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布-创建活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-steps :space="400" :active="active" finish-status="success">
                    <el-step title="选择模板"></el-step>
                    <el-step title="新建活动"></el-step>
                    <el-step title="导入产品"></el-step>
                </el-steps>
            </div>
            <div class="handle-box" style="width:96%;min-height:500px;margin:0 auto;padding:20px 30px;border:1px solid #f5f5f5;">
           
             <!--新建活动-->
            <div class="create" style="width:100%;height:100%;"> 
              <div class="form-box" style="width:658px;">
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-date-picker  type="datetime"value-format="yyyy-MM-dd HH:mm:ss"  placeholder="结束日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="活动类型">
                        <el-select
                            placeholder="请选择"
                            value-key="id"
                            v-model="form.typeId">
                            <el-option
                                v-for="item in typeList"
                                :key="item.typeId"
                                :label="item.typeName"
                                :value="item.typeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                  
                    <el-form-item label="定时开启">
                        <el-col :span="5">
                             <el-switch v-model="delivery"></el-switch>
                        </el-col>
                         <el-col :span="11">
                            <el-date-picker  type="datetime" placeholder="开启时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.timingTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                   <el-form-item label="移动端轮播图">
                       <el-col :span="8">
                        <el-upload
                        class="avatar-uploader"
                        :action="loadImg"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess1"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="moveImage" :src="moveImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <p style="font-size:12px;color:#999;">上传图片格式为750 X 375</p>
                       </el-col>
                        <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                        <el-col class="line" :span="5" align="center">web端轮播图</el-col>
                        <el-col :span="8">
                            <el-upload
                            class="avatar-uploader"
                            :action="loadImg"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess2"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="webImage" :src="webImage" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p style="font-size:12px;color:#999;">上传图片格式为740 X 414</p>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="移动端顶部图">
                       <el-col :span="8">
                            <el-upload
                            class="avatar-uploader"
                            :action="loadImg"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess3"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="moveHeadImg" :src="moveHeadImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <!--<p style="font-size:12px;color:#999;">上传图片格式为750 X 375</p>-->
                        </el-col>
                        <el-col class="line" :span="2" align="center"><div style="width:10px;height:20px;"></div></el-col>
                        <el-col class="line" :span="5" align="center">web端顶部图</el-col>
                        <el-col :span="8">
                           <el-upload
                            class="avatar-uploader"
                            :action="loadImg"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess4"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="webHeadImg" :src="webHeadImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <!--<p style="font-size:12px;color:#999;">上传图片格式为740 X 414</p>-->
                        </el-col>
                    </el-form-item>
                    <el-form-item label="web端跳转设置">
                       <el-select v-model="form.webUrlType" placeholder="请选择链接类型">
                            <el-option key="0" label="默认页" value="0"></el-option>
                            <el-option key="1" label="活动页面" value="1"></el-option>
                            <el-option key="2" label="商品详情页" value="2"></el-option>
                            <el-option key="3" label="购物车" value="3"></el-option>
                            <el-option key="4" label="优惠券" value="4"></el-option>
                        </el-select>
                         <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="form.webUrl"
                            :fetch-suggestions="querySearch1"
                            placeholder="请选择内容（也可输入）"
                            @select="handleSelect">
                            <i
                                class="el-icon-edit el-input__icon"
                                slot="suffix"
                                @click="handleIconClick">
                            </i>
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                 <span class="addr">{{ item.name}}</span>
                            </template>
                        </el-autocomplete>
                      
                        <!-- <el-select v-model="form.webUrl" placeholder="请选择相关页面链接">
                          <el-option key="http://47.99.133.23/html/h5/activitys.html" label="http://47.99.133.23/html/h5/activitys.html" value="http://47.99.133.23/html/h5/activitys.html"></el-option>
                          <el-option key="http://47.99.133.23:8000/activity.html#/doing" label="http://47.99.133.23:8000/activity.html#/doing" value="http://47.99.133.23:8000/activity.html#/doing"></el-option>
                           <el-option key="http://47.99.133.23:8000/activity.html#/discount" label="http://47.99.133.23:8000/activity.html#/discount" value="http://47.99.133.23:8000/activity.html#/discount"></el-option>
                        </el-select>-->
                     </el-form-item>
                     <el-form-item label="移动端跳转设置" style="width:900px;">
                        <el-select v-model="form.moveUrlType" placeholder="请选择链接类型" style="float:left;">
                            <el-option key="0" label="默认页" value="0"></el-option>
                            <el-option key="1" label="活动页面" value="1"></el-option>
                            <el-option key="2" label="商品详情页" value="2"></el-option>
                            <el-option key="3" label="购物车" value="3"></el-option>
                            <el-option key="4" label="优惠券" value="4"></el-option>
                        </el-select>
                          <!--<el-select v-model="form.moveUrl" placeholder="请选择相关页面链接">
                          <el-option key="SpecialOnePage" label="SpecialOnePage" value="SpecialOnePage"></el-option>
                          <el-option key="RealTimePage" label="RealTimePage" value="RealTimePage"></el-option>
                          <el-option key="UniversalPage" label="UniversalPage" value="UniversalPage"></el-option>
                        </el-select>-->
                        <el-autocomplete style="float:left;margin-left:5px;"
                            popper-class="my-autocomplete"
                            v-model="form.moveUrl"
                            :fetch-suggestions="querySearch"
                            placeholder="请选择内容（也可输入）"
                            @select="handleSelect">
                            <i
                                class="el-icon-edit el-input__icon"
                                slot="suffix"
                                @click="handleIconClick">
                            </i>
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                 <span class="addr">{{ item.name}}</span>
                            </template>
                        </el-autocomplete>
                       <div style="float:left;height:30px;line-height:30px;width:120px;margin-left:15px;"><a target="_blank" href="http://47.99.133.23:8000/images/desc.docx" class="down">点我下载H5上传说明</a></div>
                      
                    </el-form-item>
                     <el-form-item label="小程序跳转设置" style="width:800px;">
                       
                        <el-select v-model="form.smallUrlType" placeholder="请选择链接类型" style="float:left;">
                            <el-option key="0" label="默认页" value="0"></el-option>
                            <el-option key="1" label="活动页面" value="1"></el-option>
                            <el-option key="2" label="商品详情页" value="2"></el-option>
                            <el-option key="3" label="购物车" value="3"></el-option>
                            <el-option key="4" label="优惠券" value="4"></el-option>
                        </el-select>
                        <el-autocomplete style="float:left;margin-left:5px;"
                            popper-class="my-autocomplete"
                            v-model="form.smallUrl"
                            :fetch-suggestions="querySearch2"
                            placeholder="请选择内容（也可输入）"
                            @select="handleSelect2">
                            <i
                                class="el-icon-edit el-input__icon"
                                slot="suffix"
                                @click="handleIconClick2">
                            </i>
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                                 <span class="addr">{{ item.name}}</span>
                            </template>
                        </el-autocomplete>
                        <!--<div style="float:left;height:30px;line-height:30px;width:120px;margin-left:15px;"><a target="_blank" href="http://47.99.133.23:8000/images/desc.docx" class="down">点我下载H5上传说明</a></div>-->
                      
                    </el-form-item>
                    <el-form-item label="模板背景色">
                        <el-color-picker
                            v-model="form.colour"
                            show-alpha
                            :predefine="predefineColors">
                        </el-color-picker>
                    </el-form-item>
                     <el-form-item label="活动规则描述">
                        <el-input type="textarea" :rows="4" placeholder="请输入活动规则" v-model="form.activityRulesName"></el-input>
                    </el-form-item>
                    <el-form-item label="规则展示">
                        <el-radio v-model="form.activityRulesType" label="1">底部</el-radio>
                        <el-radio v-model="form.activityRulesType" label="0">顶部</el-radio>
                    </el-form-item>
                    <el-form-item label="权重">
                        <el-input v-model="form.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="活动状态">
                        <el-radio v-model="form.activeState" label="0">开启</el-radio>
                        <el-radio v-model="form.activeState" label="1">关闭</el-radio>
                    </el-form-item>
                     <el-form-item label="发布至">   
                        <el-radio v-model="form.releaseTo" label="0">商城</el-radio>
                        <el-radio v-model="form.releaseTo" label="1">经销商端</el-radio>
                    </el-form-item>
                
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            </div>

            </div>
         
           
        </div>

       
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
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                active:2,
                id:this.$route.query.id,
                delivery:false,//定时控制
                moveImage:'',//移动端图片
                webImage:'', //web端图片
                webHeadImg:'',//web端顶部图
                moveHeadImg:'',//移动端顶部图
                form: {},
                idx: -1,
                typeList:[],
                restaurants: [],
                restaurants1: [],
                restaurants2: [],
                state3: '',
                loadImg:imgUrl+"distributor/uploadimg/fileUpload",
                // 默认背景颜色
                predefineColors:[
                    '#2ea4be',
                    '#ff8c00',
                    '#ffd700',
                    '#90ee90',
                    '#00ced1',
                    '#1e90ff',
                    '#c71585',
                    'rgba(255, 69, 0, 0.68)',
                    'rgb(255, 120, 0)',
                    'hsv(51, 100, 98)',
                    'hsva(120, 40, 94, 0.5)',
                    'hsl(181, 100%, 37%)',
                    'hsla(209, 100%, 56%, 0.73)',
                    '#c7158577'
                    ]
               
            }
        },
        created() {
             this.getType();
        },
        mounted(){
          this.restaurants = this.loadAll();
          this.restaurants1 = this.loadAll1();
          this.restaurants2 = this.loadAll2();
        },
        methods: {
              getType(){
                this.$ajax.postu(url+'distributor/distributortype.api?selectlist').then((res) => {
                    if (res.description == "success") {
                       this.typeList = res.data;
                       for(var i=0;i<res.data.length;i++){
                           this.typeList[i].typeId = res.data[i].id;
                           this.typeList[i].typeName = res.data[i].name;
                       }
                    } else {
                        this.$message({
                        message: res.description,
                        type: 'error'
                        });
                    }
                });
            },
            onSubmit(){
                let params = {};
                if(this.delivery=false){
                    this.form.timingTime = '';
                }
                params.templateId = this.id;
                params.activeState = this.form.activeState;
                params.endTime = this.form.endTime;
                params.name = this.form.name;
                params.releaseTo = this.form.releaseTo;
                params.startTime = this.form.startTime;
                params.timingTime = this.form.timingTime;
                params.typeId = this.form.typeId;
                params.webImage = this.form.webImage;
                params.moveImage = this.form.moveImage;
                params.headImagePc = this.form.headImagePc;
                params.headImageMove = this.form.headImageMove;
                params.webUrl = this.form.webUrl;
                params.moveUrl = this.form.moveUrl;
                params.webUrlType = this.form.webUrlType;
                params.moveUrlType = this.form.moveUrlType;
                params.smallUrlType = this.form.smallUrlType;
                params.smallUrl = this.form.smallUrl;
                params.activityRulesType = this.form.activityRulesType;
                params.activityRulesName = this.form.activityRulesName;
                params.sort = this.form.sort;
                params.colour = this.form.colour;
                console.log(params)            
                this.$ajax.postu(url+"/distributor/tstdistributoraddactivity.api?insert",params).then((res) => {
                    if (res.description == "success") {
                         if(this.id=='4'){
                        //    this.$router.push({ path: '/activity'})  
                        this.$router.go(-1);
                         }else{
                           this.$router.push({ path: '/export_goods',query:{id:res.data}})
                         }
                    } else {
                    this.$message({
                        message: res.error,
                        type: 'error'
                    });
                    }
                });
                

            },
           cancel(){
                this.$router.push({ path: '/add_activity'})
            },

            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
                console.log(789)
            },
            querySearch1(queryString, cb) {
                var restaurants1 = this.restaurants1;
                var results1 = queryString ? restaurants1.filter(this.createFilter1(queryString)) : restaurants1;
                // 调用 callback 返回建议列表的数据
                cb(results1);
            },
            createFilter1(queryString) {
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
                console.log(789)
            },
             querySearch2(queryString, cb) {
                var restaurants2 = this.restaurants2;
                var results2 = queryString ? restaurants2.filter(this.createFilter1(queryString)) : restaurants2;
                // 调用 callback 返回建议列表的数据
                cb(results2);
            },
            createFilter2(queryString) {
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
                console.log(789)
            },
            loadAll() {
                return [
                { "value": "SpecialOnePage","name":"(双十二模板)"},
                { "value": "RealTimePage","name":"(解决方案模板)"},
                { "value": "UniversalPage","name":"(折扣活动模板)"},
                ];
            },
             
            loadAll1() {
                return [
                { "value": imgUrlB+"html/h5/activitys.html","name":"(双十二模板)"},
                { "value": imgUrlB+"activity.html#/doing","name":"(解决方案模板)"},
                { "value": imgUrlB+"activity.html#/discount","name":"(折扣活动模板)"},
                ];
            },
              loadAll2() {
                return [
                { "value": "../b_yzb_banner/b_yzb_banner","name":"(双十二模板)"},
                { "value": "../b_yzb_banner_c/b_yzb_banner_c ","name":"(解决方案模板)"},
                { "value": "../b_yzb_banner_b/b_yzb_banner_b ","name":"(折扣活动模板)"},
                ];
            },
            handleSelect(item) {
                console.log(item);
                console.log(this.form.moveUrl)
            },
            handleIconClick(ev) {
                console.log(ev);
            },
            handleSelect1(item) {
                console.log(item);
                console.log(this.form.moveUrl)
            },
            handleIconClick1(ev) {
                console.log(ev);
            },
              handleSelect2(item) {
                console.log(item);
                console.log(this.form.moveUrl)
            },
            handleIconClick2(ev) {
                console.log(ev);
            },




            handleAvatarSuccess1(res, file) {
                this.moveImage = URL.createObjectURL(file.raw);
                this.form.moveImage=res.data;
            },
            handleAvatarSuccess2(res, file) {
                this.webImage = URL.createObjectURL(file.raw);
                this.form.webImage=res.data;
            },
             handleAvatarSuccess3(res, file) {
                this.moveHeadImg = URL.createObjectURL(file.raw);
                console.log(res)
                this.form.headImageMove=res.data;
            },
             handleAvatarSuccess4(res, file) {
                this.webHeadImg = URL.createObjectURL(file.raw);
                console.log(res)
                this.form.headImagePc=res.data;
            },
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                // if (!isJPG) {
                // this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                // return isJPG && isLt2M;
                  return  isLt2M;
            },
            // 新建活动
            createActivity(arr){
                $('.handle-box .select').hide();
                $('.handle-box .create').show();
                this.active = 2;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
   .el-steps--horizontal{
       padding-left:300px;
   }
    .handle-select {
        width: 120px;
    }
   .handle-box .select.act{
       display:none;
   }
   .handle-box .create.act{
       display:block;
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
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload--text{
      width:180px !important;
  }
  .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
.el-autocomplete{width:328px;}
.down{
    color:red;
    text-decoration:underline;
    font-size:12px;
}
.down:hover{
    background:#fff;
}
</style>
