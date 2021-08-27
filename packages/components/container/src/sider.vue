<template>
  <aside class="lk-sider" :style="{ width }">
    <div class="lk-sider-child">
      <slot></slot>
    </div>
  </aside>
</template>
<script>
export default {
  name: "lkSider",
  props: {
    width: {
      type: [Number, String],
      default: "200px",
    },
  },
  computed: {},
};
</script>