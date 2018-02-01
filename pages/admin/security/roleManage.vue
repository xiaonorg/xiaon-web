<template>
  <div>
    <xy-table :columns="columns" url="/v1/role" ref="xyTable" :params="params">
      <Button icon="plus" @click="showDialog('create','新建')">新建</Button>
      <Button icon="edit" @click="showDialog('edit','编辑')">编辑</Button>
      <Button icon="close" @click="deleteData">删除</Button>
    </xy-table>
    <xy-modal
      :value="showModal"
      :title="title"
      :loading="loading"
      @on-cancel="cancel"
      @on-ok="ok">
      <Form :model="formItem" :label-width="60" :rules="ruleValidate" ref="form">
        <Form-item label="名称" prop="name">
          <Input v-model="formItem.name" :maxlength="30"/>
        </Form-item>
        <Form-item label="描述">
          <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 :maxlength="200"/>
        </Form-item>
      </Form>
    </xy-modal>
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    data () {
      return {
        formItem: {
          roleId: '',
          name: '',
          description: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {type: 'string', min: 2, max: 30, message: '长度应该大于2并且小于30', trigger: 'blur'}
          ]
        },
        showModal: false,
        title: '',
        operType: '',
        loading: true,
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
          sort: 'name asc'
        }
      }
    },
    methods: {
      cancel () {
        this.showModal = false
        this.$refs['form'].resetFields()
      },
      ok () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.operType === 'create') { // 创建角色
              this.$http.put('/v1/role', {
                name: this.formItem.name,
                description: this.formItem.description
              }).then(response => {
                this.showModal = false
                this.$Message.success('创建成功')
                this.$refs.xyTable.refresh()
              }).catch(res => {
                this.loading = false
                let response = res.response
                if (response.data && response.data.message) {
                  this.$Message.error(response.data.message)
                } else {
                  this.$Message.error('创建失败')
                }
              })
            } else { // 修改
              this.$http.post('/v1/role/' + this.formItem.roleId, {
                name: this.formItem.name,
                description: this.formItem.description
              }).then(response => {
                this.showModal = false
                this.$Message.success('修改成功')
                this.$refs.xyTable.refresh()
              }).catch(res => {
                this.loading = false
                let response = res.response
                if (response.data && response.data.message) {
                  this.$Message.error(response.data.message)
                } else {
                  this.$Message.error('修改失败')
                }
              })
            }
          }
        })
      },
      showDialog (type, modalTitle) { // 显示对话框
        if (type === 'create') {
          this.formItem.name = ''
          this.formItem.description = ''
        } else {
          let selectedData = this.$refs.xyTable.getSelection()
          if (selectedData.length === 0) {
            this.$Message.warning('请选择一行')
            return
          }
          this.formItem.roleId = selectedData[0].roleId
          this.formItem.name = selectedData[0].name
          this.formItem.description = selectedData[0].description
        }
        this.loading = false
        this.title = modalTitle
        this.showModal = true
        this.operType = type
      },
      deleteData () { // 删除数据
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length === 0) {
          this.$Message.warning('请至少选择一行')
        } else {
          let roleId = []
          for (let i = 0; i < selectedData.length; i++) {
            roleId.push(selectedData[i].roleId)
          }
          this.$Modal.confirm({
            title: '系统提示',
            content: '<p>是否删除这些角色？</p>',
            loading: true,
            onOk: () => {
              this.$http.post('/v1/role', {method: 'delete', roleId: JSON.stringify(roleId)}).then(response => {
                this.$Modal.remove()
                this.$Message.success('删除成功')
                this.$refs.xyTable.refresh()
              }).catch(data => {
                this.$Modal.remove()
                let {response} = data
                if (response.data && response.data.message) {
                  this.$Message.error(response.data.message)
                } else {
                  this.$Message.error('删除失败')
                }
              })
            }
          })
        }
      }
    }
  }
</script>
