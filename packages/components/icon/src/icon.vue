<template>
  <i class="lk-icon" :class="iconClass"></i>
</template>
<script>
export default {
  name: "lkIcon",
  props: {
    name: String,
  },
  computed: {
    iconClass() {
      return this.name ? "lk-" + this.name : "";
    },
  },
};
</script>