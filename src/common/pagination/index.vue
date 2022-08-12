<template>
  <section class="pagination" v-show="page.recordsTotal">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :layout="layout"
      :total="page.recordsTotal"
      :page-sizes="pageSizes"
    >
    </el-pagination>
  </section>
</template>
<script>
export default {
  name: 'pagination',
  props: {
    page: {
      type: Object,
      default() {
        return {
          pageSize: 10,
          currentPage: 1,
          recordsTotal: 0
        }
      }
    },
    layout: {
      type: String,
      default() {
        return 'total, prev, pager, next, jumper,sizes'
      }
    },
    small: {
      type: Boolean,
      default() {
        return false
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100, 150]
      }
    }
  },

  data() {
    return {}
  },

  methods: {
    handleCurrentChange(...args) {
      this.$emit('pageChange', args[0])
    },
    handleSizeChange(...args) {
      this.$emit('sizeChange', args[0])
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
