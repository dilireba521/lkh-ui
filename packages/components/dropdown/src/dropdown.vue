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
  componentName: "lkDropdown",
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
      default: 1,
    },
    hideOnClick: {
      type: Boolean,
      default: true,
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
      triggerElem: null,
    };
  },
  mounted() {
    this.$on("menu-item-click", this.handleMenuItemClick);
  },
  methods: {
    handleMenuItemClick(command, instance) {
      this.triggerElem = instance;
      this.$emit("command", command, instance);
    },
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
      if (this.triggerElem && this.triggerElem.disabled) return;
      if (this.trigger == "click") {
        this.isShowMenu(!this.visible);
      } else if (this.triggerElem) {
        this.isShowMenu(!this.visible);
      }
    },
    isShowMenu(isShow) {
      if (!this.hideOnClick && this.triggerElem) {
        this.triggerElem = null;
        return;
      }
      this.visible = isShow;
      this.triggerElem = null;
      if (isShow) {
        document.addEventListener("click", this.closePanel, false);
      } else {
        document.removeEventListener("click", this.closePanel, false);
      }
    },
    //点击空白区域隐藏面板
    closePanel(e) {
      e.stopPropagation();
      let elem = this.$el;
      if (elem && !elem.contains(e.target)) {
        this.isShowMenu(false);
      }
    },
  },
};
</script>