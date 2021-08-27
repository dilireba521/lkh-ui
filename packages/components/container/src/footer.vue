<template>
  <div class="lk-footer" :style="{ height }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkFooter",
  props: {
    height: {
      type: [String, Number],
      default: "60px",
    },
  },
};
</script>