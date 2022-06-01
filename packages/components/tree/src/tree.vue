<template>
  <div class="lk-tree">
    <lk-tree-node
      v-for="(item, index) in data"
      :node="item"
      :props="props"
      :show-checkbox="showCheckbox"
      :key="index"
    ></lk-tree-node>
    <div v-if="isEmpty">{{ emptyText }}</div>
  </div>
</template>
<script>
import LkTreeNode from "./tree-node.vue";

export default {
  name: "lkTree",
  components: { LkTreeNode },
  props: {
    data: {
      type: Array,
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "label",
          disabled: "disabled",
        };
      },
    },
    click: Function,
    change: Function, // 多选框选择事件
  },
  computed: {
    isEmpty() {
      return false;
    },
  },
  data() {
    return {};
  },
};
</script>