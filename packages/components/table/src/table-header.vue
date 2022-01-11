
<template>
  <table class="lk-table-header" cellspacing="0" cellpadding="0" border="0">
    <colgroup v-if="columnsWidth.length > 0">
      <col v-for="(item, index) in columnsWidth" :key="index" :width="item" />
    </colgroup>
    <thead>
      <tr v-for="(items, idx) in headColumns" :key="idx">
        <th v-for="(item, index) in items" :key="index">
          <div class="cell">
            <lk-checkbox
              v-model="allCheck"
              @change="handleSelectAll"
              :indeterminate="isIndeterminate"
            ></lk-checkbox>
          </div>
          <div class="cell">header</div>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script>
import { LkCheckbox } from "../../checkbox";
export default {
  name: "lkTableHeader",
  props: {
    selectStatus: {
      type: String,
      default: "",
    },
  },
  watch: {
    selectStatus(val) {
      this.isIndeterminate = val === "someSelect" ? true : false;
      this.allCheck = val === "checked" ? true : false;
    },
  },
  computed: {
    columnsWidth() {
      return this.$parent.columnsWidth;
    },
    bodyColumn() {
      return this.$parent.bodyColumn;
    },
    headColumns() {
      return this.$parent.headColumns;
    },
  },
  components: { LkCheckbox },
  data() {
    return {
      isIndeterminate: false, //复选框不确定是否为选中状态
      allCheck: false, // 复选框为全选状态
    };
  },
  mounted() {},
  methods: {
    handleSelectAll() {
      this.isIndeterminate = false;
      this.$parent.handleSelectAll();
    },
  },
};
</script>
