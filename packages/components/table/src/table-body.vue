<template>
  <table cellspacing="0" cellpadding="0" border="0" class="lk-table-body">
    <colgroup v-if="columnsWidth.length > 0">
      <col v-for="(item, index) in columnsWidth" :key="index" :width="item" />
    </colgroup>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td
          rowspan="1"
          colspan="1"
          v-for="(item, idx) in bodyColumns"
          :key="idx"
          :align="
            item.align || (item.type && item.type == 'selection' && 'center')
          "
          :class="tdClass(item)"
        >
          <TableTd :column="item" :row="row" :index="index" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
const TableTd = {
  props: ["column", "row", "index", "title"],
  render(h) {
    let column = this.column,
      row = this.row,
      $index = this.index,
      title = this.title;
    if (column.$children.length > 0) {
      let fields = [],
        coleach = (function (cols) {
          if (cols.$children.length > 0) {
            cols.$children.forEach((item) => {
              fields.push(item.prop);
              if (item.$children && item.$children.length > 0) {
                coleach(item);
              }
            });
          }
        })(column);
      column.prop = fields[fields.length - 1];
    }
    const rescols = column.renders.call(this, h, {
      row,
      $index,
      column,
      title,
    });
    return <div class="cell">{rescols}</div>;
  },
};
export default {
  name: "lkTableBody",
  components: { TableTd },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    fixed: {
      type: String,
      validator: (val) => ["left", "right"].indexOf(val) !== -1,
    },
  },
  computed: {
    columnsWidth() {
      return this.$parent.columnsWidth;
    },
    bodyColumns() {
      return this.$parent.bodyColumns;
    },
  },
  mounted() {
    // console.log(this.bodyColumns);
  },
  data() {
    return {};
  },
  methods: {
    tdClass(data) {
      let style = {};
      if (this.fixed) {
        if (this.fixed == "left") {
          this.$parent.leftData.indexOf(data) === -1 &&
            (style["is-hidden"] = true);
        } else {
          this.$parent.rightData.indexOf(data) === -1 &&
            (style["is-hidden"] = true);
        }
      }
      return style;
    },
  },
};
</script>