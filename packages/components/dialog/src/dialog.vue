<template>
  <transition name="lk-dialog-fade">
    <div class="lk-dialog" v-if="visibleDialog">
      <article
        v-if="mask"
        @click="handleClickMask"
        class="lk-dialog_mask"
      ></article>
      <section class="lk-dialog_box" :style="boxStyle">
        <header class="lk-dialog_header">
          <slot name="title">
            <h3 class="lk-dialog_header_title">
              {{ title }}
            </h3>
          </slot>
          <i
            class="lk-dialog_header_icon lk-icon-close"
            @click="handleClickClose"
          ></i>
        </header>
        <main class="lk-dialog_main">
          <template v-if="$slots.default">
            <slot></slot>
          </template>
          <div v-else class="lk-dialog_main_html" v-html="content"></div>
        </main>
        <footer
          class="lk-dialog_footer"
          :style="footerStyle"
          v-if="$slots.footer"
        >
          <slot name="footer"></slot>
        </footer>
      </section>
    </div>
  </transition>
</template>
<script>
export default {
  name: "lkDialog",
  props: {
    //是否显示弹框
    visible: Boolean,
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "30%",
    },
    content: {
      type: String,
      default: "",
    },
    buttonAlign: {
      type: String,
      default: "right",
      validator: (val) => ["left", "center", "right"].indexOf(val) > -1,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    // 是否可以拖拽
    drag: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    boxStyle() {
      let style = {
        width: this.width,
      };
      return style;
    },
    footerStyle() {
      let style = {
        textAlign: this.buttonAlign,
      };
      return style;
    },
  },
  watch: {
    visible(val) {
      this.visibleDialog = val;
      if (val) {
        this.$emit("open");
      } else {
        this.$emit("close");
      }
    },
  },
  data() {
    return {
      visibleDialog: false,
    };
  },
  mounted() {},
  methods: {
    handleClickMask() {
      this.handleClickClose();
    },
    handleClickClose() {
      if (this.visible) {
        this.$emit("update:visible", false);
      }
    },
  },
};
</script>