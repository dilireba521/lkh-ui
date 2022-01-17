<template>
  <div class="lk-table">
    <div class="lk-table_box" ref="box">
      <div ref="hiddenColumns"><slot></slot></div>
      <div ref="headerWrap" class="lk-table_header" :style="tableHeaderStyle">
        <table-header
          :selectStatus="selectChecked"
          :style="{ width: totalWidth }"
        ></table-header>
      </div>
      <div
        ref="bodyWrap"
        class="lk-table_body"
        :style="tableBodyStyle"
        @scroll="handleScrollBody"
      >
        <table-body
          :data="tableData"
          :style="{ width: totalWidth }"
        ></table-body>
      </div>
      <template v-if="leftData.length > 0">
        <div
          class="lk-table_fixed is-left"
          :style="{ width: leftWidth + 'px', bottom: barWidth + 'px' }"
          v-show="isShowLeft"
        >
          <div class="lk-table_fixed-wrap is-left">
            <div
              class="lk-table_fixed-header"
              :style="{ width: leftWidth + 'px' }"
            >
              <table-header
                fixed="left"
                :selectStatus="selectChecked"
                :style="{ width: totalWidth }"
              ></table-header>
            </div>
            <div class="lk-table_fixed-body">
              <table-body
                fixed="left"
                :data="tableData"
                :style="{ width: totalWidth }"
              ></table-body>
            </div>
          </div>
        </div>
      </template>
      <template v-if="rightData.length > 0">
        <div
          class="lk-table_fixed is-right"
          :style="{ width: rightWidth + 'px', bottom: barWidth + 'px' }"
          v-show="isShowRight"
        >
          <div class="lk-table_fixed-wrap is-right">
            <div class="lk-table_fixed-header">
              <table-header
                fixed="right"
                :selectStatus="selectChecked"
                :style="{ width: totalWidth }"
              ></table-header>
            </div>
            <div class="lk-table_fixed-body">
              <table-body
                fixed="right"
                :data="tableData"
                :style="{ width: totalWidth }"
              ></table-body>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script type="text/babel">
