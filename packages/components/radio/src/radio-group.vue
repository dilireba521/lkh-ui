<template>
  <div :class="radioGroupClass" :name="name">
    <slot></slot>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkRadioGroup",
  componentName: "lkRadioGroup",
  props: {
    value: {},
    type: {
      type: String,
      validator: (val) => ["button", "border"].indexOf(val) > -1,
    },
    size: {
      type: String,
      default: "big",
      validator: (val) => ["big", "middle", "small", "mini"].indexOf(val) > -1,
    },
    name: String,
  },
  computed: {
    radioGroupClass() {
      let _class = ["lk-radio-group", { [`is-${this.type}`]: !!this.type }];
      return _class;
    },
  },
  mixins: [Emitter],
  watch: {
    value(val) {
      this.$emit("change", val);
      this.broadcast("lkRadio", "initRadio", val);
    },
  },
  mounted() {
    this.broadcast("lkRadio", "initRadio", this.value);
  },
};
</script>