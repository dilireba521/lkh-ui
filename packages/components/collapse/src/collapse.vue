<template>
  <div class="lk-collapse">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkCollapse",
  componentName: "lkCollapse",
  provide() {
    return {
      collapse: this,
    };
  },
  props: {
    accordion: Boolean, //手风琴
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },
  watch: {
    value(newV) {
      this.activeNames = [].concat(newV);
    },
  },
  data() {
    return {
      activeNames: [].concat(this.value), //数组
    };
  },
  created() {
    this.$on("item-click", this.handleClickChange);
  },
  methods: {
    handleClickChange(item) {
      if (this.accordion) {
        //将点击加入列表和移除列表
        let activeNames =
          this.activeNames && this.activeNames[0] === item.name
            ? ""
            : item.name;
        this.setActive(activeNames);
      } else {
        let index = this.activeNames.indexOf(item.name);
        if (index > -1) {
          this.activeNames.splice(index, 1);
        } else {
          this.activeNames.push(item.name);
        }
      }
    },
    setActive(activeNames) {
      activeNames = [].concat(activeNames);
      let val = this.accordion ? activeNames[0] : activeNames;
      this.activeNames = activeNames;
      this.$emit("input", val);
      this.$emit("change", this.activeNames);
    },
  },
};
</script>