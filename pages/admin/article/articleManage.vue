<template>
  <xy-table :columns="columns" url="/v1/article" ref="xyTable" :params="params">
    <Button icon="plus" @click="create">新建</Button>
    <Button icon="edit" @click="edit" >修改</Button>
    <Button icon="close" @click="deleteArticle" >删除</Button>
  </xy-table>
</template>
<script>
  export default {
    layout: 'admin',
    data () {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '标题',
            key: 'title'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const text = params.row.status === 'RELEASE' ? '已发布' : '草稿'
              return h('span', text)
            }
          },
          {
            title: '创建时间',
            key: 'createDate',
            sortable: 'custom'
          },
          {
            title: 'url',
            key: 'url'
          }
        ],
        params: {
          sort: 'createDate desc'
        }
      }
    },
    methods: {
      edit () { // 编辑
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length === 0) {
          this.$Message.warning('请选择一行')
          return
        }
        this.$router.push({path: '/admin/article/editArticle', query: {articleId: selectedData[0].articleId}})
      },
      create () { // 创建文章
        this.$router.push({path: '/admin/article/editArticle', query: {articleId: ''}})
      },
      deleteArticle () { // 删除文章
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length !== 0) {
          this.$Message.warning('请选择一行')
          return
        }
        this.$http.post('/v1/article/' + selectedData[0].articleId, {method: 'delete'})
          .then(res => {
            this.$Message.success('删除成功')
          }).catch(res => {
            let response = res.response
            if (response.data && response.data.message) {
              this.$Message.error(response.data.message)
            } else {
              this.$Message.error('删除失败')
            }
          })
      }
    }
  }
</script>
