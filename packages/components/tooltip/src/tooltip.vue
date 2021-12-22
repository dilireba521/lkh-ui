<template>
  <div
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    class="lk-tooltip"
  >
    <transition name="lk-fade-in">
      <div
        :style="tooltipStyle"
        ref="popper"
        class="lk-tooltip-content"
        v-if="showPopper && !disabled"
        :x-placement="currentPlacement"
      >
        <span :style="arrowStyle" class="lk-tooltip-content_arrow"></span>
        <slot name="content">{{ $slots.content || content }}</slot>
      </div>
    </transition>
    <slot></slot>
  </div>
</template>
<script>
import Popper from "../../../utils/vue-popper";
export default {
  name: "lkTooltip",
  mixins: [Popper],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    content: String,
  },
  computed: {
    arrowStyle() {
      let _style = {};
      const _placement = this.currentPlacement.split("-")[1];
      if (this.popperData && _placement) {
        var styleKey = Object.keys(this.popperData.arrowOffset)[0];
        _style[styleKey] = this.popperData.arrowOffset[styleKey] + "px";
      }
      return _style;
    },
    tooltipStyle() {
      return Object.assign({}, this.style, { zIndex: this._uid });
    },
  },
  data() {
    return {
      currentPlacement: "",
      timeout: null,
    };
  },
  mounted() {
    this.parentPopper = this.$el;
  },
  methods: {
    handleMouseenter() {
      if (this.disabled || (!this.$slots.content && !this.content)) return;
      this.showPop(true);
    },
    handleMouseleave() {
      if (this.disabled || (!this.$slots.content && !this.content)) return;
      this.showPop(false);
    },
    showPop(isShow) {
      this.showPopper = isShow;
      this.$nextTick(() => {
        this.currentPopper = this.$refs.popper;
      });
    },
  },
};
</script>