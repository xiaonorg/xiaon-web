<template>
  <Modal
    :value="value"
    :title="title"
    :mask-closable="false"
    @on-cancel="cancel">
    <slot></slot>
    <template slot="footer">
      <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="cancel"><span>取消</span></button>
      <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large"
              v-bind:class="{ 'ivu-btn-loading': loading }" @click="ok">
        <i class="ivu-load-loop ivu-icon ivu-icon-load-c" v-show="loading"></i>
        <span>确定</span></button>
    </template>
  </Modal>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      cancel () {
        this.$emit('on-cancel')
      },
      ok () {
        this.$emit('on-ok')
      }
    }
  }
</script>
