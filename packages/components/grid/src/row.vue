<template>
  <div :class="gridClass" :style="gridStyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkRow",
  props: {
    type: {
      type: String,
      default: "",
    },
    align: {
      type: String,
      default: "",
    },
    gutter: {
      type: Number,
      default: 0,
    },
    justify: {
      type: String,
      default: "",
    },
  },
  computed: {
    gridClass() {
      return "";
    },
    gridStyle() {
      return "";
    },
  },
  watch: {
    gutter(val) {
      this.updateGutter(val);
    },
  },
  methods: {
    updateGutter(val) {
      this.$children.forEach((child) => {
        if (child.$options.name == "lkCol" && val != 0) {
          child.gutter = val;
        }
      });
    },
  },
};
</script>