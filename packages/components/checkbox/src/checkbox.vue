<template>
  <label :class="checkboxClass">
    <input
      type="checkbox"
      :disabled="disabled"
      v-model="currentVal"
      class="lk-checkbox-input"
      :name="name"
      :change="handleChange"
    />
    <span class="lk-checkbox-wrap">
      <span class="lk-checkbox-wrap_inner"></span>
    </span>
    <span class="lk-checkbox-label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";

export default {
  name: "lkCheckbox",
  componentName: "lkCheckbox",
  mixins: [Emitter],
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    // size:String 暂时不考虑支持
  },
  watch: {
    value(val) {
      this.currentVal = val;
    },
    currentVal(val) {
      if (this.isGroup) this.dispatch("lkCheckboxGroup", "input", val);

      this.$emit("input", val);
    },
  },
  computed: {
    checkboxClass() {
      let _class = [
        "lk-checkbox",
        { "is-active": this.currentVal, "is-disabled": this.disabled },
      ];
      return _class;
    },
  },
  data() {
    return {
      isGroup: false,
      currentVal: this.value,
    };
  },
  methods: {
    handleChange() {
      console.log(3);

      this.$emit("change", this.currentVal);
    },
  },
};
</script>