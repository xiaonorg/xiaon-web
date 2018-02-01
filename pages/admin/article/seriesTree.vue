<template>
  <div>
    <xy-table :columns="columns" :data="data" ref="xyTable" :showPage="false" >
      <Button @click="saveButton"><i class="fa fa-save"></i>保存</Button>
    </xy-table>
    <Modal
      v-model="isShowDialog"
      title="选择文章"
      @on-ok="selectArticle">
      <Select
        v-model="selectedArticleId"
        filterable
        remote
        :remote-method="getArticle"
        :loading="selectLoading">
        <Option v-for="option in articles" :value="option.articleId" :key="option.articleId">{{option.title}}</Option>
      </Select>
    </Modal>
  </div>
</template>
<script>
  import axios from '~/plugins/axios'

  export default {
    layout: 'admin',
    data () {
      return {
        isShowDialog: false,
        selectLoading: false,
        selectedArticleId: '',
        selectedSeriesIndex: '',
        articles: [],
        columns: [
          {
            title: '名称',
            key: 'nodeName'
          },
          {
            title: '等级',
            key: 'level'
          },
          {
            title: '关联文章',
            key: 'articleName'
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            render: (h, params) => {
              let deleteDisabled = params.row.level === 1
              let shiftUpDisabled = params.row.level === 1 || (params.row.level !== this.data[params.index - 1].level)
              let shiftDownDisabled = params.row.level === 1 || params.index === this.data.length - 1 || (params.row.level !== this.data[params.index + 1].level)
              let relationDisabled = params.row.level === 1 || (params.index !== this.data.length - 1 && params.row.level < this.data[params.index + 1].level)
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  attrs: {
                    disabled: shiftUpDisabled
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '上移'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  attrs: {
                    disabled: shiftDownDisabled
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '下移'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.create(params.index, params.row)
                    }
                  }
                }, '新建'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.edit(params.index, params.row)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  attrs: {
                    disabled: deleteDisabled
                  },
                  on: {
                    click: () => {
                      this.remove(params.index, params.row)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  attrs: {
                    disabled: relationDisabled
                  },
                  on: {
                    click: () => {
                      this.relationArticle(params.index, params.row)
                    }
                  }
                }, '关联')
              ])
            }
          }
        ]
      }
    },
    asyncData ({query}) {
      return axios.get('/v1/series/' + query.seriesId + '/all').then(res => {
        const data = res.data.rows
        for (let row of data) {
          row.nodeName = row.name
          for (let i = 0; i < row.level - 1; i++) {
            row.nodeName = '--|' + row.nodeName
          }
          if (!row.articleId) {
            row.articleId = ''
          }
          if (!row.articleName) {
            row.articleName = ''
          }
        }
        return {
          data: data,
          rootId: query.seriesId
        }
      })
    },
    methods: {
      saveButton () {
        this.$http.post('/v1/series/' + this.rootId, {
          param: JSON.stringify(this.data)
        }).then(res => {
          this.$Message.success('保存成功')
        }).catch(res => {
          this.$Message.success('保存失败')
        })
      },
      create (index, row) { // 创建
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
              const newRow = {
                nodeName: text,
                name: text,
                articleName: '',
                articleId: '',
                parentId: row.seriesId,
                level: row.level + 1
              }
              let prefix = ''
              for (let i = 0; i < newRow.level - 1; i++) {
                prefix += '--|'
              }
              newRow.nodeName = prefix + '  ' + newRow.nodeName
              let maxIndex = this.data.length
              for (let i = index + 1; i < this.data.length; i++) {
                if (this.data[i].level <= row.level) {
                  maxIndex = i
                  break
                }
              }
              this.data.splice(maxIndex, 0, newRow)
            }
          }
        })
      },
      edit (index, row) { // 修改
        let text = row.name
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: text,
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
              this.data[index].name = text
              let prefix = ''
              for (let i = 0; i < this.data[index].level - 1; i++) {
                prefix += '--|'
              }
              this.data[index].nodeName = prefix + '  ' + text
            }
          }
        })
      },
      remove (index, row) { // 删除一行
        this.data.splice(index, 1)
      },
      relationArticle (index, row) { // 关联文章
        this.selectedSeriesIndex = index
        this.isShowDialog = true
      },
      selectArticle () { // 选择文章后更新表格的数据
        this.isShowDialog = false
        for (let row of this.articles) {
          if (this.selectedArticleId === row.articleId) {
            this.data[this.selectedSeriesIndex].articleName = row.title
            this.data[this.selectedSeriesIndex].articleId = row.articleId
            break
          }
        }
        this.$refs.xyTable.refresh()
      },
      getArticle (text) { // 获得文章数据，选择文章时使用
        const param = {}
        if (text && text.length > 0 && text.length < 8) {
          const query = "title like '*" + text + "*'"
          param['search'] = encodeURIComponent(query)
          param['search_encode'] = true
        }
        param['page'] = 1
        param['rows'] = 20
        param['sort'] = 'title asc'
        this.selectLoading = true
        this.$http.get('/v1/article', {params: param}).then(response => {
          this.articles = response.data.rows
          this.selectLoading = false
        }).catch(response => {
          this.$Message.error('获得文章数据失败')
          this.selectLoading = false
        })
      }
    }
  }
</script>
