<template>
  <form class="lk-form">
    <slot></slot>
  </form>
</template>
<script>
import { mergeObject } from "../../../utils/util";
export default {
  name: "lkForm",
  componentName: "lkForm",
  provide() {
    return { FormInstance: this };
  },
  props: {
    model: {
      type: Object,
    },
    rules: {
      type: Object,
    },
    labelWidth: {
      type: String,
    },
    labelPosition: {
      type: String,
      validator(val) {
        return ["left", "center", "right"].indexOf(val) > -1;
      },
      default: "right",
    },
  },
  watch: {
    rules() {},
  },
  data() {
    return {
      fields: [],
    };
  },
  created() {
    this.$on("lk.form.addField", (field) => {
      if (field) {
        this.fields.push(field);
      }
    });
    this.$on("lk.form.removeField", (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    });
  },
  methods: {
    resetFields() {
      if (!this.model) {
        // eslint-disable-next-line no-console
        console.warn("[Form]model is required for resetFields to work.");
        return;
      }
      this.fields.forEach((field) => {
        field.resetField();
      });
    },
    validate(callback) {
      if (!this.model) {
        // eslint-disable-next-line no-console
        console.warn("[Form]model is required for validate to work!");
        return;
      }

      let promise;
      //if no callback, return promise
      if (typeof callback !== "function" && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      let valid = true;
      let count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      let invalidFields = {};
      this.fields.forEach((field) => {
        field.validate((message, field) => {
          if (message) {
            valid = false;
          }
          // 合并返回数据具体内容
          invalidFields = mergeObject({}, invalidFields, field);
          if (
            typeof callback === "function" &&
            ++count === this.fields.length
          ) {
            callback(valid, invalidFields);
          }
        });
      });

      if (promise) {
        return promise;
      }
    },
  },
};
</script>