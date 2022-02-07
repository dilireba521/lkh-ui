<template>
  <transition name="lk-dialog-fade">
    <div class="lk-dialog" v-if="visibleDialog">
      <article
        v-if="mask"
        @click="handleClickMask"
        class="lk-dialog_mask"
      ></article>
      <section class="lk-dialog_box">
        <header class="lk-dialog_header">header</header>
        <main class="lk-dialog_main">main</main>
        <footer class="lk-dialog_footer" v-if="$slots.footer">
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
      default: "提示",
    },
    width: {
      type: String,
      default: "30%",
    },
    height: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    buttonAlign: {
      type: String,
      default: "right",
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
    handleClickMask() {},
  },
};
</script>