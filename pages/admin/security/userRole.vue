<template>
  <div>
    <div>
      <span class="vertical-align-middle">选择用户：</span>
      <Select
        v-model="selectedUserId"
        filterable
        remote
        :remote-method="getData"
        :loading="loading"
        @on-change="changeSelect"
        style="width:350px">
        <Option v-for="option in allData" :value="option.userId" :key="option.userId">{{option.name}}</Option>
      </Select>
    </div>
    <hr/>
    <xy-table :columns="columns" url="/v1/role" ref="xyTable" :showPage="false" :params="params">
      <Button @click="updateRole"><i class="fa fa-save"></i>保存</Button>
      <span style="margin-left:20px" class="vertical-align-middle">注：表格中选中的行表示用户拥有该角色</span>
    </xy-table>
  </div>
</template>
<style scoped>
  hr {
    margin: 15px 0 8px 0;
    background-color: #e9eaec;
    height: 1px;
    border: none;
  }

  .vertical-align-middle {
    vertical-align: middle
  }
</style>
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
            title: '名称',
            key: 'name',
            sortable: 'custom'
          },
          {
            title: '描述',
            key: 'description',
            ellipsis: true
          }
        ],
        params: {
          sort: 'name asc',
          page: 1,
          rows: 300
        },
        tableUrl: '',
        selectedUserId: '',
        allData: [],
        loading: false
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData (text) {
        const param = {}
        if (text && text.length > 0 && text.length < 8) {
          const query = "name like '*" + text + "*'"
          param['search'] = encodeURIComponent(query)
          param['search_encode'] = true
        }
        param['page'] = 1
        param['rows'] = 20
        param['sort'] = 'name asc'
        this.loading = true
        this.$http.get('/v1/user', {params: param}).then(response => {
          this.allData = response.data.rows
          this.loading = false
        }).catch(response => {
          this.$Message.error('获得用户数据失败')
          this.loading = false
        })
      },
      changeSelect (userId) { // 选择用户后刷新表格数据
        this.$http.get('/v1/user/' + userId + '/role', {page: 1, rows: 300}).then(response => {
          const roles = response.data.rows
          const tableRows = this.$refs.xyTable.getRows()
          this.$refs.xyTable.unSelectAll()
          for (let role of roles) {
            for (let rowIndex in tableRows) {
              if (role.name === tableRows[rowIndex].name) {
                this.$refs.xyTable.selectRow(rowIndex)
                break
              }
            }
          }
        }).catch(response => {
          this.$refs.xyTable.unSelectAll()
          this.$Message.error('获得用户数据失败')
        })
      },
      updateRole () {
        if (!this.selectedUserId || this.selectedUserId.length === 0) {
          this.$Message.warning('请选择一个用户')
        } else {
          let selectRoles = []
          for (let row of this.$refs.xyTable.getSelection()) {
            selectRoles.push(row.roleId)
          }
          this.$http.post('/v1/user/' + this.selectedUserId + '/role', {roleId: JSON.stringify(selectRoles)}).then(response => {
            this.$Message.success('保存成功')
          }).catch(data => {
            let {response} = data
            if (response.data && response.data.message) {
              this.$Message.error(response.data.message)
            } else {
              this.$Message.error('保存失败')
            }
          })
        }
      }
    }
  }
</script>
