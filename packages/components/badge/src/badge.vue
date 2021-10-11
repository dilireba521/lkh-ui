<template>
  <div class="lk-badge">
    <slot></slot>
    <template v-if="!hidden">
      <span class="lk-badge_dot" v-if="isDot"></span>
      <span class="lk-badge_content" v-else>
        {{ value >= max ? max + "+" : value }}
      </span>
    </template>
  </div>
</template>
<script>
export default {
  name: "lkBadge",
  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
  },
};
</script>