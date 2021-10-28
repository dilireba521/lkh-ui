<template>
  <div class="lk-checkbox-group">
    <slot></slot>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";

export default {
  name: "lkCheckboxGroup",
  componentName: "lkCheckboxGroup",
  mixins: [Emitter],
  props: {
    value: {},
  },
  watch: {},
};
</script>