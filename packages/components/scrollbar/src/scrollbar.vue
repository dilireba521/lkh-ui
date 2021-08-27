<template>
  <div class="lk-scroll">
    <div ref="view" :class="viewDirection" class="lk-scroll-viewport">
      <slot></slot>
    </div>
    <div ref="bar" class="lk-scroll-bar" :style="barStyle"></div>
  </div>
</template>
<script>
const requestAnima =
  window.requestAnimationFrame ||
  window.setImmediate ||
  function (c) {
    return setTimeout(c, 0);
  };
export default {
  name: "lkScroll",
  props: {
    wheel: {
      type: Boolean,
      default: true,
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    viewDirection() {
      return this.totalHeight > this.ownHeight
        ? this.wheel
          ? "is-vertical"
          : "is-horizontal"
        : "";
    },
  },
  watch: {},
  data() {
    return {
      els: null,
      view: null,
      bar: null,
      barStyle: {},
      totalHeight: 0,
      ownHeight: 0,
      scrollRatio: 0,
    };
  },
  mounted() {
    this.els = this.$el;
    this.bar = this.$refs.bar;
    this.view = this.$refs.view;

    if (this.scrollTop > 0) {
      this.view.scrollTop = this.scrollTop;
    }
    this.$nextTick(() => {
      this.scrollBar();
    });
  },

  methods: {
    getScrollbarWidth() {
      let e = document.createElement("div"),
        sw;
      e.style.position = "absolute";
      e.style.top = "-99999px";
      e.style.width = "100px";
      e.style.height = "100px";
      e.style.overflow = "scroll";
      document.body.appendChild(e);
      sw = e.offsetWidth - e.clientWidth;
      document.body.removeChild(e);
      return sw;
    },
    moveBar() {
      this.totalHeight = this.view.scrollHeight;
      this.ownHeight = this.els.clientHeight;
      this.scrollRatio = this.ownHeight / this.totalHeight;
      requestAnima(() => {
        let postl = `${(this.view.scrollTop / this.totalHeight) * 100}%`,
          barVal = `${this.getScrollbarWidth()}px`,
          maxVal = `${Math.max(this.scrollRatio * this.ownHeight, 10)}px`;
        if (this.totalHeight > this.ownHeight) {
          let style = {
            width: this.wheel ? barVal : maxVal,
            height: this.wheel ? maxVal : barVal,
          };
          Object.assign(
            style,
            this.wheel ? { top: postl, right: 0 } : { left: postl, bottom: 0 }
          );
          this.barStyle = style;
        } else {
          this.barStyle = { display: "none" };
        }
      });
    },
    eventListener(flag) {
      let event = flag ? "addEventListener" : "removeEventListener";
      window[event]("resize", this.moveBar);
      this.view[event]("scroll", this.moveBar);
      this.view[event]("mouseenter", this.moveBar);
    },
    dragDealer() {
      let lastPageY,
        grabbed = "scroll-grabbed";
      const drag = (e) => {
        let delta = e.pageY - lastPageY;
        lastPageY = e.pageY;

        requestAnima(() => {
          this.view.scrollTop += delta / this.scrollRatio;
        });
      };
      const stop = () => {
        this.els.classList.remove(grabbed);
        document.body.classList.remove(grabbed);
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stop);
      };
      this.bar.addEventListener("mousedown", (e) => {
        lastPageY = e.pageY;
        this.els.classList.add(grabbed);
        document.body.classList.add(grabbed);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stop);
        return false;
      });
    },
    scrollBar() {
      this.moveBar();
      this.eventListener(true);
      this.dragDealer();
    },
  },
  destroyed() {
    this.eventListener(false);
  },
};
</script>