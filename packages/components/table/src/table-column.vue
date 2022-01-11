
<script>
import { LkCheckbox } from "../../checkbox";
export default {
  name: "lkTableColumn",
  render(h) {
    return h("div", this.$slots.default);
  },
  props: {
    type: {
      type: String,
      validator: (val) => ["selection", "index", "extend"].indexOf(val) > -1,
    },
    // 固定当前列，可选left/right
    fixed: {
      type: String,
      validator: (val) => ["left", "right"].indexOf(val) > -1,
    },
    // 对齐方式，可选left/center/right
    align: {
      type: String,
      validator: (val) => ["left", "center", "right"].indexOf(val) > -1,
    },
    label: String,
    prop: String,
    width: String,
    // 鼠标滑过单元格时是否显示title提示语
    title: {
      type: Boolean,
      default: false,
    },
  },
  components: { LkCheckbox },
  data() {
    return {
      renders: {},
    };
  },
  created() {
    this.renders = (h, { row, column, $index }) => {
      //自定义文本格式内容
      if (this.$scopedSlots.default) {
        const data = {
          row: row,
          index: $index + 1,
        };
        if (column.$children.length == 0) {
          return this.$scopedSlots.default(data);
        }
      }
      //复选框按钮
      if (column.type === "selection") {
        //如果checkRows有当前行，则为选中状态
        let checkedStatus = this.$parent.checkRows.indexOf(row) !== -1;
        return h("lkCheckbox", {
          props: {
            value: checkedStatus,
          },
          on: {
            change: this.handleColChange.bind(this, row),
          },
        });
      }
      //序列号
      if (column.type === "index") {
        return $index + 1;
      }

      return row[column.prop];
    };
  },
  methods: {
    handleColChange(row) {
      this.$parent.handleChange(row);
    },
  },
};
</script>