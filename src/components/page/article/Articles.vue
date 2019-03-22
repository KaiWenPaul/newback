<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>文章发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
              <div class="handle-box">
              <el-input v-model="articleId" placeholder="输入文章编号" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <el-input v-model="name" placeholder="输入文章名称" class="handle-input mr10" @keyup.enter.native="getData"></el-input>
              <!-- <el-input v-model="corporateName" placeholder="输入公司名称" class="handle-input mr10"></el-input>
              <el-date-picker type="date" placeholder="请选择日期" v-model="form.date" value-format="yyyy-MM-dd"></el-date-picker>-->
              <el-select v-model="check_state" placeholder="审核状态" class="handle-select mr10" @keyup.enter.native="getData">
                    <el-option key="1" label="审核中" value="1"></el-option>
                    <el-option key="2" label="审核通过" value="2"></el-option>
                    <el-option key="3" label="审核未通过" value="3"></el-option>
                </el-select>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </div>
           <div class="handle-box add">
             <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="releaseGo">发布文章</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="opendelAll">批量删除文章</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="exportAll">批量导入文章</el-button>
             <el-button type="primary" icon="delete" class="handle-del mr10" @click="download">下载模板</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="article_id" label="文章id" align="center"></el-table-column>
                <el-table-column prop="title" :show-overflow-tooltip="true" label="文章标题" align="center" width="150"></el-table-column>
                <el-table-column prop="author" label="作者" align="center"></el-table-column>
                <el-table-column prop="company" label="机构" align="center"></el-table-column>
                <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="classify_name" label="分类名称" align="center"></el-table-column>
                <el-table-column prop="keywords" label="关键字" align="center"></el-table-column>
                <el-table-column label="可见范围" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.is_look=='1'">全平台</span>
                   <span v-else-if="scope.row.is_look=='2'">登录用户</span>
                   <span v-else-if="scope.row.is_look=='3'">会员</span>
                   <span v-else>其它</span>
                  </template>
                </el-table-column>
                <el-table-column  label="是否开启" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.is_check=='0'">开启</span>
                   <span v-else-if="scope.row.is_check=='1'">关闭</span>
                   <span v-else>{{scope.row.is_check}}</span>
                  </template>
                </el-table-column>
                <el-table-column  label="是否下载" align="center">
                  <template slot-scope="scope">
                   <span v-if="scope.row.is_pay=='0'">免费下载</span>
                   <span v-else-if="scope.row.is_pay=='-1'">不可下载</span>
                    <span v-else-if="scope.row.is_pay=='1'">付费下载</span>
                   <span v-else>{{scope.row.is_pay}}</span>
                  </template>
                </el-table-column>
               
                <el-table-column prop="integral" label="下载所需积分" align="center"></el-table-column>
                <el-table-column prop="copyright" label="版权" align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <!--导入提示框-->
      <el-dialog title="上传文章" :visible.sync="exportVisible" width="30%">
           <el-upload
            :action="action"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="success"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">请上传文章</div>-->
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportVisible = false">关闭</el-button>
                <el-button type="primary" @click.native="upload">保存</el-button>
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
         <!-- 批量删除提示框 -->
        <el-dialog title="提示" :visible.sync="delallVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delallVisible = false">取 消</el-button>
                <el-button type="primary" @click="delAll">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import UE from '../../common/Idtor.vue';
    export default {
        name: 'basetable',
       components: {UE},
        data() {
            return {
                defaultMsg: '这里是UE测试',
                 config: {
                initialFrameWidth: null,
                initialFrameHeight: 350
                },
                tableData: [],
                cur_page: 1,
                total:0,
                multipleSelection: [],
                check_state: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                delallVisible:false,
                listVisible:false,
                addFormVisible:false,//新增
                addForm:[],
                isView:false,//判断是否是查看和编辑
                disabled:true,
                title:'',
                state:'',
                form: {
                },
                idx: -1,
                isAdd:false,
                articleId:'',
                name:'',
                exportVisible:false,
                action:urlA+'/college/article/loadExcel',
                filePath:'',
                fileList:[]
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
                filter.pageNum  = this.cur_page;
                filter.pageSize =10;
                filter.article_id = this.articleId;
                filter.title = this.name;
                this.$ajax.postu(urlA+'/college/article/getArticleList', filter).then((res) => {
                    if (res.msg == "success") {
                       this.tableData = res.data.list;
                       this.total = res.data.total;
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
           
            // 编辑
            handleEdit(row) {
            console.log(row)
             this.$router.push({ path: '/editor_article',query: {id:row.article_id}})
            //   this.$router.push({ name: '文章编辑',query: {id:row.article_id,str:'<p>123456789</p>'}})
            
            },
            // 去添加和编辑文章
            releaseGo(){
               this.$router.push({ path: '/editor_article'})
            },
            // 下载文章模板
            download(){
               window.open(downUrl+"/excel/ArticleTemplate.xlsx")
            },
            cancel(){
               this.editVisible = false;
               this.pwVisible = false;
            },
            handleDelete(index, row) {
                this.idx = row.article_id;
                this.delVisible = true;
                
            },
            opendelAll(){
                this.delallVisible = true;
            },
            // 批量导入文章
            exportAll(){
              this.exportVisible = true;
            },
           success(res, file) {
                console.log(res);
                this.filePath = res.data;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`暂只支持上传一个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            // 上传文件
            upload(){
                this.$ajax.postu(urlA+'/college/article/loadArticleExcel',{path:this.filePath}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('上传成功');
                       this.exportVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
             // 确定删除
            deleteRow(){
                 this.$ajax.postu(urlA+'/college/article/deleteArticle',{article_delete_ids:this.idx}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('删除成功');
                       this.delVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
            },
            delAll() {
               const length = this.multipleSelection.length;
                let str = '';
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].article_id+',';
                }
               var strs = str.substring(0,str.length-1);
               if(strs!=''){
                  this.$ajax.postu(urlA+'/college/article/deleteArticle',{article_delete_ids:strs}).then((res) => {
                    if (res.msg == "success") {
                       this.$message.success('批量删除成功');
                       this.delallVisible = false;
                       this.getData();
                    } else {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
                this.multipleSelection = [];
               }else{
                   this.$message({
                        message: '请选择需要删除的文章',
                        type: 'warning'
                        });
               }
 
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
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
   .avatar-uploader{
       float:left;
       margin-right:5px;
   }
   .el-upload--text{
       width:0px !important;
       height:0px !important;
   }
</style>
