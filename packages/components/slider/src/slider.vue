<template>
  <div class="lk-slider" :class="{ 'is-disabled': disabled }">
    <div ref="slider" @click="handleClick" class="lk-slider_runway">
      <div :style="processStyle" class="lk-slider-process"></div>
      <lk-slider-bar
        :style="barStyle"
        v-model="currentVal"
        @change="emitChange"
        :tooltipClass="tooltipClass"
      ></lk-slider-bar>
    </div>
  </div>
</template>
<script>
import lkSliderBar from "./slider-bar.vue";
export default {
  name: "lkSlider",
  components: { lkSliderBar },
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: 0,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    tooltipClass: String,
    formatTooltip: Function,
  },
  computed: {
    processStyle() {
      let _style = {
        right:
          (1 - (this.currentVal - this.min) / (this.max - this.min)) * 100 +
          "%",
      };
      return _style;
    },
    barStyle() {
      let _style = {
        left:
          ((this.currentVal - this.min) / (this.max - this.min)) * 100 + "%",
      };
      return _style;
    },
    precision() {
      if (this.step) {
        const stepString = this.step.toString();
        const dotPosition = stepString.indexOf(".");
        let _pre = 0;
        if (dotPosition !== -1) {
          _pre = stepString.length - dotPosition - 1;
        }
        return _pre;
      }
      return 0;
    },
    currentVal: {
      get() {
        if (this.value > this.max) {
          return this.max;
        } else if (this.value < this.min) {
          return this.min;
        }
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      sliderSize: 1,
    };
  },
  mounted() {
    this.resetSize();
    window.addEventListener("resize", this.resetSize);
  },
  methods: {
    handleClick(e) {
      if (this.disabled) return;
      this.resetSize();
      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      this.setPosition(
        ((e.clientX - sliderOffsetLeft) / this.sliderSize) * 100
      );
      this.emitChange();
    },
    emitChange() {
      this.$nextTick(() => {
        this.$emit("change", this.currentVal);
      });
    },
    setPosition(percent) {
      if (percent < 0) {
        percent = 0;
      } else if (percent > 100) {
        percent = 100;
      }
      //每一步长度百分比
      const lengthPerStep = 100 / ((this.max - this.min) / this.step);
      //有效步数
      const steps = Math.round(percent / lengthPerStep);
      //实际数据
      let value =
        steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
      this.currentVal = parseFloat(value.toFixed(this.precision));
    },
    resetSize() {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider.clientWidth;
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resetSize);
  },
};
</script>
