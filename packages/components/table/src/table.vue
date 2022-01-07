<template>
  <div class="lk-table">
    <table-header></table-header>
  </div>
</template>
<script type="text/babel">
import TableHeader from "./table-header.js";
export default {
  name: "lkTable",
  components: { TableHeader },
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    size: String,
    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],
  },
};
</script>