<template>
  <section :class="layoutClass">
    <slot></slot>
  </section>
</template>
<script>
export default {
  name: "lkLayout",
  props: {},
  computed: {
    layoutClass() {
      return ["lk-layout", { "is-has-sider": this.hasSider }];
    },
  },
  data() {
    return {
      hasSider: false,
    };
  },
  mounted() {
    this.findSider();
  },
  methods: {
    findSider() {
      for (let item of this.$children) {
        if (item.$options.name === "lkSider") {
          this.hasSider = true;
          break;
        }
      }
    },
  },
};
</script>