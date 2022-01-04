<template>
  <div v-if="pageCount" class="lk-pagination">
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
  </div>
</template>
<script>
export default {
  name: "lkPagination",
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
    pageSize: {
      type: Number,
      default: 10,
    },
    jumper: Boolean,
    border: Boolean,
    showSize: Boolean,
    disabled: Boolean,
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
      let pageCount = this.pageCount;
      let currentPage = this.internalCurrentPage;

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
      internalCurrentPage: 0,
    };
  },
  mounted() {},
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
      console.log(newPage);
    },
    onMouseenter(direction) {
      if (this.disabled) return;
      (direction === "prev" && (this.quickPrevHover = true)) ||
        (this.quickNextHover = true);
    },
    jump(state) {
      if (this.disabled) return;
      state ? this.internalCurrentPage++ : this.internalCurrentPage--;
      console.log(this.internalCurrentPage);
      this.$emit("change", this.internalCurrentPage);
    },
  },
};
</script>
