<template>
  <div>
    <div class="toolbar">
      <Button @click="saveButton"><i class="fa fa-save"></i>保存</Button>
      <Button @click="releaseButton"><i class="fa fa-share-alt"></i>发布</Button>
      <span class="article-message">{{message}}</span>
    </div>
    <hr/>

    <Form :model="article" :label-width="50">
      <FormItem label="标题">
        <i-input v-model="article.title"  :maxlength="50"></i-input>
      </FormItem>
      <FormItem label="类型" style="width: 180px">
        <Select v-model="article.type" >
          <Option value="INTRO">介绍</Option>
          <Option value="ARTICLE">文章</Option>
          <Option value="APP">应用</Option>
          <Option value="SOURCE">源码</Option>
        </Select>
      </FormItem>
      <FormItem label="url">
        <i-input v-model="article.url"  :maxlength="100"></i-input>
      </FormItem>
    </Form>
    <div>
    </div>
    <div class="mavon-editor">
      <mavon-editor v-model="article.originalText" @save="save" @change="change" :toolbars="toolbars"
                    @imgAdd="imgAdd" ref="editor"></mavon-editor>
    </div>
  </div>
</template>
<style scoped>
  .toolbar button{
    margin-right: 0.5em;
  }

  hr {
    margin: 10px 0 8px 0;
    background-color: #e9eaec;
    height: 1px;
    border: none;
  }

  .article-message {
    margin-left: 30px;
    vertical-align: middle;
  }

  .mavon-editor {
    margin-top: 10px;
  }

  .v-note-wrapper{
    z-index: inherit;
  }
</style>
<script>
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import axios from 'axios'

  export default {
    layout: 'admin',
    data () {
      return {
        message: '',
        imageFile: {}, // 图片文件
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      }
    },
    components: {
      mavonEditor
    },
    asyncData ({query}) {
      if (query.articleId && query.articleId.length > 0) {
        return axios.get('/v1/article/' + query.articleId, {params: {field: 'articleId,status,originalText,title,type,url'}}).then(res => {
          const data = res.data
          return {
            article: {
              articleId: data.articleId,
              originalText: data.originalText,
              formatText: '',
              title: data.title,
              status: data.status,
              type: data.type,
              url: data.url
            }
          }
        })
      } else {
        return {
          article: {
            articleId: '',
            originalText: '',
            formatText: '',
            title: '',
            status: 'DRAFT',
            type: 'ARTICLE',
            url: ''
          }
        }
      }
    },
    methods: {
      save (value, render) { // 保存文章内容
        this.saveButton()
      },
      change (value, render) { // 当编辑区变化时触发
        this.article.formatText = render
      },
      saveButton () { // 保存文章
        if (this.article.articleId && this.article.articleId.length > 0) {
          this.$http.post('/v1/article/' + this.article.articleId, {
            param: JSON.stringify(this.article)
          }).then(res => {
            this.message = res.data.updateDate.substring(11) + ' 已保存'
          }).catch(res => {
            this.$Message.error('保存失败')
          })
        } else { // 第一次保存
          this.$http.put('/v1/article', {
            param: JSON.stringify(this.article)
          }).then(res => {
            let data = res.data
            this.article.articleId = data.articleId
            this.article.status = data.status
            this.message = data.createDate.substring(11) + ' 已保存'
          }).catch(res => {
            this.$Message.error('保存失败')
          })
        }
      },
      releaseButton () { // 发布文章
        this.article.status = 'RELEASE'
        this.saveButton()
      },
      imgAdd (pos, file) { // 添加图片
        const formdata = new FormData()
        formdata.append('file', file)
        const vm = this
        axios({
          url: '/v1/file/uploadImage',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          vm.article.originalText = vm.article.originalText.replace('(' + pos + ')', '(' + res.data.url + ')')
        }).catch(res => {
          let {response} = res
          if (response.data && response.data.message) {
            this.$Message.error(response.data.message)
          } else {
            this.$Message.error('添加图片失败')
          }
        })
      }
    }
  }
</script>