import Emitter from "../../../utils/mixins/emitter";
import TableHeader from "./table-header.vue";
import TableBody from "./table-body.vue";
import { findComponentChildren } from "../../../utils/findComponent";
export default {
  name: "lkTable",
  mixins: [Emitter],
  components: { TableHeader, TableBody },
  props: {
    height: {
      type: [String, Number],
      default: "",
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    size: String,
    maxHeight: [String, Number],
  },
  computed: {
    tableHeaderStyle() {
      let style = {};
      this.height && (style["paddingRight"] = this.barWidth + "px");
      return style;
    },
    tableBodyStyle() {
      let style = {};
      if (this.height) {
        // style["paddingRight"] = this.barWidth + "px";
        style["height"] = this.height;
      }

      return style;
    },
  },
  data() {
    return {
      tableData: this.data || [],
      tableWidth: "0px",
      totalWidth: "0px",
      headColumns: [],
      leftHeadColumns: [],
      bodyColumns: [],
      columnsWidth: [],
      selectChecked: "unSelect", // 全选状态 unSelect为全不选，someSelect选择了部分，checked全选
      checkRows: [], // 已选择的行
      barWidth: 0, //浏览器滚动条宽度
      leftData: [], //左浮动集合
      rightData: [], //右浮动集合
      leftWidth: 0,
      rightWidth: 0,
      isShowLeft: false,
      isShowRight: false,
      columns: [], //所有列表项
      columnsExtend: [], // 表头，扩展列的
      columnsFilter: [], // 表头，过滤掉扩展列的
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.hiddenColumns.remove();
      this.getAllColumn();
    });
  },
  methods: {
    handleScrollBody(e) {
      let headerWrap = this.$refs.headerWrap;
      let scrollLeft = e.target.scrollLeft;
      headerWrap.scrollLeft = scrollLeft;

      this.isShowLeft = scrollLeft >= 5;
      this.isShowRight =
        scrollLeft < e.target.scrollWidth - e.target.offsetWidth - 5;
      // console.log(scrollLeft);
    },
    handleSelectAll() {
      const status = this.selectChecked == "checked";
      this.checkRows = status ? [] : [...this.tableData];
      this.selectChecked = status ? "unSelect" : "checked";
    },
    handleChangeCheck(item) {
      const index = this.checkRows.indexOf(item);
      if (index === -1) {
        this.checkRows.push(item);
      } else {
        this.checkRows.splice(index, 1);
      }
      this.changeSelectStatus();
    },
    changeSelectStatus() {
      if (this.checkRows.length === this.tableData.length) {
        this.selectChecked = "checked";
      } else {
        this.selectChecked =
          this.checkRows.length == 0 ? "unSelect" : "someSelect";
      }
    },
    getAllColumn() {
      this.$nextTick(() => {
        let columns = [],
          leftWidth = 0,
          rightWidth = 0;
        this.barWidth = this.getScrollbarWidth();
        //找出所有子项
        findComponentChildren(this, "lkTableColumn").forEach((child) => {
          if (child.fixed == "left") {
            this.leftData.push(child);
            leftWidth += parseInt(child.width);
          } else if (child.fixed == "right") {
            this.rightData.push(child);
            rightWidth += parseInt(child.width);
          } else {
            columns.push(child);
          }
        });
        //设置左浮动宽度
        this.leftWidth = leftWidth;
        //设置右浮动宽度
        this.rightWidth = rightWidth;
        this.columns = [...this.leftData, ...columns, ...this.rightData];
        this.columnsExtend = this.columns.filter(
          (item) => item.type === "extend"
        );
        this.columnsFilter = this.columns.filter(
          (item) => item.type != "extend"
        );
        //配置表头每列数据项
        this.handleColumns();
        //配置表格每列数据项
        this.handleBodyColumns();
        //对表格每列宽度做设置
        this.calcAllWidth();
      });
    },

    //配置表格每列数据项
    handleBodyColumns() {
      let columns = [];
      (function colsEach(data) {
        for (var item of data) {
          if (item.$children && item.$children.length > 0) {
            colsEach(item.$children);
          } else {
            columns.push(item);
          }
        }
      })(this.columnsFilter);
      this.bodyColumns = columns;
    },

    //对每列表头属性进行配置
    handleColumns() {
      const maxLine = this.headerRowSpan(this.columnsFilter);
      let columns = [];
      const that = this;

      (function colsEach(data, index) {
        columns[index] = [];
        for (var item of data) {
          if (item.$children && item.$children.length > 0) {
            item.rowspan = maxLine - index - that.headerRowSpan(item.$children);
            item.colspan = that.headerColSpan(item.$children);
            colsEach(item.$children, index + 1);
          } else {
            item.rowspan = maxLine - index;
            item.colspan = 1;
          }
          columns[index].push(item);
        }
      })(that.columnsFilter, 0);
      this.headColumns = columns;
    },

    //获取头部children最广层级数
    headerColSpan(children) {
      let max = 0;
      (function getMaxCol(data) {
        if (max < data.length) max = data.length;
        data.forEach((item) => {
          if (item.$children && item.$children.length > 0) {
            getMaxCol(item.$children);
          }
        });
      })(children);
      return max;
    },

    //获取头部children最深层级数
    headerRowSpan(children) {
      let max = 0;
      (function getMaxRow(childs, floor) {
        childs.forEach((child) => {
          if (floor > max) max = floor;
          if (child.$children && child.$children.length > 0) {
            getMaxRow(child.$children, floor + 1);
          }
        });
      })(children, 1);
      return max;
    },

    //对表格每列宽度做设置
    calcAllWidth() {
      let columnsWidth = [], //记录每列宽度
        rawWidth = 0, //列表理论宽度总和
        widthsVal = 0, //有定义宽度的总长度
        miniWidthSize = 0, //未直接定义宽度列的个数
        totalWidth = 0,
        boxWidth = this.$refs.box.clientWidth; //盒子长度
      (function colsEach(data) {
        for (var item of data) {
          if (item.$children && item.$children.length > 0) {
            colsEach(item.$children);
          } else {
            const currentWidth = item.width
              ? { colWidth: item.width }
              : { colMinWidth: item.minWidth || 80 };
            columnsWidth.push(currentWidth);
          }
        }
      })(this.columnsFilter);

      columnsWidth.forEach((item) => {
        rawWidth += parseInt(item.colWidth || item.colMinWidth);
        item.colMinWidth && miniWidthSize++;
        item.colWidth && (widthsVal += parseInt(item.colWidth));
      });

      //理论宽度比盒子实际宽度小，重新计算没有对列宽度进行定义的项
      if (rawWidth < boxWidth) {
        let surplusWidth = boxWidth - widthsVal, //除长度定义的总宽度
          minPer = {},
          total = 0;

        //遍历收集未直接定义宽度项占剩余宽度的比例大小
        columnsWidth.forEach((item, i) => {
          if (item.colMinWidth) {
            const val = parseInt(
              Math.floor(item.colMinWidth / surplusWidth) * 100
            );

            minPer[i] = val;
            total += val;
          }
        });
        //根据剩余的长度，对未直接进行宽度项进行等份
        const surplusPer = Math.floor((100 - total) / miniWidthSize);
        for (let k in minPer) {
          const relayWidth = Math.floor(
            (surplusWidth * (minPer[k] + surplusPer)) / 100
          );
          //判断计算后的值是否大于最小值
          relayWidth > columnsWidth[k].colMinWidth &&
            (columnsWidth[k].colMinWidth = relayWidth);
        }
      }

      columnsWidth.forEach((item) => {
        const _width = parseInt(item.colWidth || item.colMinWidth);
        this.columnsWidth.push(_width);
        totalWidth += _width;
      });

      this.$nextTick(() => {
        let bodyWrap = this.$refs.bodyWrap;
        let currCaclWidth = totalWidth;

        if (totalWidth <= bodyWrap.offsetWidth) {
          currCaclWidth = bodyWrap.scrollWidth; //出去边框长度，直接取内容长度
        }
        this.totalWidth = currCaclWidth + "px";
      });
    },
    // 获取浏览器滚动条的宽度
    getScrollbarWidth() {
      let e = document.createElement("div"),
        sw;
      e.style.cssText = `width:100px;height:100px;position:absolute;top:-99999px;overflow:scroll;`;
      document.body.appendChild(e);
      sw = e.offsetWidth - e.clientWidth;
      document.body.removeChild(e);
      return sw;
    },
  },
};
</script>