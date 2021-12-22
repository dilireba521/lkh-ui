<template>
  <div class="lk-image">
    <slot v-if="loading" name="placeholder">
      <div class="lk-image_placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="lk-image_error">加载失败</div>
    </slot>
    <img
      v-else
      class="lk-image_inner"
      :class="{ 'is-preview': preview }"
      :src="src"
      :style="imageInnerStyle"
      :lazy="lazy"
      v-bind="$attrs"
      @click="clickHandler"
    />
    <template v-if="preview">
      <lk-image-viewer
        :z-index="zIndex"
        :initial-index="imageIndex"
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="previewSrcList"
      ></lk-image-viewer>
    </template>
  </div>
</template>
<script>
const isSupportObjectFit = () =>
  document.documentElement.style.hasOwnProperty("objectFit");
const ObjectFit = {
  NONE: "none",
  CONTAIN: "contain",
  COVER: "cover",
  FILL: "fill",
  SCALE_DOWN: "scale-down",
};
export default {
  name: "lkImage",
  props: {
    src: String,
    fit: String,
    lazy: Boolean,
    previewSrcList: Array,
    scrollContainer: {},
    zIndex: {
      type: Number,
      default: 2000,
    },
  },
  computed: {
    imageInnerStyle() {
      const { fit } = this;
      return fit
        ? isSupportObjectFit()
          ? { "object-fit": fit }
          : this.getImageStyle(fit)
        : {};
    },
    preview() {
      return (
        Array.isArray(this.previewSrcList) && this.previewSrcList.length > 0
      );
    },
    imageIndex() {
      let _index = 0;
      const _srcIndex = this.previewSrcList.indexOf(this.src);
      if (_srcIndex >= 0) _index = _srcIndex;
      return _index;
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      show: !this.lazy,
      imgHeight: 0,
      imgWidth: 0,
      showViewer: false,
    };
  },
  mounted() {
    this.loadImage();
  },
  methods: {
    //加载图片
    loadImage() {
      this.loading = true;
      this.error = false;
      const img = new Image();
      img.onload = (e) => this.handleLoad(e, img);
      img.onerror = this.handleError.bind(this);
      Object.keys(this.$attrs).forEach((key) => {
        const val = this.$attrs[key];
        img.setAttribute(key, val);
      });
      img.src = this.src;
    },
    //懒加载
    addLazyLoadListener() {},
    getImageStyle(fit) {
      const { imgHeight, imgWidth } = this;
      const { clientWidth: containerWidth, clientHeight: containerHeight } =
        this.$el;

      if (!imgWidth || !imgHeight || !containerWidth || !containerHeight)
        return {};
      const imageAspectRatio = imgWidth / imgHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      if (fit === ObjectFit.SCALE_DOWN) {
        const isSmaller =
          imgWidth < containerWidth && imgHeight < containerHeight;
        fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
      }
      switch (fit) {
        case ObjectFit.NONE:
          return { width: "auto", height: "auto" };
        case ObjectFit.CONTAIN:
          return imageAspectRatio < containerAspectRatio
            ? { width: "auto" }
            : { height: "auto" };
        case ObjectFit.COVER:
          return imageAspectRatio < containerAspectRatio
            ? { height: "auto" }
            : { width: "auto" };
        default:
          return {};
      }
    },
    handleLoad(e, img) {
      this.imgHeight = img.height;
      this.imgWidth = img.width;
      this.loading = false;
      this.error = false;
      this.$emit("load", e);
    },
    handleError(e) {
      this.loading = false;
      this.error = true;
      this.$emit("error", e);
    },
    closeViewer() {
      this.showViewer = false;
    },
    clickHandler() {
      if (!this.preview) return;
      this.showViewer = true;
    },
  },
};
</script>