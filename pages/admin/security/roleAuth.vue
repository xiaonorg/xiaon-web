<template>
  <div>
    <div>
      <span class="vertical-align-middle">选择角色：</span>
      <Select
        v-model="selectedRoleId"
        filterable
        remote
        :remote-method="getData"
        :loading="loading"
        @on-change="changeSelect"
        style="width:350px">
        <Option v-for="option in allData" :value="option.roleId" :key="option.roleId">{{option.name + ' | ' + option.description}}</Option>
      </Select>
    </div>
    <hr/>
    <xy-table :columns="columns" url="/v1/permission" ref="xyTable" :showPage="false" :params="params">
      <Button @click="updatePermission"><i class="fa fa-save"></i>保存</Button>
      <span style="margin-left:20px" class="vertical-align-middle">注：表格中选中的行表示角色拥有该权限</span>
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
          }, {
            title: '类型',
            key: 'type',
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
        selectedRoleId: '',
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
          const query = "name like '*" + text + "*' or description like '*" + text + "*'"
          param['search'] = encodeURIComponent(query)
          param['search_encode'] = true
        }
        param['page'] = 1
        param['rows'] = 20
        param['sort'] = 'name asc'
        this.loading = true
        this.$http.get('/v1/role.json', {params: param}).then(response => {
          this.allData = response.data.rows
          this.loading = false
        }).catch(response => {
          this.$Message.error('获得角色数据失败')
          this.loading = false
        })
      },
      changeSelect (roleId) { // 选择角色后刷新表格数据
        this.$http.get('/v1/role/' + roleId + '/permission', {page: 1, rows: 300}).then(response => {
          const permissioins = response.data.rows
          const tableRows = this.$refs.xyTable.getRows()
          this.$refs.xyTable.unSelectAll()
          for (let permission of permissioins) {
            for (let rowIndex in tableRows) {
              if (permission.name === tableRows[rowIndex].name) {
                this.$refs.xyTable.selectRow(rowIndex)
                break
              }
            }
          }
        }).catch(response => {
          this.$refs.xyTable.unSelectAll()
          this.$Message.error('获得权限数据失败')
        })
      },
      updatePermission () { // 更新角色的权限
        if (!this.selectedRoleId || this.selectedRoleId.length === 0) {
          this.$Message.warning('请选择一个角色')
        } else {
          let selectPermissions = []
          for (let row of this.$refs.xyTable.getSelection()) {
            selectPermissions.push(row.permissionId)
          }
          this.$http.post('/v1/role/' + this.selectedRoleId + '/permission', {permissionId: JSON.stringify(selectPermissions)}).then(response => {
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
