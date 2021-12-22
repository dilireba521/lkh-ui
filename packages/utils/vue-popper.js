import { setElementSize } from "./dom";

export default {
  props: {
    placement: {
      type: String,
      default: "bottom",
    },
  },
  data() {
    return {
      showPopper: false,
      style: {}, //浮层样式
      parentPopper: null, //浮层定位模块
      currentPopper: null, //浮层模块
      scrollPopper: null, //浮层滚动区域模块
      popperData: null,

    };
  },
  watch: {
    showPopper(val) {
      if (val) {
        this.updatePopper();
        this.scrollPopper =
          this.scrollPopper || this.getScrollParent(this.parentPopper);
        this.scrollPopper.addEventListener("scroll", this.updatePopper);
        window.addEventListener("resize", this.updatePopper);
        this.parentPopper.addEventListener("mousemove", this.updatePopper)
        this.parentPopper.addEventListener("mouseup", this.onDragEnd)
      } else {
        this.destroyPopper();
        this.scrollPopper.removeEventListener("scroll", this.updatePopper);
        window.removeEventListener("resize", this.updatePopper);
      }
    }
  },
  mounted() { },
  methods: {
    onDragEnd() {
      this.parentPopper.removeEventListener("mousemove", this.updatePopper)
      this.parentPopper.removeEventListener("mouseup", this.onDragEnd)
    },
    updatePopper() {
      this.currentPlacement = this.currentPlacement || this.placement;
      if (
        !/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)
      ) {
        return;
      }
      this.$nextTick(() => {
        if (!this.parentPopper || !this.currentPopper || !this.currentPlacement) return
        this.popperData = setElementSize(
          this.parentPopper,
          this.currentPopper,
          this.currentPlacement
        );
        this.currentPlacement = this.popperData.placement;
        this.style = {
          left: this.popperData.popperOffsets.left + "px",
          top: this.popperData.popperOffsets.top + "px",
        };
      });
    },
    destroyPopper() {
      setTimeout(() => {
        this.style = {};
      }, 200)
    },
    //获取滚动父级
    getScrollParent(elem) {
      var root = window;
      var parent = elem.parentNode;
      if (!parent) {
        return elem;
      }
      if (parent === root.document) {
        // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
        // greater than 0 and return the proper element
        if (root.document.body.scrollTop || root.document.body.scrollLeft) {
          return root.document.body;
        } else {
          return root.document.documentElement;
        }
      }
      // Firefox want us to check `-x` and `-y` variations as well
      if (
        ["scroll", "auto"].indexOf(
          this.getStyleComputedProperty(parent, "overflow")
        ) !== -1 ||
        ["scroll", "auto"].indexOf(
          this.getStyleComputedProperty(parent, "overflow-x")
        ) !== -1 ||
        ["scroll", "auto"].indexOf(
          this.getStyleComputedProperty(parent, "overflow-y")
        ) !== -1
      ) {
        return parent;
      }
      return this.getScrollParent(parent);
    },
    //获取原属样式
    getStyleComputedProperty(elem, prop) {
      var css = window.getComputedStyle(elem, null);
      return css[prop];
    },
  },
};
