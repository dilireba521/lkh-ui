<template>
  <div :class="gridClass" :style="graidStyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkCol",
  props: {
    span: {
      type: Number,
      default: 24,
    },
    offset: [Number, String],
    push: [Number, String],
    pull: [Number, String],
    className: String,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
  },
  computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== "lkRow") {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    },
    gridClass() {
      let classList = [
        "lk-col",
        {
          [`lk-col-${this.span}`]: !!this.span,
          [`lk-col-offset-${this.offset}`]: !!this.offset,
          [`lk-col-push-${this.push}`]: !!this.push,
          [`lk-col-pull-${this.pull}`]: !!this.pull,
          [`${this.className}`]: !!this.className,
        },
      ];

      ["xs", "sm", "md", "lg", "xl"].forEach((size) => {
        if (typeof this[size] === "number") {
          classList.push(`lk-col-${size}-${this[size]}`);
        } else if (typeof this[size] === "object") {
          let props = this[size];
          Object.keys(props).forEach((prop) => {
            classList.push(
              prop !== "span"
                ? `lk-col-${size}-${prop}-${props[prop]}`
                : `lk-col-${size}-${props[prop]}`
            );
          });
        }
      });
      // console.log(classList);
      return classList;
    },
    graidStyle() {
      let style = {};
      if (this.gutter != 0) {
        style = {
          paddingLeft: this.gutter / 2 + "px",
          paddingRight: this.gutter / 2 + "px",
        };
      }
      return style;
    },
  },
  methods: {},
};
</script>