<template>
  <transition name="lk-dialog-fade" @after-leave="handleAfterLeave">
    <div class="lk-dialog" v-show="visibleDialog">
      <article
        v-if="mask"
        @click="handleClickMask"
        class="lk-dialog_mask"
      ></article>
      <section class="lk-dialog_box" :style="boxStyle">
        <header
          @mousedown="handleMouseDown"
          :class="dialogHeaderStyle"
          class="lk-dialog_header"
        >
          <slot name="title">
            <div class="lk-dialog_header_title">
              <i :class="titleIcon"></i>
              {{ title }}
            </div>
          </slot>
          <i
            v-if="showClose"
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
          v-if="$slots.footer || (btns && btns.length > 0)"
        >
          <slot name="footer"></slot>
          <template v-if="!$slots.footer">
            <div class="lk-dialog_footer_btns">
              <lk-button
                :type="i == 0 ? 'primary' : 'default'"
                @click="handleClickBtns(i)"
                v-for="(item, i) in btns"
                :key="i"
                >{{ item }}</lk-button
              >
            </div>
          </template>
        </footer>
      </section>
    </div>
  </transition>
</template>
<script>
import { on, off } from "../../../utils/dom";
import { rafThrottle } from "../../../utils/util";

export default {
  name: "lkDialog",
  props: {
    //是否显示弹框
    visible: Boolean,
    title: String,
    titleIcon: String,
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
    showClose: {
      type: Boolean,
      default: true,
    },
    onClose: Function,
    btns: {
      type: Array,
    },
  },
  computed: {
    dialogHeaderStyle() {
      let _class = { "is-drag": this.drag };
      return _class;
    },
    boxStyle() {
      const { offsetY, offsetX } = this.transform;
      let style = {
        width: this.width,
        marginLeft: `${offsetX}px`,
        marginTop: `${offsetY}px`,
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
      transform: {
        offsetX: 0,
        offsetY: "15%",
      },
    };
  },
  methods: {
    //
    handleMouseDown(e) {
      this._dragHandler = rafThrottle(() => {
        // console.log(ev);
      });
      on(document, "mousemove", this._dragHandler);
      on(document, "mouseup", () => {
        off(document, "mousemove", this._dragHandler);
      });
      e.preventDefault();
    },
    handleClickMask() {
      this.handleClickClose();
    },
    handleClickClose() {
      if (this.visible) {
        this.$emit("update:visible", false);
        this.onClose && this.onClose(this);
        this.visibleDialog = false;
      }
    },
    handleAfterLeave() {
      if (this.id) {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      }
    },
    handleClickBtns(index) {
      const type = index == 0 ? "yes" : "btn" + index;
      this[type] && this[type]();
      this.$emit(type);
    },
  },
};
</script>