<template>
  <form class="lk-form">
    <slot></slot>
  </form>
</template>
<script>
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
};
</script>