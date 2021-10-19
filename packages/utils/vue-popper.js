import { setElementSize } from "./dom";

export default {
  data() {
    return {
      showPopper: false,
      style: {},
      parentPopper: null,
      scrollPopper: null
    }
  },
  watch: {
    showPopper(val) {
      if (val) {
        this.updatePopper()
        this.scrollPopper = this.scrollPopper || this.getScrollParent(this.parentPopper);
        this.scrollPopper.addEventListener("scroll", this.updatePopper);
      } else {
        this.destroyPopper()
        this.scrollPopper.removeEventListener("scroll", this.updatePopper);
      }
    },
  },
  mounted() {

  },
  methods: {
    updatePopper() {
      this.$nextTick(() => {
        this.style = setElementSize(this.parentPopper, this.$el);
      })
    },
    destroyPopper() {
      this.style = {};
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
  }
}