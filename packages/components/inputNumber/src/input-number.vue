<template>
  <section :class="inputNumberWrap" :style="{ width: width }">
    <main :class="inputNumberClass">
      <lk-input
        :value="currentVal"
        :width="width"
        :max="max"
        :min="min"
        :size="size"
        :disabled="disabled"
        v-bind="$attrs"
        type="number"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
      />
      <!-- 前缀 -->
      <div v-if="getPrefixVisible" class="lk-input-number_prefix">
        <span
          @click="handleChangeVal(false)"
          class="lk-input-number_button"
          :class="{ 'is-disabled': isReduceControl }"
        >
          <i class="lk-icon-minus"></i>
        </span>
      </div>
      <!-- 后缀 -->
      <div class="lk-input-number_suffix">
        <span
          v-if="getPrefixVisible"
          @click="handleChangeVal(true)"
          class="lk-input-number_button"
          :class="{ 'is-disabled': isAddControl }"
        >
          <i class="lk-icon-plus"></i>
        </span>
        <div v-else class="lk-input-number_button-wrap">
          <span
            @click="handleChangeVal(true)"
            class="lk-input-number_button is-up"
            :class="{ 'is-disabled': isAddControl }"
          >
            <i class="lk-icon-arrow-up"></i>
          </span>
          <span
            @click="handleChangeVal(false)"
            class="lk-input-number_button is-down"
            :class="{ 'is-disabled': isReduceControl }"
          >
            <i class="lk-icon-arrow-down"></i>
          </span>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
export default {
  name: "lkInputNumber",
  props: {
    value: Number,
    width: {
      type: String,
      default: "150px",
    },
    size: {
      type: String,
      default: "middle",
      validator: (val) => ["middle", "small", "mini"].indexOf(val) > -1,
    },
    disabled: Boolean,
    step: {
      type: Number,
      default: 1,
    },
    min: Number,
    max: Number,
    controlsPosition: {
      type: String,
      default: "both",
      validator: (val) => ["both", "right"].indexOf(val) > -1,
    },
  },
  computed: {
    isAddControl() {
      let isMax = false;
      if (typeof this.max == "number") {
        isMax = this.currentVal >= this.max;
      }
      return this.disabled || isMax;
    },
    isReduceControl() {
      let isMin = false;
      if (typeof this.min == "number") {
        isMin = this.currentVal <= this.min;
      }
      return this.disabled || isMin;
    },
    inputNumberClass() {
      let _class = [
        "lk-input-number",
        {
          "is-control-right": !this.getPrefixVisible,
          "is-disabled": this.disabled,
        },
      ];
      return _class;
    },
    inputNumberWrap() {
      let _class = [
        "lk-input-number-wrap",
        { [`is-${this.size}`]: this.size !== "middle" },
      ];
      return _class;
    },
    getPrefixVisible() {
      return this.controlsPosition == "both";
    },
    precision() {
      if (this.step === undefined) return 0;
      const stepString = this.step.toString();
      const dotPosition = stepString.indexOf(".");
      let _pre = 0;
      if (dotPosition !== -1) {
        _pre = stepString.length - dotPosition - 1;
      }
      return _pre;
    },
  },
  watch: {
    value(val) {
      this.currentVal = val;
    },
  },
  data() {
    return {
      currentVal: this.value,
    };
  },
  methods: {
    //点击改变数据默认增加
    handleChangeVal(state) {
      if (this.disabled) return;
      if (state) {
        if (this.isAddControl) return;
      } else {
        if (this.isReduceControl) return;
      }
      let _step = state ? this.step : -this.step;
      const _val = this.displayVal(_step);
      this.$emit("input", _val);
      this.$emit("change", _val);
    },
    displayVal(step) {
      let _currentVal = this.currentVal;
      if (this.precision !== 0 && _currentVal != undefined) {
        const _precisionFactor = Math.pow(10, this.precision);
        _currentVal =
          Math.round(_currentVal * _precisionFactor + step * _precisionFactor) /
          _precisionFactor;
      } else {
        _currentVal += step;
      }
      if (typeof this.max == "number") {
        _currentVal = _currentVal > this.max ? this.max : _currentVal;
      }
      if (typeof this.min == "number") {
        _currentVal = _currentVal < this.min ? this.min : _currentVal;
      }
      return _currentVal;
    },
    handleBlur(val) {
      this.$emit("blur", val);
    },
    handleFocus(val) {
      this.$emit("focus", val);
    },
    handleInput(val) {
      this.$emit("input", Number(val));
    },
    handleChange(val) {
      this.$emit("change", Number(val));
    },
  },
};
</script>