<template>
  <section :class="inputWrapClass" :style="{ width: width }">
    <header class="lk-input-prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </header>
    <main
      v-if="type != 'textarea'"
      :class="inputClass"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <!-- 前缀icon -->
      <div class="lk-input_prefix" v-if="getPrefixVisible()">
        <i v-if="prefix" class="is-icon" :class="prefix"></i>
      </div>
      <input
        ref="input"
        class="lk-input_inner"
        v-bind="$attrs"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :type="
          this.showPassword ? (passwordVisible ? 'password' : 'text') : type
        "
        :value="currentVal"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @input="handleInput"
      />
      <!-- 后缀icon -->
      <div class="lk-input_suffix" v-if="getSuffixVisible()">
        <i v-if="suffix" class="is-icon" :class="suffix"></i>
        <i
          v-if="showClear()"
          @click="clear"
          class="is-icon lk-input_icon lk-icon-circle-close"
        ></i>
        <i
          v-if="showPwd()"
          @click="handleChangePasswordVisible"
          class="is-icon lk-input_icon lk-icon-view"
        ></i>
        <span class="lk-input_count" v-if="isWordLimitVisible">
          {{ textLength }}/{{ upperLimit }}
        </span>
      </div>
    </main>
    <main
      v-else
      :class="inputClass"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <textarea
        ref="textarea"
        class="lk-textarea_inner"
        v-bind="$attrs"
        :rows="rows"
        :value="currentVal"
        :disabled="disabled"
        :readonly="readonly"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @input="handleInput"
      ></textarea>
      <span class="lk-input_count is-textarea" v-if="isWordLimitVisible">
        {{ textLength }}/{{ upperLimit }}
      </span>
    </main>
    <footer class="lk-input-append" v-if="$slots.append">
      <slot name="append"></slot>
    </footer>
  </section>
</template>
<script>
export default {
  name: "lkInput",
  props: {
    type: {
      type: String,
      default: "text",
    },
    size: {
      type: String,
      default: "middle",
      validator: (val) => ["middle", "small", "mini"].indexOf(val) > -1,
    },
    value: [String, Number],
    max: Number,
    min: Number,
    prefix: String,
    suffix: String,
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    wordLimit: Boolean,
    showPassword: Boolean,
    autocomplete: {
      type: String,
      default: "off",
    },
    width: {
      type: String,
      default: "200px",
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  watch: {
    value(val) {
      this.currentVal = val;
    },
  },
  computed: {
    textLength() {
      if (typeof this.value === "number") {
        return String(this.value).length;
      }
      return (this.value || "").length;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    isWordLimitVisible() {
      return (
        this.wordLimit &&
        (this.type === "text" || this.type === "textarea") &&
        !this.showPassword &&
        this.$attrs.maxlength &&
        !this.readonly
      );
    },
    inputWrapClass() {
      let _class = [
        "lk-input-wrap",

        {
          "is-prepend": !!this.$slots.prepend,
          "is-append": !!this.$slots.append,
          [`is-${this.size}`]: this.size != "middle",
        },
      ];
      return _class;
    },
    inputClass() {
      let _class = [
        "lk-input",
        {
          "is-suffix": this.getSuffixVisible(),
          "is-prefix": this.getPrefixVisible(),
        },
      ];
      return _class;
    },
    nativeInputVal() {
      return this.value === null || this.value === undefined
        ? ""
        : String(this.value);
    },
  },
  data() {
    return {
      hovering: false,
      focused: false,
      passwordVisible: true,
      currentVal: this.value,
    };
  },
  mounted() {},
  methods: {
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
    handleChangePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
    handleInput(e) {
      if (e.target.value === this.currentVal) return;
      this.$emit("input", e.target.value);
      this.$nextTick(this.setNativeInpute());
    },
    handleFocus(e) {
      this.focused = true;
      this.$emit("focus", e);
    },
    handleBlur(e) {
      this.focused = false;
      this.$emit("blur", e);
    },
    handleChange(e) {
      this.$emit("change", e.target.value);
    },
    setNativeInpute() {
      const _input = this.getInput();
      if (!_input) return;
      if (_input.value === this.nativeInputVal) return;
      _input.value = this.nativeInputVal;
    },

    showClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.nativeInputVal &&
        (this.focused || this.hovering)
      );
    },
    showPwd() {
      return (
        this.showPassword &&
        !this.disabled &&
        !this.readonly &&
        (!!this.nativeInputVal || this.focused)
      );
    },
    clear() {
      this.currentVal = "";
      this.$emit("input", "");
      this.$emit("change", "");
      this.$emit("clear");
    },
    getPrefixVisible() {
      return this.prefix;
    },
    getSuffixVisible() {
      return (
        this.suffix || this.clearable || this.wordLimit || this.showPassword
      );
    },
  },
};
</script>