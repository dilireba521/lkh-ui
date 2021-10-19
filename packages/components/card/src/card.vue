<template>
  <div class="lk-card" :class="cardClass">
    <div class="lk-card_header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="lk-card_body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "lkCard",
  props: {
    header: String,
    shadow: {
      type: String,
      default: "always",
      validator(val) {
        return ["always", "hover", "never"].indexOf(val) !== -1;
      },
    },
    bodyStyle: {},
  },
  computed: {
    cardClass() {
      let style = [];
      style = [`is-${this.shadow}`];
      return style;
    },
  },
};
</script>