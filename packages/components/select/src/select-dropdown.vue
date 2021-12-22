<template>
  <div class="lk-select-dropdown" :style="dropdownStyle">
    <slot></slot>
  </div>
</template>
<script>
import Popper from "../../../utils/vue-popper";
export default {
  name: "lkSelectDropdown",
  componentName: "lkSelectDropdown",
  mixins: [Popper],
  props: {},
  computed: {
    dropdownStyle() {
      return Object.assign({}, this.style, {
        minWidth: this.minWidth,
      });
    },
  },
  watch: {
    "$parent.inputWidth"(val) {
      this.minWidth = val + "px";
    },
  },
  created() {
    this.$on("visible", (val) => {
      this.showPopper = val;
      this.$nextTick(() => {
        this.currentPopper = this.$el;
      });
    });
  },
  mounted() {
    this.parentPopper = this.$parent.$el;
    this.$on("updatePopper", () => {
      if (this.showPopper) this.updatePopper();
    });
  },
  data() {
    return {
      currentPlacement: "bottom-start",
      minWidth: "",
    };
  },
};
</script>
