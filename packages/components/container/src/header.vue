<template>
  <div class="lk-header" :style="{ height }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkHeader",
  props: {
    height: {
      type: [String, Number],
      default: "60px",
    },
  },
};
</script>