<template>
  <div class="lk-checkbox-group">
    <slot></slot>
  </div>
</template>
<script >
import Emitter from "../../../utils/mixins/emitter";

export default {
  name: "lkCheckboxGroup",
  componentName: "lkCheckboxGroup",
  mixins: [Emitter],
  props: {
    value: {},
    disabled: Boolean,
  },
  watch: {
    value(val) {
      //TODO 数据变化考虑是否做change回调
      // eslint-disable-next-line no-console
      console.log(val);
    },
  },
};
</script>