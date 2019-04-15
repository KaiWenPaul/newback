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
                         <el-input v-model="form.validHour" placeholder="小时" class="handle-input mr10" style="width:300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="成团人数">
                         <el-input v-model="form.personNum" placeholder="" class="handle-input mr10" style="width:300px;"></el-input>
                        <span style="margin-left:20px;margin-right:5px;color:#606266">每人限购</span>
                         <el-input v-model="form.buyNum" placeholder="" class="handle-input mr10" style="width:300px;"></el-input>
                         <el-button type="primary" icon="search" @click="save()":loading="saveLoading">保存</el-button>
                    </el-form-item>   
              </el-form>
            </div>
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-circle-plus-outline" class="handle-del mr10" @click="addShops">添加商品</el-button>
             <el-button type="primary" icon="el-icon-tickets" class="handle-del mr10" @click="openLoad">批量上传</el-button>
             <el-button type="primary" icon="el-icon-upload" class="handle-del mr10" @click="downLoad">下载上传模板</el-button>
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
                            <!--<el-button type="success" @click="searchs(scope.row.goodsSku,scope.row,2)">搜索</el-button>-->
                            <el-button type="success" @click="chooseList(scope.row.goodsSku,scope.$index,scope.row)">搜索</el-button>
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
                            <el-button   v-if="scope.row.status" type="text" icon="el-icon-tickets" @click="openGet(scope.$index, scope.row)">生成信息</el-button>
                            <el-button  type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
           </div>  
        </div>

        <!-- 商品二维码等信息 -->
        <el-dialog title="产品信息" :visible="goodsVisible" width="50%" @close="cancel">
             <el-form ref="form"  label-width="100px">
                    <el-form-item label="web端链接:">
                    <!--<el-input style="width:500px;" v-model="webUrl"></el-input>-->
                        <span>{{webUrl}}</span>
                        <el-button class="ml10" type="text" size="medium"
                            v-clipboard:copy="webUrl"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError">复制链接</el-button>
                    </el-form-item>
                    <el-form-item label="移动端链接:">
                        <span>{{appUrl}}</span>
                        <el-button class="ml10" type="text" size="medium"
                            v-clipboard:copy="appUrl"
                            v-clipboard:success="onCopy"
                        v-clipboard:error="onError">复制链接</el-button>
                    </el-form-item>
                    <el-form-item label="产品二维码">
                        <div style="width:100px;">
                          <img  :src="erimg" alt="" style="width: 100px;height: 100px"  @click="bigImgShow(erimg)">
                          <p style="font-size:10px;width:100%;text-align:center;">(可点击图片放大)</p>
                        </div>
                        <div class="img-show-mask" id="img-show-mask" v-show="maskBtn" @click="closeBigImg"><img :src="bigImgSrc" class="bigImg" id="bigImg" /></div>
                    </el-form-item>
                     <el-form-item>
                        <el-button type="primary" @click="goodsVisible = false">关闭</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>

        <el-dialog title="搜索产品" :visible="FormVisible" @close="closeDialog">
             <el-form :inline="true" :model="filters">
                <div style="width:100%;">
                <el-form-item label="货号">
                    <el-input auto-complete="off" size="small" v-model="sku" placeholder="请输入产品货号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" size="small" type="primary" icon="search" v-on:click="getChoose">搜索</el-button>
                </el-form-item>
                </div>
             </el-form>
             <el-table :data="chooseData" border class="table" ref="chooseTable" highlight-current-row  @current-change="chooseCurrent">
                    <el-table-column  label="商品id" align="center">
                        <template slot-scope="scope"><span>{{scope.row.goodsId}}</span></template>        
                    </el-table-column>
                    <el-table-column label="商品货号" align="center">
                      <template slot-scope="scope"><span>{{scope.row.goodsSku}}</span></template>
                    </el-table-column>
                    <el-table-column prop="goodsName" :show-overflow-tooltip="true" label="商品名称" align="center"></el-table-column>
                    <el-table-column prop="goodsOriginPrice" label="原价" align="center"></el-table-column>
                    <el-table-column prop="goodsNowPrice" label="促销价" align="center"></el-table-column>
                </el-table>
        </el-dialog>

        <el-dialog title="上传" :visible="loadVisible" close='cancel'>
            <el-upload
                :action="loadAction"
                :on-success="upload_success"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :limit="1"
                :on-exceed="handleExceed"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">上传成功后，请点击保存,暂支持一次只能上传一个文件</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">关闭</el-button>
                <el-button type="primary" @click.native="saveLoad" :loading="saveLoading">保存</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible="delVisible" width="300px" center @close="cancel">
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
                chooseData:[],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                check_state: '',
                del_list: [],
                loadVisible:false,
                is_search: false,
                editVisible: false,
                delVisible: false,
                listVisible:false,
                goodsVisible:false,//产品二维码信息弹框
                addFormVisible:false,//新增
                addForm:[],
                isView:false,//判断是否是查看和编辑
                disabled:false,
                saveLoading:false,
                FormVisible:false,
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
                configStatus:'',
                loadAction:url+"/goodsController.api?loadExcel",
                filePath:'',
                fileList:[],
                oldRow:{},
                chooseIndex:'',
                filters:{},
                sku:'',
                webUrl:'',
                appUrl:'',
                erimg:'',
                bigImgSrc:'',
                maskBtn:false,
            }
        },
        created() {
            if(this.$route.query.id){
              this.getData();
            }
           
        },
        methods: {
            onCopy(e){
            console.log(e);
             this.$message.success('复制成功');
            },
            // 复制失败
            onError(e){
             this.$message.success('复制失败');
            },
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
                        // this.form = res.data.config;
                        // this.tableData = res.data.goodsList;
                        // this.configStatus = res.data.config.status;
                        // for(var i=0;i<res.data.goodsList.length;i++){
                        //     res.data.goodsList[i].status =res.data.config.status;
                        // }
                         this.tableData = res.data.goodsList;
                    } else {
                        this.$message({
                        message: res.status,
                        type: 'error'
                        });
                    }
                });
            },
            downLoad(){
                window.open("http://106.14.17.171/excel/upload_groupbuy_goods_template.xlsx")
            },
            handleRemove(file, fileList) {
               
            },
            handlePreview(file) {
                console.log(file);
                
            },
             handleExceed(files, fileList) {
                this.$message.warning(`暂只支持上传一个文件`);
            },
             // 上传成功回调
            upload_success:function(response, file, fileList){
                console.log(fileList)
               this.filePath = response.data;
            },

            openLoad(){
                this.loadVisible = true;
            },
            saveLoad(){
                 this.saveLoading = true;
                 this.$ajax.postu(url+'/groupBuyActivityBackendInterfaces.api?uploadGroupBuyGoodsExcel',{
                     path: this.filePath
                 }).then((res) => {
                        this.$ajax.postu(url+'/goodsInterfaces.api?getGoodsBatchUploadExcelProgress',{
                            filePath: this.filePath,
                            type:3
                        }).then((res) => {
                            if (res.status == "ok") {
                                this.saveLoading = false;
                                this.fileList=[];
                                if(res.data.status=='success'){
                                    for(var i=0;i<res.data.groupBuyGoodsDataListJSON.length;i++){
                                        this.tableData.push(res.data.groupBuyGoodsDataListJSON[i]); 
                                    }
                                    console.log(this.tableData)
                                }else{
                                    this.$message({
                                    message: res.data.message,
                                    type: 'error'
                                    });
                                    }
                            this.loadVisible = false;
                            } else {
                                this.$message({
                                message: res.error,
                                type: 'error'
                                });
                            }
                        });
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
           closeDialog(){
               this.sku = "";
           },
           getChoose(){
              this.$ajax.postu(url+'groupBuyActivityBackendInterfaces.api?getGoodsInfoBySku', {sku:this.sku}).then((res) => {
                    if (res.status == "ok") { 
                       this.chooseData = res.data;
                       console.log(this.chooseData)
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                }); 
           },
        //    打开弹框搜索
           chooseList(arr,brr,row){
               this.chooseIndex = brr;
               this.FormVisible = true;
               var params = {};
               this.sku= arr;
               params.sku = arr;  
               this.$ajax.postu(url+'groupBuyActivityBackendInterfaces.api?getGoodsInfoBySku', params).then((res) => {
                    if (res.status == "ok") { 
                       this.chooseData = res.data;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                }); 
           },
        //    弹框选值
            chooseCurrent(row){
                this.tableData[this.chooseIndex].goodsId  =row.goodsId;
                this.tableData[this.chooseIndex].goodsSku  =row.goodsSku;
                this.tableData[this.chooseIndex].goodsName =row.goodsName;
                this.tableData[this.chooseIndex].goodsOriginPrice  =row.goodsOriginPrice;
                this.tableData[this.chooseIndex].goodsNowPrice  =row.goodsNowPrice;
                this.sku = "";
                this.FormVisible = false;
            },
            //打开获取生成的商品信息二维码，链接等
            openGet(index,row){
             this.goodsVisible = true;
             this.webUrl = imgUrlB+"/index.html#/shop?shopid="+row.goodsId;
             this.$ajax.postu(url+'/goodsController.api?getGoodsH5Url', {goods_id:row.goodsId}).then((res) => {
                    if (res.status == "ok") {
                       this.appUrl = res.data;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
             this.$ajax.postu(url+'/goodsController.api?getGoodsQRCode', {goods_id:row.goodsId}).then((res) => {
                    if (res.status == "ok") {
                       this.erimg = imgUrlB+res.data;
                    } else {
                        this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                });
            },
             bigImgShow: function(url) { //打开图片预览
				this.bigImgSrc = url;
				this.maskBtn = true;
				this.$nextTick(function() {
					var imgShowMask = document.getElementById('img-show-mask');
					var img = document.getElementById('bigImg');
					var w = document.documentElement.clientWidth || document.body.clientWidth;
					var h = document.documentElement.clientHeight || document.body.clientHeight;
					var offsetY=window.pageYOffset;
					var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
						imgShowMask.style.height=scrollHeight+'px';
						img.style.left=(w/2-250)+'px';
						// img.style.top=(h/2-70+offsetY)+'px';
                        img.style.top="20%";
				});
 
			},
			closeBigImg: function() { //关闭图片预览
				this.maskBtn = false;
			},
            // 行值改变
            handleEdit(index, row){
               console.log(row)
            },
            handleDelete(index, row) {
                this.tableData.splice(index,1);
            },
            save(){
                this.saveLoading = true;
                var json = {};
                this.groupBuyActivityQo.buyNum = this.form.buyNum;
                this.groupBuyActivityQo.startTime = this.form.startTime;
                this.groupBuyActivityQo.endTime = this.form.endTime;
                this.groupBuyActivityQo.personNum = this.form.personNum;
                this.groupBuyActivityQo.validHour = this.form.validHour;
                json.goodsList = this.tableData;
                json.groupBuyActivityQo = this.groupBuyActivityQo;

                //同步处理
                 var _this = this;
                this.$ajax.postAjax(url+"/groupBuyActivityBackendInterfaces.api?addGroupBuyActivity",{json:JSON.stringify(json)},function(res){
                    if (res.status == "ok") {
                    _this.$message.success('添加成功');
                    _this.$router.push({ path: '/groups'})
                    } else {
                        _this.$message({
                        message: res.error,
                        type: 'error'
                        });
                    }
                    _this.saveLoading = false;
                   })
                
            },
           
            cancel(){
               this.editVisible = false;
               this.pwVisible = false;
               this.loadVisible = false;
               this.fileList=[];
                this.delVisible=false;  
                this.goodsVisible = false;  
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
  
   .mr10{margin-bottom:10px;margin-right:10px;}
    .el-upload-list__item-name:hover{
      background:#fff !important;
   }
     .img-show-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3000;
    background: rgba(0, 0, 0, .5);
}
 
.img-show-mask .bigImg {
    width: 500px;
    height: 500px;
    position: absolute;
    z-index: 3100;
    top: 0;
    left: 0;
    margin: auto;
}
</style>
