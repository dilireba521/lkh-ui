<template>
  <transition name="viewer-fade">
    <div tabindex="-1" class="lk-image-viewer" :style="{ 'z-index': zIndex }">
      <div class="lk-image-viewer_mask"></div>
      <!-- close -->
      <div
        @click="handleClose"
        class="lk-image-viewer_btn lk-image-viewer_close"
      >
        <i class="lk-icon-close"></i>
      </div>
      <template v-if="!isSingle">
        <!-- prev -->
        <div
          @click="handlePrev"
          class="lk-image-viewer_btn lk-image-viewer_prev"
        >
          <i class="lk-icon-arrow-left"></i>
        </div>
        <!-- next -->
        <div
          @click="handleNext"
          class="lk-image-viewer_btn lk-image-viewer_next"
        >
          <i class="lk-icon-arrow-right"></i>
        </div>
      </template>
      <!-- action -->
      <div class="lk-image-viewer_btn lk-image-viewer_action">
        <div class="lk-image-viewer_action_inner">
          <i class="lk-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="lk-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i
            class="lk-icon-refresh-left"
            @click="handleActions('anticlocelise')"
          ></i>
          <i
            class="lk-icon-refresh-right"
            @click="handleActions('clocelise')"
          ></i>
        </div>
      </div>
      <!-- cont -->
      <div class="lk-image-viewer_cont">
        <template v-for="(url, i) in urlList">
          <img
            :key="url"
            v-if="i === index"
            ref="img"
            class="lk-image-viewer_img"
            :style="imageStyle"
            :src="currentImg"
            @load="handleLoad"
            @error="handleError"
            @mousedown="handleMouseDown"
          />
        </template>
      </div>
    </div>
  </transition>
</template>
<script>
import { isFirefox, rafThrottle } from "../../../utils/util";
import { on, off } from "../../../utils/dom";
const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";
export default {
  name: "lkImageViewer",
  props: {
    urlList: {
      type: Array,
      default() {
        return [];
      },
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    imageStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
        maxWidth: "100%",
        maxheight: "100%",
      };
      return style;
    },
    currentImg() {
      return this.urlList[this.index];
    },
  },
  watch: {
    index: {
      handler: function () {
        this.reset();
      },
    },
    currentImg() {
      this.$nextTick(() => {
        const $img = this.$refs.img[0];
        if (!$img.complete) this.loading = true;
      });
    },
  },

  data() {
    return {
      index: this.initialIndex,
      loading: false,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
    };
  },
  mounted() {
    this.deviceSupportInstall();
  },
  methods: {
    handleActions(action) {
      if (this.loading) return;

      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
      };
      const { transform } = this;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2)
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clocelise":
          transform.deg += rotateDeg;
          break;
        case "anticlocelise":
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
    handlePrev() {
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    handleNext() {
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleClose() {
      this.deviceSupportUninstall();
      this.onClose();
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    },
    handleLoad() {
      this.loading = false;
    },
    handleError() {
      this.loading = false;
    },
    handleMouseDown(e) {
      if (this.loading) return;
      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, "mousemove", this._dragHandler);
      on(document, "mouseup", () => {
        off(document, "mousemove", this._dragHandler);
      });
      e.preventDefault();
    },
    deviceSupportInstall() {
      this._mousewheelEventname = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        let type = delta > 0 ? "zoomIn" : "zoomOut";
        this.handleActions(type, {
          zoomRate: 0.0015,
          enableTransition: false,
        });
      });

      on(document, mousewheelEventName, this._mousewheelEventname);
    },
    deviceSupportUninstall() {
      off(document, mousewheelEventName, this._mousewheelEventname);
      this._mousewheelEventname = null;
    },
  },
};
</script>