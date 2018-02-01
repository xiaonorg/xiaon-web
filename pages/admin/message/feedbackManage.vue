<template>
  <div>
    <xy-table :columns="columns" url="/v1/feedback" ref="xyTable" :params="params">
      <Button @click="showDialog"><i class="fa fa-search"></i>查看</Button>
      <Button icon="close" @click="deleteData">删除</Button>
    </xy-table>
    <Modal
      :value="showModal"
      title="用户留言"
      @on-cancel="closeDialog">
      <Form :model="formItem" :label-width="40">
        <Form-item label="时间">
          <Input v-model="formItem.createDate" :maxlength="30" :readonly="true"/>
        </Form-item>
        <Form-item label="内容">
          <Input v-model="formItem.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}" :readonly="true"/>
        </Form-item>
      </Form>
      <div slot="footer">
        <div></div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    data () {
      return {
        formItem: {
          feedbackId: '',
          createDate: '',
          text: ''
        },
        showModal: false,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createDate',
            width: 150,
            sortable: 'custom'
          },
          {
            title: '内容',
            key: 'text',
            ellipsis: true
          }
        ],
        params: {
          sort: 'createDate desc'
        }
      }
    },
    methods: {
      showDialog () {
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length === 0) {
          this.$Message.warning('请选择一行')
          return
        }
        this.formItem.createDate = selectedData[0].createDate
        this.formItem.text = selectedData[0].text
        this.showModal = true
      },
      closeDialog () {
        this.showModal = false
      },
      deleteData () {
        let selectedData = this.$refs.xyTable.getSelection()
        if (selectedData.length === 0) {
          this.$Message.warning('请至少选择一行')
        } else {
          let feedbackIds = []
          for (let i = 0; i < selectedData.length; i++) {
            feedbackIds.push(selectedData[i].feedbackId)
          }
          this.$Modal.confirm({
            title: '系统提示',
            content: '<p>是否删除这些留言？</p>',
            loading: true,
            onOk: () => {
              this.$http.post('/v1/feedback.json', {
                method: 'delete',
                feedbackId: JSON.stringify(feedbackIds)
              }).then(response => {
                this.$Modal.remove()
                this.$Message.success('删除成功')
                this.$refs.xyTable.refresh()
              }, data => {
                this.$Modal.remove()
                let response = data.response
                if (response.data && response.data.message) {
                  this.message = response.data.message
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
