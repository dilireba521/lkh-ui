<template>
  <div
    @touchstart="handleMouseDown"
    @mousedown="handleMouseDown"
    class="lk-slider-bar"
  >
    <lk-tooltip :disabled="!showTooltip" :class="tooltipClass" placement="top">
      <span slot="content">{{ formatValue }}</span>
      <div class="lk-slider-bar_btn"></div>
    </lk-tooltip>
  </div>
</template>
<script>
export default {
  name: "lkSliderBar",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    tooltipClass: String,
  },
  computed: {
    showTooltip() {
      return this.$parent.showTooltip;
    },
    enableFormat() {
      return this.$parent.formatTooltip instanceof Function;
    },
    formatValue() {
      return (
        (this.enableFormat && this.$parent.formatTooltip(this.value)) ||
        this.value
      );
    },
  },
  data() {
    return {
      disabledTooltip: false,
    };
  },
  methods: {
    handleMouseDown() {
      window.addEventListener("mousemove", this.onDragging);
      window.addEventListener("mouseup", this.onDragEnd);
    },
    onDragging(e) {
      this.$parent.handleClick(e);
    },
    onDragEnd() {
      window.removeEventListener("mousemove", this.onDragging);
      window.removeEventListener("mouseup", this.onDragEnd);
    },
  },
};
</script>
