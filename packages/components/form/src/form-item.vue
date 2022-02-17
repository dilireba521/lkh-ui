<template>
  <div class="lk-form-item" :class="itemClass">
    <label class="lk-form-item_label" :style="labelStyle">{{ label }}</label>
    <div class="lk-form-item_content" :style="contentStyle">
      <slot></slot>
      <transition>
        <div v-if="valid" class="lk-form-item_msg">
          {{ validateMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
import lkVerify from "./lkVerify";
export default {
  name: "lkFormItem",
  componentName: "lkFormItem",
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
    return {
      valid: false,
      validateMessage: "",
      formModel: "",
    };
  },
  mounted() {
    if (this.prop) {
      this.dispatch("lkForm", "lk.form.addField", [this]);
      this.addValidateEvents();
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
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules.filter((rule) => {
        if (!rule.trigger || trigger === "") return true;
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        } else {
          return rule.trigger === trigger;
        }
      });
    },
    //验证规则，默认trigger为blur行为
    validate(trigger) {
      const rules = this.getFilteredRule(trigger);

      //未定义验证规则
      if ((!rules || rules.length === 0) && this.isRequired === undefined) {
        return true;
      }

      this.formModel = this.FormInstance.model;
      this.formRules = this.FormInstance.rules || this.rules;
      if (this.formModel && this.formRules && this.prop !== "") {
        let obj = new lkVerify(rules).single(this.formModel[this.prop]);
        if (!obj.valid) {
          this.validateMessage = obj.message;
        }
        this.valid = !obj.valid;
      }
    },
    onFieldBlur() {
      this.validate("blur");
    },
    onFieldChange() {
      this.validate("change");
    },
    //添加验证事件
    addValidateEvents() {
      const rules = this.getRules();
      if (rules.length || this.required !== undefined) {
        this.$on("lk.form.blur", this.onFieldBlur);
        this.$on("lk.form.change", this.onFieldChange);
      }
    },
  },
  beforeDestroy() {
    this.dispatch("lkForm", "lk.form.removeField", [this]);
  },
};
</script>