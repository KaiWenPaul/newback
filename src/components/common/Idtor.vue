<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {

                var filter = {};
                filter.pageNum  = 1;
                filter.pageSize =1;
                filter.article_id = 39356;
                _this.$ajax.postu(urlA+'/college/article/getArticleList', filter).then((res) => {
                    if (res.msg == "success") {
                        _this.editor.setContent(res.data.list[0].content);
                    } else {
                        _this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                    }
                });
        // _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>