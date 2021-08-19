<template>
  <button
    :type="nativeType"
    :class="btnClass"
    @click="handleClick"
    :disabled="disabled"
    :autofocus="autofocus"
    :style="{ borderRadius: round }"
  >
    <lkIcon v-if="icon" :name="icon" />
    <span>
      <slot></slot>
    </span>
  </button>
</template>
<script>
import lkIcon from "../../icon/src/icon";
export default {
  name: "lkButton",
  props: {
    type: { type: String, default: "default" },
    icon: {
      type: String,
      default: "",
    },
    round: {
      type: String,
      default: "4px",
    },
    size: {
      type: String,
      default: "small",
    },
    disabled: Boolean,
    autofocus: Boolean,
    plain: Boolean,
    nativeType: {
      type: String,
      validator: (val) => ["button", "submit", "reset"].indexOf(val) > -1,
      default: "button",
    },
  },
  computed: {
    btnClass() {
      let that = this;
      const fullObjs = {
        [`lk-bg-${that.type}`]: that.type != "",
        [`lk-border-${that.type}`]: that.type != "",
        ["lk-cf"]: that.plain == false && that.type != "default",
      };
      const plainObjs = {
        [`lk-light-bg-${that.type}`]: that.type != "",
        [`lk-light-border-${that.type}`]: that.type != "",
        [`lk-${that.type}`]: that.plain == true,
      };
      return ["lk-btn", `lk-${this.size}`, that.plain ? plainObjs : fullObjs];
    },
  },
  components: { lkIcon },
  methods: {
    handleClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>

 