<template>
  <div v-show="active" :aria-disabled="disabled" class="lk-tabs-pane">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "lkTabsPane",
  componentName: "lkTabsPane",
  props: {
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      },
    },
    label: String,
    disabled: Boolean,
  },
  computed: {
    active() {
      const active = this.$parent.activeVal === this.name;
      return active;
    },
  },
  data() {
    return {};
  },
};
</script>