<template>
  <div
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @click.stop="handleClick"
    class="lk-dropdown"
  >
    <div class="lk-dropdown_header">
      <slot></slot>
    </div>
    <slot v-bind="$attrs" v-on="$listeners" name="dropdown"> </slot>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkDropdown",
  mixins: [Emitter],
  provide() {
    return {
      dropdown: this,
    };
  },
  props: {
    trigger: {
      type: String,
      default: "hover",
      validator(val) {
        return ["hover", "click"].indexOf(val) !== -1;
      },
    },
    zIndex: {
      type: Number,
      default: 999,
    },
  },
  watch: {
    visible(val) {
      this.broadcast("lkDropdownMenu", "visible", val);
    },
  },
  data() {
    return {
      timeout: null,
      visible: false,
    };
  },
  methods: {
    handleMouseenter() {
      if (this.trigger == "hover") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowMenu(true);
        }, 50);
      }
    },
    handleMouseleave() {
      if (this.trigger == "hover" && this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowMenu(false);
        }, 50);
      }
    },
    handleClick() {
      if (this.trigger == "click") {
        this.isShowMenu(true);
      }
    },
    isShowMenu(isShow) {
      this.visible = isShow;
      if (isShow) {
        document.addEventListener(
          "click",
          (e) => {
            this.closePanel(e, this.$el);
          },
          false
        );
      } else {
        document.removeEventListener(
          "click",
          (e) => {
            this.closePanel(e, this.$el);
          },
          false
        );
      }
    },
    //点击空白区域隐藏面板
    closePanel(e, elem) {
      e.stopPropagation();
      if (elem && !elem.contains(e.target)) {
        this.isShowMenu(false);
      }
    },
  },
};
</script>