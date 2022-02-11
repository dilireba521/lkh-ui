<template>
  <form class="lk-form">
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: "lkForm",
  provide() {
    return { FormInstance: this };
  },
  props: {
    model: {
      type: Object,
    },
    labelWidth: {
      type: String,
    },
    labelPosition: {
      type: String,
      validator(val) {
        return ["left", "center", "right"].indexOf(val) > -1;
      },
      default: "right",
    },
  },
};
</script>