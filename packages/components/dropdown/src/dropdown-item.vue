<template>
  <dd
    @click="handleClick"
    :class="{ 'is-disabled': disabled }"
    :aria-disabled="disabled"
    class="lk-dropdown-item"
  >
    <slot></slot>
  </dd>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
export default {
  name: "lkDropdownItem",
  mixins: [Emitter],
  props: {
    disabled: Boolean,
    command: {},
  },
  methods: {
    handleClick() {
      this.dispatch("lkDropdown", "menu-item-click", [this.command, this]);
    },
  },
};
</script>