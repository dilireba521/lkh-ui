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
      return [
        "lk-row",
        {
          [`lk-${this.type}`]: !!this.type,
          [`lk-align-${this.align}`]: !!this.align,
          [`lk-justify-${this.justify}`]: !!this.justify,
        },
      ];
    },
    gridStyle() {
      let style = {};
      if (this.gutter != 0) {
        style = {
          marginLeft: this.gutter / -2 + "px",
          marginRight: this.gutter / -2 + "px",
        };
      }
      return style;
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