<template>
  <article class="xy-article container" id="preview">
    <header class="xy-article-title" id="preview_title">
      <h1>在线查看office文档</h1>
      <small class="text-muted">作者:  小恩 时间:
        <time datetime="2017-10-13T22:00:00">2018-01-31 15:00</time>
      </small>
    </header>
    <section class="xy-article-content">
      <blockquote id="preview_blockquote">
        将office文档转换为html格式，方便在线查看；支持doc,docx,xls
      </blockquote>
      <div id="preview_file">
        <label class="custom-file">
          <input type="file" name="file" id="file" class="custom-file-input" @change="fileChange">
          <span class="custom-file-control">{{filename}}</span>
        </label>
      </div>
      <div class="alert alert-danger message" role="alert" v-show="showMessage">
        {{message}}
      </div>
      <iframe v-show="showFrame" :src="src" v-bind:style="{height:frameHeight}"
              class="preview-frame" frameborder="no" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes">
      </iframe>
    </section>
  </article>
</template>
<script>
  import axios from 'axios'

  export default {
    head () {
      return {
        title: '在线查看office文档-' + process.env.appName
      }
    },
    data () {
      return {
        showFrame: false,
        showMessage: false,
        message: '',
        frameHeight: '0',
        src: '',
        filename: '选择一个文件'
      }
    },
    methods: {
      fileChange () {
        // 设置frame的高度，使其刚好铺满整个屏幕
        if (this.frameHeight === '0') {
          const e1 = document.getElementById('preview').offsetHeight
          const e2 = document.getElementById('preview_title').offsetHeight
          const e3 = document.getElementById('preview_blockquote').offsetHeight
          const e4 = document.getElementById('preview_file').offsetHeight
          let e5 = e1 - e2 - e3 - e4 - 120
          if (e5 < 400) {
            e5 = 400
          }
          this.frameHeight = e5 + 'px'
        }
        const file = document.getElementById('file').files[0]
        if (file === undefined) {
          return
        }
        this.filename = file.name
        const index = this.filename.indexOf('.')
        let extension = ''
        if (index > -1) {
          extension = this.filename.substring(index + 1).toLowerCase()
        }
        // 检查文件格式
        if (extension !== 'doc' && extension !== 'docx' && extension !== 'xls') {
          this.showMessage = true
          this.message = '格式不支持'
          return
        }
        // 检查文件大小
        if (file.size > 1024 * 1024) {
          this.showMessage = true
          this.message = '文件大小不能超过1MB'
          return
        }
        this.showMessage = false
        const formdata = new FormData()
        formdata.append('file', file)
        const vm = this
        // 上传文件
        axios({
          url: '/v1/file/toHtml',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          vm.showFrame = true
          vm.src = res.data.url
        }).catch(res => {
          let {response} = res
          if (response.data && response.data.message) {
            vm.message = response.data.message
          } else {
            vm.message = '转换失败'
          }
          vm.showMessage = true
          vm.showFrame = false
        })
      }
    }
  }
</script>
<style src="~/assets/css/article.css"></style>
<style scoped>
  .custom-file-control::before {
    content: "选择";
  }

  .custom-file {
    width: 100%;
    max-width: 500px;
  }

  .message{
    margin-top:1em;
    max-width: 500px;
  }

  .preview-frame{
    width: 100%;
    min-height: 400px;
    max-height: 800px;
    margin-top: 1em;
    border: 1px solid #ccc;
  }

  .custom-file-control{
    overflow: hidden;
    white-space: nowrap;
  }
</style>
