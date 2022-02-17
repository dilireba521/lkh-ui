<template>
  <section :class="inputWrapClass" :style="{ width: width }">
    <main
      v-if="type != 'textarea'"
      :class="inputClass"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <header class="lk-input-prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </header>
      <!-- 前缀icon -->
      <div class="lk-input_prefix" v-if="getPrefixVisible()">
        <i v-if="prefixIcon" class="is-icon" :class="prefixIcon"></i>
        <template v-if="!prefixIcon">
          <div class="is-icon">
            <slot name="prefix"></slot>
          </div>
        </template>
      </div>
      <input
        ref="input"
        class="lk-input_inner"
        v-bind="$attrs"
        :disabled="disabled"
        :readonly="readonly"
        :type="
          this.showPassword ? (passwordVisible ? 'password' : 'text') : type
        "
        :value="currentVal"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
      />
      <!-- 后缀icon -->
      <div class="lk-input_suffix" v-if="getSuffixVisible()">
        <template v-if="!suffixIcon || !showClear() || !showPwd()">
          <div class="is-icon"><slot name="suffix"></slot></div>
        </template>
        <i v-if="suffixIcon" class="is-icon" :class="suffixIcon"></i>
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
      <footer class="lk-input-append" v-if="$slots.append">
        <slot name="append"></slot>
      </footer>
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
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
      ></textarea>
      <span class="lk-input_count is-textarea" v-if="isWordLimitVisible">
        {{ textLength }}/{{ upperLimit }}
      </span>
    </main>
  </section>
</template>
<script>
import { isKorean } from "../../../utils/util";
import emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkInput",
  mixins: [emitter],
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
    prefixIcon: String,
    suffixIcon: String,
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    wordLimit: Boolean,
    showPassword: Boolean,
    width: {
      type: String,
      // default: "200px",
    },
    rows: {
      type: Number,
      default: 2,
    },
    //验证事件
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      this.currentVal = val;
      if (this.validateEvent) {
        this.dispatch("lkFormItem", "lk.form.change", [val]);
      }
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
          "is-suffix-icon": this.getSuffixVisible(),
          "is-prefix-icon": this.getPrefixVisible(),
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
      isComposing: false,
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
      if (this.isComposing) return;
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
      if (this.validateEvent) {
        this.dispatch("lkFormItem", "lk.form.blur", [this.value]);
      }
    },
    handleChange(e) {
      this.$emit("change", e.target.value);
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionUpdate(e) {
      const text = e.target.value;
      const lastCharacter = text[text.length - 1] || "";
      this.isComposing = !isKorean(lastCharacter);
    },
    handleCompositionEnd(e) {
      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(e);
      }
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
      return this.prefixIcon || this.$slots.prefix;
    },
    getSuffixVisible() {
      return (
        this.suffixIcon ||
        this.clearable ||
        this.wordLimit ||
        this.showPassword ||
        this.$slots.suffix
      );
    },
  },
};
</script>