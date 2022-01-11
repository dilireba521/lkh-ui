<template>
  <div class="lk-table">
    <div class="lk-table_box">
      <div class="lk-table_header">
        <table-header :selectStatus="selectChecked"></table-header>
      </div>
      <div class="lk-table_body">
        <table-body :data="tableData"></table-body>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import Emitter from "../../../utils/mixins/emitter";
import TableHeader from "./table-header.vue";
import TableBody from "./table-body.vue";
export default {
  name: "lkTable",
  mixins: [Emitter],
  components: { TableHeader, TableBody },
  props: {
    height: {
      type: [String, Number],
      default: "",
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    size: String,
    maxHeight: [String, Number],
  },
  data() {
    return {
      tableData: this.data || [],
      tableWidth: "0px",
      headColumns: [],
      bodyColumns: [],
      columnsWidth: [],
      selectChecked: "unSelect", // 全选状态 unSelect为全不选，someSelect选择了部分，checked全选
    };
  },
  methods: {
    handleSelectAll() {},
  },
};
</script>