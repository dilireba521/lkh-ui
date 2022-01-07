<template>
  <div v-if="pageCount" class="lk-pagination">
    <div v-if="showTotal" class="lk-pagination_total">共 {{ total }} 条</div>
    <button
      class="lk-pagination_prev"
      @click="jump(false)"
      :disabled="internalCurrentPage <= 1"
      :class="{
        'is-border': border,
        'is-disabled': internalCurrentPage <= 1 || disabled,
      }"
    >
      <i class="lk-icon-arrow-left"></i>
    </button>
    <ul
      @click="onPagerClick"
      :class="{ 'is-border': border, 'is-disabled': disabled }"
      class="lk-pagination_pager"
    >
      <li
        v-if="pageCount > 1"
        :class="{ 'is-active': internalCurrentPage === 1 }"
      >
        1
      </li>
      <li
        v-show="showPrevMore"
        @mouseenter="onMouseenter('prev')"
        @mouseleave="quickPrevHover = false"
        class="is-more btn-prev"
        :class="morePrevClass"
      ></li>
      <li
        v-for="page in pagers"
        :key="page"
        :class="{ 'is-active': internalCurrentPage === page }"
      >
        {{ page }}
      </li>
      <li
        v-show="showNextMore"
        @mouseenter="onMouseenter('next')"
        @mouseleave="quickNextHover = false"
        class="is-more btn-next"
        :class="moreNextClass"
      ></li>
      <li :class="{ 'is-active': internalCurrentPage === pageCount }">
        {{ pageCount }}
      </li>
    </ul>
    <button
      @click="jump(true)"
      class="lk-pagination_next"
      :disabled="internalCurrentPage >= pageCount"
      :class="{
        'is-border': border,
        'is-disabled': internalCurrentPage >= pageCount || disabled,
      }"
    >
      <i class="lk-icon-arrow-right"></i>
    </button>
    <div v-if="showSelect" class="lk-pagination_sizes">
      <lk-select :disabled="disabled" v-model="internalPageSize">
        <lk-option
          v-for="item in pageSizes"
          :key="item"
          :label="item + '条/页'"
          :value="item"
        ></lk-option>
      </lk-select>
    </div>
    <div v-if="jumper" class="lk-pagination_jump">
      <lk-input
        :disabled="disabled"
        @change="inputChange"
        v-model="userInput"
        type="number"
        width="140px"
      >
        <template slot="prepend">前往</template>
        <template slot="append">页</template>
      </lk-input>
    </div>
  </div>
  <div v-else></div>
</template>
<script>
import { LkSelect, LkOption } from "../../select";
import { LkInput } from "../../input";
export default {
  name: "lkPagination",
  components: { LkSelect, LkOption, LkInput },
  props: {
    //当前选中页
    currentPage: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      require: true,
    },
    //每页展示数据
    pageSize: {
      type: Number,
      default: 10,
    },
    //页码支持配置每页展示数据
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30];
      },
    },
    jumper: Boolean,
    border: Boolean,
    disabled: Boolean,
    showSelect: Boolean,
    //显示数据总量
    showTotal: Boolean,
    //显示页码按钮数量
    pagerCount: {
      type: Number,
      validator: (val) => {
        return val >= 5 && val <= 21 && val % 2 == 1;
      },
      default: 7,
    },
  },
  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.internalCurrentPage = isNaN(val) ? 1 : val;
      },
    },
    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = isNaN(val) ? 10 : val;
      },
    },
    internalPageSize(nVal, oVal) {
      if (nVal !== oVal && this.pageCount < this.internalCurrentPage) {
        this.internalCurrentPage = this.pageCount;
      }
    },
    internalCurrentPage: {
      immediate: true,
      handler(val) {
        this.userInput = val;
      },
    },
  },
  computed: {
    morePrevClass() {
      return (!this.quickPrevHover && "lk-icon-more") || "lk-icon-d-arrow-left";
    },
    moreNextClass() {
      return (
        (!this.quickNextHover && "lk-icon-more") || "lk-icon-d-arrow-right"
      );
    },
    //页码总数量
    pageCount() {
      if (typeof this.total === "number") {
        return Math.max(1, Math.ceil(this.total / this.internalPageSize));
      }
      return null;
    },
    //中间按钮展示数据
    pagers() {
      let pageCount = Number(this.pageCount);
      let currentPage = Number(this.internalCurrentPage);

      let pagerCount = this.pagerCount;
      let helfPagerCount = (pagerCount - 1) / 2;
      let showPrevMore = false;
      let showNextMore = false;

      //页码数量超过页码按钮数据时，需要显示 more
      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - helfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < pageCount - helfPagerCount) {
          showNextMore = true;
        }
      }
      let arr = [];
      //通过展示more按钮的状态，确定按钮显示数量
      if (showPrevMore && showNextMore) {
        let offset = Math.floor((pagerCount - 2) / 2);
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          arr.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          arr.push(i);
        }
      } else if (showPrevMore && !showNextMore) {
        let startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          arr.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          arr.push(i);
        }
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.showPrevMore = showPrevMore;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.showNextMore = showNextMore;
      return arr;
    },
  },
  data() {
    return {
      showPrevMore: false,
      showNextMore: false,
      quickPrevHover: false,
      quickNextHover: false,
      internalPageSize: 0,
      internalCurrentPage: 1,
      userInput: 0,
    };
  },
  methods: {
    onPagerClick(e) {
      if (this.disabled) return;
      let newPage = Number(e.target.textContent);
      let pagerCountOffset = this.pagerCount - 2;
      let target = e.target;
      if (target.className.indexOf("more") > -1) {
        if (target.className.indexOf("prev") > -1) {
          newPage = this.internalCurrentPage - pagerCountOffset;
        } else {
          newPage = this.internalCurrentPage + pagerCountOffset;
        }
      }
      if (!isNaN(newPage)) {
        newPage < 1 && (newPage = 1);
        newPage > this.pageCount && (newPage = this.pageCount);
      }
      if (newPage !== this.internalCurrentPage) {
        this.internalCurrentPage = newPage;
        this.$emit("change", newPage);
      }
    },
    onMouseenter(direction) {
      if (this.disabled) return;
      (direction === "prev" && (this.quickPrevHover = true)) ||
        (this.quickNextHover = true);
    },
    jump(state) {
      if (this.disabled) return;
      state ? this.internalCurrentPage++ : this.internalCurrentPage--;
      this.$emit("change", this.internalCurrentPage);
    },
    inputChange(val) {
      if (val) {
        this.userInput =
          val < 1 ? 1 : val > this.pageCount ? this.pageCount : val;
        this.internalCurrentPage = Number(this.userInput);
        this.$emit("change", this.internalCurrentPage);
      } else {
        this.userInput = this.internalCurrentPage;
      }
    },
  },
};
</script>
