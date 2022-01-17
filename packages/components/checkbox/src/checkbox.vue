<template>
  <label :class="checkboxClass">
    <input
      v-if="parent"
      type="checkbox"
      :disabled="disabled || (parent && parent.disabled)"
      v-model="model"
      :value="label"
      class="lk-checkbox-input"
      :name="name"
      @change="handleChange"
    />
    <input
      v-else
      type="checkbox"
      :disabled="disabled"
      v-model="currentVal"
      class="lk-checkbox-input"
      :name="name"
      @change="handleChange"
    />
    <span class="lk-checkbox-wrap">
      <span class="lk-checkbox-wrap_inner"></span>
    </span>
    <span v-if="$slots.default || label" class="lk-checkbox-label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
import { findComponentParent } from "../../../utils/findComponent";

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
    indeterminate: Boolean,
  },
  watch: {
    value(val) {
      this.currentVal = val;
    },
    currentVal(val) {
      this.$emit("input", val);
    },
  },
  computed: {
    model: {
      get() {
        return this.parent.value;
      },
      set(val) {
        this.dispatch("lkCheckboxGroup", "input", [val]);
      },
    },
    parent() {
      return findComponentParent(this, "lkCheckboxGroup");
    },
    checkboxClass() {
      let _class = [
        "lk-checkbox",
        {
          "is-active":
            this.currentVal ||
            (this.parent && this.model && this.model.indexOf(this.label) > -1),
          "is-disabled": this.disabled || (this.parent && this.parent.disabled),
          "is-indeterminate":
            !this.disabled && !this.currentVal && this.indeterminate,
        },
      ];
      return _class;
    },
  },
  data() {
    return {
      currentVal: this.value,
    };
  },
  methods: {
    handleChange() {
      this.$emit("change", this.currentVal);
    },
  },
};
</script>