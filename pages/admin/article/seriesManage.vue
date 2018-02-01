<template>
  <xy-table :columns="columns" url="/v1/series" ref="xyTable">
    <Button icon="plus" @click="create">新建</Button>
  </xy-table>
</template>
<script>
  export default {
    layout: 'admin',
    data () {
      return {
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '操作',
            key: 'action',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/admin/article/seriesTree', query: {seriesId: params.row.seriesId}})
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.seriesId)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    methods: {
      create () { // 创建
        let text = null
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                autofocus: true,
                placeholder: '请输入名称'
              },
              on: {
                input: (val) => {
                  text = val
                }
              }
            })
          },
          onOk: () => {
            if (text === null || text.length === 0) {
              this.$Message.error('请输入名称')
            } else {
              this.$http.put('/v1/series', {name: text}).then(res => {
                this.$refs.xyTable.refresh()
              }).catch(res => {
                this.$Message.error('创建失败')
              })
            }
          }
        })
      },
      remove (seriesId) { // 删除
        this.$Modal.confirm({
          title: '系统提示',
          content: '确定要删除吗？',
          onOk: () => {
            this.$http.post('/v1/series/' + seriesId, {method: 'delete'}).then(res => {
              this.$refs.xyTable.refresh()
            }).catch(res => {
              this.$Message.error('删除失败')
            })
          }
        })
      }
    }
  }
</script>
