<template>
  <div class="lk-form-item" :class="itemClass">
    <label class="lk-form-item_label" :style="labelStyle">{{ label }}</label>
    <div class="lk-form-item_content" :style="contentStyle">
      <slot></slot>
      <transition>
        <div
          v-if="validateMessage && validateMessage.length > 0"
          class="lk-form-item_msg"
        >
          {{ validateMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
import AsyncValidator from "async-validator";

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
    },
  },
  computed: {
    fieldValue() {
      const model = this.FormInstance && this.FormInstance.model;
      if (!model || !this.prop) {
        return;
      }
      return model[this.prop];
    },
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

      let initValue = this.fieldValue;
      if (Array.isArray(initValue)) {
        initValue = [].concat(initValue);
      }
      Object.defineProperty(this, "initValue", {
        value: initValue,
      });
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

    //验证规则，默认trigger为blur行为
    validate(callback) {
      const rules = this.getRules();
      //未定义验证规则
      if ((!rules || rules.length === 0) && this.isRequired === undefined) {
        callback();
        return true;
      }

      const descriptor = {};
      descriptor[this.prop] = rules;
      const validator = new AsyncValidator(descriptor);
      const model = {};
      model[this.prop] = this.FormInstance.model[this.prop];
      validator.validate(
        model,
        { firstFields: true },
        (errors, invalidFields) => {
          this.validateMessage = errors ? errors[0].message : "";
          callback(this.validateMessage, invalidFields);
        }
      );
    },
    resetField() {
      if (!this.FormInstance.model) {
        // eslint-disable-next-line no-console
        console.warn("[Form]model is required for resetFields to work.");
        return;
      }
      if (!this.prop) {
        // eslint-disable-next-line no-console
        console.warn("[Form]prop is required for resetFields to work.");
        return;
      }
      this.validateMessage = "";
      let value = this.fieldValue;
      if (Array.isArray(value)) {
        this.FormInstance.model[this.prop] = [].concat(this.initValue);
      } else {
        this.FormInstance.model[this.prop] = this.initValue;
      }
    },
  },
  beforeDestroy() {
    this.dispatch("lkForm", "lk.form.removeField", [this]);
  },
};
</script>