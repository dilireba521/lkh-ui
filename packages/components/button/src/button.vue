<template>
  <div class="lk-button">
    <slot>hello button</slot>
  </div>
</template>
<script>
export default {
  name: 'lk-button',
  props: {
    type: String
  }
}
</script>
 
<style scoped>
  .lk-button {
      display: inline-block;
      padding: 3px 6px;
      background: rgb(138, 133, 133);
      color: #fff;
  }
</style>
 