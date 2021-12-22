<template>
  <transition name="lk-message-fade" @after-leave="handleAfterLeave">
    <div
      class="lk-message"
      :class="[center && 'is-center', `lk-message-${type}`]"
      :style="messageStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="lk-message_content">
        <slot v-if="!useHTMLString">
          <i :class="'lk-icon-' + icon"></i>
          {{ message }}
        </slot>
        <p v-else v-html="message"></p>
      </div>
      <i
        v-if="showClose"
        @click="close"
        class="lk-message_close lk-icon-close"
      ></i>
    </div>
  </transition>
</template>
<script>
export default {
  name: "lkMessage",
  props: {
    message: String,
    center: Boolean,
    showClose: Boolean,
    useHTMLString: Boolean,
    type: {
      type: String,
      default: "info",
      validator: (val) =>
        ["success", "warning", "info", "error"].indexOf(val) > -1,
    },
    duration: {
      type: Number,
      default: 3000,
    },
    onClose: Function,
    icon: {
      type: String,
      default: "info",
    },
  },
  computed: {
    messageStyle() {
      return { top: `${this.verticalOffset}px` };
    },
  },
  data() {
    return {
      visible: false,
      verticalOffset: 20,
      timer: null,
    };
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.visible && this.close();
        }, this.duration);
      }
    },
    close() {
      this.visible = false;
      this.onClose && this.onClose(this);
    },
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>