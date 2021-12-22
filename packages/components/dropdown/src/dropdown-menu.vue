<template>
  <transition name="lk-zoom-in-top">
    <div :style="menuStyle" v-if="showPopper" class="lk-dropdown-menu">
      <dl class="lk-dropdown-item_box">
        <slot></slot>
      </dl>
    </div>
  </transition>
</template>
<script>
import Popper from "../../../utils/vue-popper";
export default {
  name: "lkDropdownMenu",
  componentName: "lkDropdownMenu",
  mixins: [Popper],
  inject: ["dropdown"],
  props: {
    width: { type: String, default: "auto" },
  },
  computed: {
    menuStyle() {
      return Object.assign({}, this.style, {
        width: this.width,
        "z-index": this.dropdown.$props.zIndex,
      });
    },
  },
  data() {
    return {
      currentPlacement: "bottom-start",
    };
  },
  mounted() {
    this.parentPopper = this.dropdown.$el;
  },
  created() {
    this.$on("visible", (val) => {
      this.showPopper = val;
      this.$nextTick(() => {
        this.currentPopper = this.$el;
      });
    });
  },
};
</script>