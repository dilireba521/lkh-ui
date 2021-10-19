<template>
  <div :class="tabsClass">
    <!-- head begin -->
    <div :class="headerClass" ref="header">
      <ul class="lk-tabs-navwrap">
        <template v-for="(item, index) in paneList">
          <li
            v-if="item.label"
            @click.stop="handleClickChange(item)"
            :class="[
              navClass,
              {
                'is-active': activeVal == item.name,
                'is-disabled': item.disabled,
              },
            ]"
            :key="index"
          >
            <slot name="label">{{ item.label }}</slot>
          </li>
        </template>
      </ul>
    </div>
    <!-- head end -->
    <!-- body begin  -->
    <div class="lk-tabs_body" ref="body">
      <slot></slot>
    </div>
    <!-- body end  -->
  </div>
</template>
<script>
import { findComponentChildren } from "../../../utils/findComponent";
export default {
  name: "lkTabs",
  componentName: "lkTabs",
  props: {
    value: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "line",
      validator: (val) => ["line", "card"].indexOf(val) > -1,
    },
    direction: {
      type: String,
      default: "top",
      validator: (val) => ["top", "right", "bottom", "left"].indexOf(val) > -1,
    },
  },
  computed: {
    tabsClass() {
      let _class = ["lk-tabs", `is-` + this.direction];
      return _class;
    },
    headerClass() {
      let _class = ["lk-tabs_header", { ["is-card"]: this.type == "card" }];
      return _class;
    },
    navClass() {
      return "lk-tabs-nav";
    },
  },
  watch: {
    activeVal(val) {
      this.$emit("input", val);
    },
    direction() {
      this.directionNav();
    },
  },
  data() {
    return {
      paneList: [], //面板实例
      activeVal: this.value,
    };
  },
  mounted() {
    this.paneInstances();
    this.directionNav();
  },
  methods: {
    //点击切换
    handleClickChange(data) {
      this.updateNav(data);
    },
    //初始化
    paneInstances() {
      this.paneList = findComponentChildren(this, "lkTabsPane");
      this.$slots.default = this.paneList.map((item) => {
        return item.$vnode;
      });
      if (this.paneList) {
        if (!this.activeVal) this.updateNav(this.paneList[0]);
      }
    },
    //更新标签
    updateNav(data) {
      if (data.disabled) return;
      this.activeVal = data.name;
      this.$emit("tab-click", data);
    },
    //确定标签方向
    directionNav() {
      this.$nextTick(() => {
        this.$el.appendChild(
          this.direction == "bottom" ? this.$refs.header : this.$refs.body
        );
      });
    },
  },
};
</script>