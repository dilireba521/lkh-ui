<template>
  <div :class="gridClass" :style="graidStyle"></div>
</template>
<script>
export default {
  name: "lkCol",
  props: {},
  computed: {
    gridClass() {
      return "";
    },
    graidStyle() {
      return "";
    },
  },
  data() {
    return {
      gutter: 0,
    };
  },
  methods: {},
};
</script>