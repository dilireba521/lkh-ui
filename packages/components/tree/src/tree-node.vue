<template>
  <div class="lk-tree-node">
    <div class="lk-tree-node_content">
      <i :class="iconClass" class="lk-icon-caret-right"></i>
      <lk-checkbox v-if="showCheckbox"></lk-checkbox>
      {{ node[props.label] }}
    </div>
    <lk-collapse-transition>
      <div v-if="node.isLeaf" class="lk-tree-node_children">
        <lk-tree-node
          v-for="(item, index) in node[props.children]"
          :node="item"
          :props="props"
          :show-checkbox="showCheckbox"
          :key="index"
        ></lk-tree-node>
      </div>
    </lk-collapse-transition>
  </div>
</template>
<script>
export default {
  name: "lkTreeNode",
  props: {
    node: Object,
    props: Object,
    showCheckbox: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconClass() {
      const _class = {
        "is-leaf": !this.node.isLeaf,
        "is-expand": false,
      };
      return _class;
    },
  },
  created() {
    this.formateNode();
  },
  methods: {
    formateNode() {
      this.node.isLeaf = this.node[this.props.children]?.length > 0;
    },
  },
};
</script>