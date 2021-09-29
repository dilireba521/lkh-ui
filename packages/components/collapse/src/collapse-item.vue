<template>
  <div class="lk-collapse-item">
    <div class="lk-collapse_header" @click="change">
      <slot name="title">{{ title }}</slot>
      <i
        class="is-arrow lk-icon-arrow-right"
        :class="{ 'is-active': isShow }"
      ></i>
    </div>
    <lk-collapse-transition>
      <div class="lk-collapse-item_wrap" v-show="isShow">
        <div class="lk-collapse-item_content">
          <slot></slot>
        </div>
      </div>
    </lk-collapse-transition>
  </div>
</template>
<script>
import lkCollapseTransition from "./collapse-transition";
import emitter from "../../../utils/mixins/emitter";
export default {
  name: "collapseItem",
  mixins: [emitter],
  inject: ["collapse"],
  components: { lkCollapseTransition },
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
  computed: {
    isShow() {
      return this.collapse.activeNames.indexOf(this.name) > -1;
    },
  },
  methods: {
    change() {
      if (this.disabled) return;
      this.dispatch("lkCollapse", "item-click", this);
    },
  },
};
</script>