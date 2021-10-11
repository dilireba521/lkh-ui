<template>
  <transition name="lk-zoom-in-top">
    <div :style="style" v-if="showPopper" class="lk-dropdown-menu">
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
  data() {
    return {};
  },
  mounted() {
    this.parentPopper = this.dropdown.$el;
  },
  created() {
    this.$on("visible", (val) => {
      this.showPopper = val;
    });
  },
  methods: {},
};
</script>