<template>
  <div
    class="lk-select-option"
    :class="{ 'is-disabled': disabled, 'is-selected': itemSelected }"
    @click="handleClick"
    v-show="visible"
  >
    {{ currentLabel }}
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkOption",
  componentName: "lkOption",
  inject: ["select"],
  mixins: [Emitter],
  props: {
    value: {
      require: true,
    },
    label: [String, Number],
    disabled: Boolean,
  },
  computed: {
    itemSelected() {
      if (this.select.multiple) {
        return this.select.value.indexOf(this.value) > -1;
      } else {
        return this.select.value === this.value;
      }
    },
    isObject() {
      return (
        Object.prototype.toString.call(this.value).toLowerCase() ===
        "[object object]"
      );
    },
    currentLabel() {
      return this.label || (this.isObject ? "" : this.value);
    },
  },
  created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;
    this.$on("queryChange", this.queryChange);
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.dispatch("lkSelect", "handleOptionClick", [this]);
      }
    },
    queryChange(query) {
      this.visible = new RegExp(query, "i").test(this.label);
      !this.visible && this.select.filteredOptionsCount--;
    },
  },
};
</script>
