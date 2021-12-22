<template>
  <div class="lk-select-group_wrap">
    <div class="lk-select-group_title">{{ label }}</div>
    <div class="lk-select-group">
      <slot>group</slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "lkOptionGroup",
  props: {
    label: String,
  },
};
</script>