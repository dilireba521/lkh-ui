<template>
  <div
    class="lk-tag"
    :class="{
      ['is-' + type]: !!type,
      ['is-' + size]: size !== 'default',
      ['is-theme-' + plain]: plain !== 'light',
    }"
  >
    <slot></slot>
    <i
      @click="handleClick"
      v-if="closable"
      class="lk-tag-icon lk-icon-close"
    ></i>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
interface ITagProps {
  type: String;
  closable: Boolean;
  size: String;
  plain: String; //主题
}
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "",
      validator: (val: string): boolean =>
        ["success", "info", "warning", "danger", "dark", ""].indexOf(val) > -1,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "default",
      validator: (val: string): boolean =>
        ["default", "middle", "small"].indexOf(val) > -1,
    },
    plain: {
      type: String,
      default: "light",
      validator: (val: string): boolean =>
        ["light", "dark", "plain"].indexOf(val) > -1,
    },
  },
  emits: ["close"],
  setup(props: ITagProps, ctx) {
    const handleClick = (e) => {
      ctx.emit("close", e);
    };
    return { handleClick };
  },
});
</script>
