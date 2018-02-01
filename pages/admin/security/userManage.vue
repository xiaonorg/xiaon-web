<template>
  <div>
    <xy-table :columns="columns" url="/v1/user" ref="xyTable">
      <Button icon="plus" @click="showDialog('create','新建')">新建</Button>
      <Button icon="edit" @click="showDialog('edit','修改')" >修改</Button>
      <Button icon="close" @click="deleteUser" >删除</Button>
    </xy-table>
    <xy-modal
      :value="showModal"
      :title="title"
      :loading="loading"
      @on-cancel="cancel"
      @on-ok="ok">
      <Form :model="formItem" :label-width="60" :rules="ruleValidate" ref="form">
        <Form-item label="用户名" prop="name">
          <Input v-model="formItem.name" :maxlength="30"/>
        </Form-item>
        <Form-item label="邮箱" prop="email">
          <Input v-model="formItem.email"    :maxlength="200"/>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="formItem.password" type="password"   :disabled="passwordEnabled" :maxlength="100"/>
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
          userId: '',
          email: '',
          name: '',
          password: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {type: 'string', min: 2, max: 30, message: '长度应该大于2并且小于30', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        showModal: false,
        title: '',
        operType: '',
        loading: true,
        passwordEnabled: true,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'name',
            sortable: 'custom'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '类型',
            key: 'userType',
            sortable: 'custom'
          },
          {
            title: '创建时间',
            key: 'createDate',
            sortable: 'custom'
          }
        ]
      }
    },
    methods: {
      cancel () {
        this.showModal = false
        this.$refs['form'].resetFields()
      },
      ok () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.loading = true
            if (this.operType === 'create') { // 创建
              this.$http.put('/v1/user', {
                name: this.formItem.name,
                email: this.formItem.email,
                password: this.formItem.password
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
              this.$http.post('/v1/user/' + this.formItem.userId, {
                name: this.formItem.name,
                email: this.formItem.email
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
          this.formItem.password = ''
          this.formItem.email = ''
          this.passwordEnabled = false
        } else {
          let selectedData = this.$refs.xyTable.getSelection()
          if (selectedData.length === 0) {
            this.$Message.warning('请选择一行')
            return
          }
          this.formItem.userId = selectedData[0].userId
          this.formItem.email = selectedData[0].email
          this.formItem.name = selectedData[0].name
          this.formItem.password = '1'
          this.passwordEnabled = true
        }
        this.loading = false
        this.title = modalTitle
        this.showModal = true
        this.operType = type
      },
      deleteUser () { // 删除
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length === 0) {
          this.$Message.warning('请选择一行')
          return
        }
        const userId = selectedData[0].userId
        this.$Modal.confirm({
          title: '系统提示',
          content: '<p>是否删除用户？</p>',
          loading: true,
          onOk: () => {
            this.$http.post('/v1/user/' + userId, {method: 'delete'}).then(res => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              this.$refs.xyTable.refresh()
            }).catch(res => {
              this.$Modal.remove()
              let {response} = res
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
</script>
