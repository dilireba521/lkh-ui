
<template>
  <table class="lk-table-header" cellspacing="0" cellpadding="0" border="0">
    <colgroup v-if="columnsWidth.length > 0">
      <col v-for="(item, index) in columnsWidth" :key="index" :width="item" />
    </colgroup>
    <thead>
      <tr v-for="(items, idx) in headColumns" :key="idx">
        <th
          v-for="(item, index) in items"
          :rowspan="item.rowspan"
          :colspan="item.colspan"
          :key="index"
          :style="{
            textAlign:
              item.align || (item.type && item.type == 'selection' && 'center'),
          }"
          :class="thClass(item)"
        >
          <div class="cell" v-if="item.type == 'selection'">
            <lk-checkbox
              v-model="allCheck"
              @change="handleSelectAll"
              :indeterminate="isIndeterminate"
            ></lk-checkbox>
          </div>
          <div class="cell" v-else-if="item.type == 'index'">
            {{ item.label }}
          </div>
          <div class="cell" v-else>{{ item.label }}</div>
        </th>
        <!-- <th class="gutter"></th> -->
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
    fixed: {
      type: String,
      validator: (val) => ["left", "right"].indexOf(val) !== -1,
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
  mounted() {
    // console.log("header");
  },
  methods: {
    thClass(data) {
      let style = {};
      if (this.fixed) {
        if (this.fixed == "left") {
          this.$parent.leftData.indexOf(data) === -1 &&
            (style["is-hidden"] = true);
        } else {
          this.$parent.rightData.indexOf(data) === -1 &&
            (style["is-hidden"] = true);
        }
      }
      return style;
    },
    handleSelectAll() {
      this.isIndeterminate = false;
      this.$parent.handleSelectAll();
    },
  },
};
</script>
