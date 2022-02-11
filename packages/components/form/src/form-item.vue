<template>
  <div class="lk-form-item">
    <label class="lk-form-item_label" :style="labelStyle"> {{ label }}</label>
    <div class="lk-form-item_content" :style="contentStyle">
      <slot></slot>
      <div class="lk-form-item_msg"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "lkFormItem",
  inject: ["FormInstance"],
  props: {
    label: {
      type: String,
      default: "",
    },
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
    labelStyle() {
      const _labelWidth =
        this.labelWidth ||
        (this.FormInstance && this.FormInstance.labelWidth) ||
        "80px";
      let style = {
        width: _labelWidth,
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
};
</script>