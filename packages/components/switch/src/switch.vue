<template>
  <label
    class="lk-switch"
    :class="{ 'is-active': currentVal, 'is-disabled': disabled }"
  >
    <input
      ref="input"
      v-model="currentVal"
      :disabled="disabled"
      class="lk-switch-input"
      type="checkbox"
      @change="handleChange"
    />
    <span
      ref="core"
      class="lk-switch-inner"
      :style="{
        width: width + 'px',
      }"
    ></span>
  </label>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
interface ISwitchProps {
  value: Boolean;
  disabled: Boolean;
  width: Number;
  activeColor: String;
  inactiveColor: String;
}

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 40,
    },
    activeColor: {
      type: String,
      default: "",
    },
    inactiveColor: {
      type: String,
      default: "",
    },
  },
  emits: ["input", "change"],
  setup(props: ISwitchProps, ctx) {
    const currentVal = ref(props.value);
    const core = ref(null);
    const handleChange = (): void => {
      ctx.emit("input", currentVal.value);
      ctx.emit("change", currentVal.value);
      setBackgroundColor();
    };
    const setBackgroundColor = (): void => {
      const newColor = currentVal.value
        ? props.activeColor
        : props.inactiveColor;
      const coreEl = core.value;
      coreEl.style.backgroundColor = newColor;
    };

    onMounted(() => {
      if (props.activeColor || props.inactiveColor) setBackgroundColor();
    });
    return { core, currentVal, handleChange };
  },
});
</script>
