<template>
  <div class="lk-collapse-item" @click="change">
    <slot name="title">{{ title }}</slot>
    <collapse-transition>
      <div v-show="isShow">
        <slot></slot>
      </div>
    </collapse-transition>
  </div>
</template>
<style scoped>
.lk-collapse-item {
  /* background: red; */
}
</style>
<script>
import collapseTransition from "./collapse-transition";

export default {
  name: "collapseItem",
  components: { collapseTransition },
  props: {
    disabled: Boolean,
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      },
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
      this.$emit("change", this.isShow);
    },
  },
};
</script>