<template>
  <div :class="dividerClass">
    <span class="lk-inner-text" v-if="$slots.default && type === 'horizontal'">
      <slot></slot>
    </span>
  </div>
</template>
<script>
export default {
  name: "lkDivider",
  props: {
    type: {
      type: String,
      default: "horizontal",
      validator(val) {
        return ["horizontal", "vertical"].indexOf(val) !== -1;
      },
    },
    contentPosition: {
      type: String,
      default: "left",
      validator(val) {
        return ["left", "center", "right"].indexOf(val) !== -1;
      },
    },
    dashed: Boolean,
  },
  computed: {
    dividerClass() {
      return [
        "lk-divider",
        `lk-divider-${this.type}`,
        `lk-divider-${this.contentPosition}`,
        { "is-dashed": this.dashed, nodivider: !this.$slots.default },
      ];
    },
  },
};
</script>