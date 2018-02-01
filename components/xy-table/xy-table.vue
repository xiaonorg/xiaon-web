<template>
  <div>
    <div class="xy-table">
      <div class="xy-table-button">
        <slot></slot>
      </div>
      <!--<div class="xy-table-search">
          <Input placeholder="请输入..." v-model.trim="searchText" @on-enter="search" :maxlength="15"  style="width: 170px"/>
          --ios-refresh-empty
          <Button icon="refresh" title="刷新" @click="refresh"/>
      </div>-->
      <div class="xy-table-container">
        <Table ref="table" :data="rows" :columns="columns" @on-sort-change="changeSort" stripe border></Table>
      </div>
      <div class="xy-table-footer" v-if="showPage">
        <div>
          <Page :total="totalSize" :current="currentPage" :page-size="pageSize"
                :page-size-opts="pageSizeOption"
                @on-change=" changPage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .xy-table-button {
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 30px;
    float: left;
  }

  .xy-table-button button{
    margin-right: 0.5em;
  }

  .xy-table-search {
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 30px;
    float: right;
    display: table;
  }

  .xy-table-search > div {
    display: table-cell;
  }

  .xy-table-search > input {
    display: table-cell;
  }

  .xy-table-container {
    clear: both;
  }

  .xy-table-footer {
    margin: 10px 0;
    overflow: hidden;
  }

  .xy-table-footer > div {
    float: right;
  }
</style>

<script>
  export default {
    props: {
      columns: { // 表格的列信息
        type: Array,
        required: true
      },
      url: { // 访问后台的url
        type: String
      },
      data: { // 表格的数据
        type: Array
      },
      showPage: { // 是否显示分页栏
        type: Boolean,
        default: true
      },
      params: { // 请求后台时附带的参数
        type: Object,
        default: function () {
          return {}
        },
        required: false
      }
    },
    data () {
      return {
        totalSize: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizeOption: [10, 20, 50],
        searchText: '',
        sortField: '',
        sortOrder: 'asc',
        rows: []
      }
    },
    created: function () { // 在创建组件的时候获得初始数据
      if (this.url && this.url.length !== 0) { // 如果设置了url，从后台获得数据
        this.$http.get(this.url, {params: this.params, headers: {'Accept': 'application/json'}}).then(response => {
          this.totalSize = response.data.total
          if (this.totalSize > 0) {
            this.rows = response.data.rows
          }
        })
      } else if (this.data) { // 如果设置了数据
        this.rows = this.data
      }
    },
    methods: {
      changPage (currentPage) { // 切换分页
        this.currentPage = currentPage
        this.refresh()
      },
      changePageSize (pageSize) { // 修改页大小
        this.pageSize = pageSize
        this.refresh()
      },
      changeSort (column) { // 排序
        this.sortField = column.key
        this.sortOrder = column.order
        this.refresh()
      },
      refresh () { // 刷新获得数据
        if (!this.url || this.url.length === 0) {
          return
        }
        const queryParam = {}
        // 开始记录
        queryParam['page'] = this.currentPage
        // 每页的数量
        queryParam['rows'] = this.pageSize
        // 搜索文本
        if (this.searchText.length > 0) {
          const query = "name like '*" + this.searchText + "*' or description like '*" + this.searchText + "*'"
          queryParam['search'] = encodeURIComponent(query)
          queryParam['search_encode'] = true
        }
        // 加入父组件提供的参数
        for (let name in this.params) {
          queryParam[name] = this.params[name]
        }
        // 排序
        if (this.sortField && this.sortField.length > 0) {
          queryParam['sort'] = this.sortField + ' ' + this.sortOrder
        }
        this.$http.get(this.url, {
          params: queryParam,
          headers: {'Accept': 'application/json'}
        }).then(response => {
          this.rows = response.data.rows
          this.totalSize = response.data.total
        }).catch(response => {
          this.rows = []
          this.totalSize = 0
        })
      },
      getSelection () { // 获得选中的数据
        return this.$refs.table.getSelection()
      },
      selectAll () { // 选择所有行
        this.$refs.table.selectAll(true)
      },
      unSelectAll () { // 取消所有选择的行
        this.$refs.table.selectAll(false)
      },
      selectRow (index) { // 选择一行
        this.$refs.table.toggleSelect(index)
      },
      getRows () { // 取得表格的所有数据
        return this.rows
      }
    },
    watch: {
      url: function (newurl) { // 如果url发生变化，则更新表格数据
        this.refresh()
      }
    }
  }
</script>
