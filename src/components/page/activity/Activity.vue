<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>活动发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-input v-model="id" placeholder="输入活动编号" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-input v-model="name" placeholder="输入活动名称" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-date-picker type="datetime" placeholder="活动开始时间" v-model="startTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <el-date-picker type="datetime" placeholder="活动截止时间" v-model="endTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              <el-select v-model="activeState" placeholder="活动状态" class="handle-select mr10">
                <el-option key="" label="全部" value=""></el-option>
                <el-option key="0" label="开启" value="0"></el-option>
                <el-option key="1" label="关闭" value="1"></el-option>
              </el-select>
                
              <el-button type="primary" icon="search" @click="getData(1)">搜索</el-button>
            </div>
           <div class="handle-box add">
               <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
              <router-link :to="{ path: 'add_activity' }" style="float:left;">新增</router-link>
              <router-link :to="{ path: 'type_list' }" style="float:left;margin-left:25px;margin-bottom:20px;width:90px;">类型编辑</router-link>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="活动编号" align="center"></el-table-column>
                <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
                <el-table-column label="活动类型" align="center"> 
                  <template slot-scope="scope">
                        <span v-if="scope.row.lableName == '1'">满减</span>  
                        <span v-else-if="scope.row.lableName == '2'">打折</span>
                        <span v-else-if="scope.row.lableName == '3'">满赠</span>
                        <span v-else-if="scope.row.lableName == '4'">半价</span>
                        <span v-else>{{scope.row.lableName}}</span>
                   </template>
                </el-table-column>
                <el-table-column label="终端" align="center">
                   <template slot-scope="scope">
                        <span v-if="scope.row.releaseTo == '0'">商城</span>  
                        <span v-else-if="scope.row.releaseTo == '1'">经销商</span>
                        <span v-else>{{scope.row.releaseTo}}</span>
                   </template>
                </el-table-column>
                <el-table-column  label="活动模板" align="center">
                   <template slot-scope="scope">
                        <span v-if="scope.row.templateId == '1'">双十二模板</span>  
                        <span v-else-if="scope.row.templateId == '2'">解决方案模板</span>
                        <span v-else-if="scope.row.templateId == '3'">折扣方案模板</span>
                        <span v-else-if="scope.row.templateId == '4'">不使用模板</span>
                        <span v-else>{{scope.row.templateId}}</span>
                   </template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                <el-table-column  label="状态" align="center">
                     <template slot-scope="scope">
                        <span v-if="scope.row.activeState == '0'">开启</span>  
                        <span v-else-if="scope.row.activeState == '1'">关闭</span>
                        <span v-else>{{scope.row.activeState}}</span>   
                   </template>
                </el-table-column>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="goExport(scope.row)">查看产品</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="活动编辑" :visible.sync="editVisible" width="60%">
             <el-form ref="form" :model="form" label-width="110px" style="width:660px;">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2" align="center">-</el-col>
                        <el-col :span="11">
                            <el-date-picker  type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="结束日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
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
                            <el-date-picker  type="datetime"value-format="yyyy-MM-dd HH:mm:ss"  placeholder="开启时间" v-model="form.timingTime" style="width: 100%;"></el-date-picker>
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
                        <el-select
                            placeholder="请选择链接类型"
                            value-key="id"
                            v-model="form.webUrlType">
                            <el-option
                                v-for="item in urlTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                          <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="form.webUrl"
                            :fetch-suggestions="querySearch1"
                            placeholder="请选择内容（也可输入）"
                            @select="handleSelect1">
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
                        <!--<el-select v-model="form.webUrl" placeholder="请选择相关页面链接">
                          <el-option key="http://47.99.133.23/html/h5/activitys.html" label="http://47.99.133.23/html/h5/activitys.html" value="http://47.99.133.23/html/h5/activitys.html"></el-option>
                          <el-option key="http://47.99.133.23:8000/activity.html#/doing" label="http://47.99.133.23:8000/activity.html#/doing" value="http://47.99.133.23:8000/activity.html#/doing"></el-option>
                          <el-option key="http://47.99.133.23:8000/activity.html#/discount" label="http://47.99.133.23:8000/activity.html#/discount" value="http://47.99.133.23:8000/activity.html#/discount"></el-option>
                        </el-select>-->
                     </el-form-item>
                     <el-form-item label="移动端跳转设置" style="width:800px;">
                        <el-select style="float:left"
                            placeholder="请选择链接类型"
                            value-key="id"
                            v-model="form.moveUrlType">
                            <el-option
                                v-for="item in urlTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
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
                        <el-select style="float:left"
                            placeholder="请选择链接类型"
                            value-key="id"
                            v-model="form.smallUrlType">
                            <el-option
                                v-for="item in urlTypeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
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
                           style="width:100px;"
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
                        <el-button type="primary" @click="saveEdit">提交</el-button>
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
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                // 搜索条件
                id:'',//活动id
                activeState:'',
                name:'',
                startTime:'',
                endTime:'',
                delivery:false,//定时控制
                moveImage:'',//移动端图片
                webImage:'', //web端图片
                webHeadImg:'',//web端顶部图
                moveHeadImg:'',//移动端顶部图
                typeList:[],
                urlTypeList:[
                    {id:0,name:'默认页'},{id:1,name:'活动页面'}, {id:2,name:'商品详情页'},{id:3,name:'购物车'},{id:4,name:'优惠券'},
                ],
                form: {
                },
                idx: -1,
                restaurants: [],
                restaurants1: [],
                restaurants2: [],
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
            this.getData(1);
            this.getType(); 

        },
        mounted(){
          this.restaurants = this.loadAll();
          this.restaurants1 = this.loadAll1();
          this.restaurants2 = this.loadAll2();
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(this.cur_page );
            },
            reload(){
                this.getData(1);
            },
            //去查看产品
            goExport(arr){
              if(arr.templateId=='4'){
                  this.$message({
                        message: "不使用模板无产品项！",
                        type: 'error'
                        }); 
              }else{
                this.$router.push({ path: '/export_goods',query:{id:arr.id}})
              } 
            },
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
            // 获取列表数据
            getData(arr) {
                var filter = {};
                filter.page = arr;
                filter.limit =10;
                filter.id = this.id;
                filter.name = this.name;
                filter.startTime = this.startTime;
                filter.end_time = this.endTime;
                filter.activeState = this.activeState;
                this.$ajax.postu(url+'distributor/tstdistributoraddactivity.api?selectListPaging', filter).then((res) => {
                    if (res.description == "success") {
                       this.tableData = res.data;
                    //    this.total = res.data.total;
                       console.log(123)
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
            handleEdit(index, row) {
                const item = this.tableData[index];
                console.log(item)
                this.delivery = item.timingTime?true:false;
                this.idx = item.id;
                this.moveImage=imgUrl+'mnt/disha/vlb-distributor/'+item.moveImage;
                this.webImage=imgUrl+'mnt/disha/vlb-distributor/'+item.webImage;
                this.moveHeadImg=imgUrl+'mnt/disha/vlb-distributor/'+item.headImageMove;
                this.webHeadImg=imgUrl+'mnt/disha/vlb-distributor/'+item.headImagePc;
                this.form = {
                    name: item.name,
                    typeId:item.typeId,
                    startTime:item.startTime,
                    endTime:item.endTime,
                    timingTime:item.timingTime,//定时时间
                    moveImage:item.moveImage,//移动端图片
                    webImage:item.webImage, //web端图片
                    headImageMove:item.headImageMove,//移动端图片
                    headImagePc:item.headImagePc, //web端图片
                    activeState:item.activeState.toString(),//活动状态
                    releaseTo:item.releaseTo?item.releaseTo.toString():'0',//发布至
                    moveUrl:item.moveUrl,
                    webUrl:item.webUrl,
                    smallUrl:item. smallUrl,
                    webUrlType:item.webUrlType,
                    moveUrlType:item.moveUrlType,
                    smallUrlType:item.smallUrlType,
                    colour:item.colour,
                    activityRulesType:item.activityRulesType.toString(),
                    activityRulesName:item.activityRulesName,
                    sort:item.sort
                }
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                if(this.delivery=false){
                    this.form.timingTime='';
                }
               this.form.id= this.idx;
               this.$ajax.postu(url+'distributor/tstdistributoraddactivity.api?update',this.form).then((res) => {
                    if (res.description == "success") {
                       this.$message.success('修改成功');
                       this.editVisible = false;
                       this.id='';
                       this.getData();
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
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
                 this.$ajax.postu(url+'distributor/tstdistributoraddactivity.api?delete',{id:this.idx}).then((res) => {
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

        }
    }

</script>

<style>
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
    .el-autocomplete{width:330px;}
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
   .down{
    color:red;
    text-decoration:underline;
    font-size:12px;
}
.down:hover{
    background:#fff;
}
.el-color-picker--small .el-color-picker__trigger{
    height:50px !important;
    width:150px !important;
}
   
</style>
