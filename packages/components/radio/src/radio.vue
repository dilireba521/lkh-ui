<template>
  <label :class="radioClass">
    <input
      v-model="currentVal"
      :value="label"
      :disabled="disabled"
      :change="change"
      :name="name"
      class="lk-radio-input"
      type="radio"
    />
    <span class="lk-radio-wrap" v-if="!isButton">
      <span class="lk-radio-wrap_inner"></span>
    </span>
    <span class="lk-radio-label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
import { findComponentParent } from "../../../utils/findComponent";
export default {
  name: "lkRadio",
  componentName: "lkRadio",
  mixins: [Emitter],
  props: {
    value: {},
    name: String,
    label: {},
    disabled: Boolean,
    size: {
      type: String,
      default: "big",
      validator: (val) => ["big", "middle", "small", "mini"].indexOf(val) > -1,
    },
  },
  watch: {
    value(val) {
      this.currentVal = val;
    },
    currentVal(val) {
      if (this.isGroup) this.dispatch("lkRadioGroup", "input", val);
      this.$emit("input", val);
    },
  },
  computed: {
    radioClass() {
      let _class = [
        "lk-radio",
        {
          "is-active": this.currentVal && this.currentVal === this.label,
          "is-disabled": this.disabled,
          [`lk-${this.radioSize}`]: this.isButton || this.isBorder,
        },
      ];
      return _class;
    },
  },
  data() {
    return {
      currentVal: this.value,
      isGroup: false,
      parent: findComponentParent(this, "lkRadioGroup"),
      isButton: false,
      isBorder: false,
      radioSize: this.size,
    };
  },
  created() {
    this.initData();
    this.$on("initRadio", (data) => {
      this.isGroup = true;
      this.currentVal = data;
    });
  },
  methods: {
    initData() {
      if (this.parent) {
        this.$nextTick(() => {
          this.radioSize = this.parent.size;
          if (this.parent.type == "button") this.isButton = true;
          if (this.parent.type == "border") this.isBorder = true;
        });
      }
    },
    change() {
      if (this.disabled) {
        return false;
      } else {
        this.$emit("change", this.currentVal);
      }
    },
  },
};
</script>