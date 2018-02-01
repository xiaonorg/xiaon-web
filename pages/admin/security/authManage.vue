<template>
  <div>
    <xy-table :columns="columns" :showPage="false" url="/v1/permission" :params="params"></xy-table>
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    data () {
      return {
        columns: [
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
        }
      }
    }
  }
</script>
