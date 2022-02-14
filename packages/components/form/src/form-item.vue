<template>
  <div class="lk-form-item" :class="itemClass">
    <label class="lk-form-item_label" :style="labelStyle">{{ label }}</label>
    <div class="lk-form-item_content" :style="contentStyle">
      <slot></slot>
      <div class="lk-form-item_msg"></div>
    </div>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkFormItem",
  mixins: [Emitter],
  inject: ["FormInstance"],
  props: {
    required: Boolean,
    prop: String,
    rules: [Object, Array],
    label: String,
    labelWidth: {
      type: String,
      default: "",
    },
    labelPosition: {
      type: String,
      validator(val) {
        return ["left", "center", "right"].indexOf(val) > -1;
      },
      default: "right",
    },
  },
  computed: {
    isRequired() {
      let _isRequired = false;
      let rules = this.getRules();
      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            _isRequired = true;
            return false;
          }
          return true;
        });
      }
      return _isRequired;
    },
    itemClass() {
      let _class = {
        "is-required": this.isRequired || this.required,
      };

      return _class;
    },
    labelStyle() {
      const _labelWidth =
        this.labelWidth ||
        (this.FormInstance && this.FormInstance.labelWidth) ||
        "80px";
      let style = {
        width: _labelWidth,
        textAlign:
          this.labelPosition ||
          (this.FormInstance && this.FormInstance.labelPosition),
      };
      return style;
    },
    contentStyle() {
      const _labelWidth =
        this.labelWidth ||
        (this.FormInstance && this.FormInstance.labelWidth) ||
        "80px";

      let style = {
        marginLeft: _labelWidth,
      };
      return style;
    },
  },
  data() {
    return {};
  },
  mounted() {
    if (this.prop) {
      this.dispatch("lkForm", "lk.form.addField", [this]);
    }
  },
  methods: {
    //获取当前实例项表单验证规则，
    getRules() {
      let formRules = this.FormInstance ? this.FormInstance.rules : null;
      const selfRules = this.rules;
      const requiredRule =
        this.required !== undefined ? { required: !!this.required } : [];
      if (this.prop && formRules && formRules.hasOwnProperty(this.prop)) {
        formRules = formRules[this.prop];
      } else {
        formRules = [];
      }
      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
  },
  beforeDestroy() {
    this.dispatch("lkForm", "lk.form.removeField", [this]);
  },
};
</script>