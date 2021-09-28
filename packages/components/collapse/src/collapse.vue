<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkCollapse",
  props: {
    accordion: Boolean, //手风琴
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  mounted() {
    this.$on("change", this.handleClickChange);
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
    },
    handleClickChange() {},
  },
};
</script>