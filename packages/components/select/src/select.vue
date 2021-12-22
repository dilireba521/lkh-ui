<template>
  <div class="lk-select" @click="toggleMenu">
    <div
      class="lk-select_tags"
      v-if="multiple"
      :style="{ 'max-width': inputWidth - 32 + 'px' }"
      ref="tags"
    >
      <div v-if="collapseTags && selected.length">
        <lk-tag type="dark" closable size="small">{{
          selected[0].currentLabel
        }}</lk-tag>
        <lk-tag type="dark" size="small">+{{ selected.length - 1 }}</lk-tag>
      </div>
      <transition-group
        @after-leave="resetInputHeight"
        v-if="!collapseTags && selected.length"
      >
        <lk-tag
          v-for="item in selected"
          :key="item.value || 'default'"
          type="dark"
          closable
          @close.stop="deleteTag($event, item)"
          size="small"
          >{{ item.currentLabel }}</lk-tag
        >
      </transition-group>
    </div>
    <lk-input
      class="lk-select-input"
      :class="{ 'is-clearable': clearable }"
      v-model="selectedLabel"
      ref="reference"
      :readonly="readonly"
      :placeholder="currentPlaceholder"
      width="100%"
      @focus="handleFocus"
      @blur="handleBlur"
      :disabled="disabled"
      @mouseenter.native="inputHover = true"
      @mouseleave.native="inputHover = false"
      @input="debouncedOnInputChange"
    >
      <template slot="suffix">
        <i @click="handleInputClear" :class="suffixIconClass"></i>
      </template>
    </lk-input>

    <transition name="lk-zoom-in-top">
      <lk-select-menu
        :style="{ zIndex: zIndex }"
        :class="[multiple && 'is-multiple']"
        ref="popper"
        v-show="visible"
      >
        <lk-scroll v-show="options.length > 0">
          <slot></slot>
        </lk-scroll>
        <p class="lk-select-empty" v-show="isEmpty">无数据</p>
      </lk-select-menu>
    </transition>
  </div>
</template>
<script>
import Emitter from "../../../utils/mixins/emitter";
import lkSelectMenu from "./select-dropdown.vue";
import { lkScroll } from "../../scrollbar";
import { debounce } from "../../../utils/util";
import { LkTag } from "../../tag";
export default {
  name: "lkSelect",
  componentName: "lkSelect",
  mixins: [Emitter],
  components: { lkSelectMenu, lkScroll, LkTag },
  provide() {
    return {
      select: this,
    };
  },
  props: {
    name: String,
    value: {
      required: true,
    },
    placeholder: String,
    zIndex: {
      type: Number,
      default: 999,
    },
    filterable: Boolean,
    disabled: Boolean, //todo 多选未添加
    clearable: Boolean, //todo 多选未添加
    filterMethod: Function,
    multiple: Boolean,
    collapseTags: Boolean,
  },
  computed: {
    isEmpty() {
      return this.options.length == 0 || this.filteredOptionsCount == 0;
    },
    suffixIconClass() {
      let icon = "lk-icon-arrow-" + ((this.visible && "up") || "down");
      this.inputHover &&
        this.value &&
        this.clearable &&
        (icon = "lk-icon-circle-close lk-select-input_clear");
      return icon;
    },
    readonly() {
      return !this.filterable;
    },
  },
  watch: {
    value(val) {
      this.setSelected();
    },
    visible(val) {
      this.broadcast("lkSelectDropdown", "visible", val);
      if (val) {
        if (this.filterable) {
          this.query = this.selectedLabel;
          this.handleQueryChange(this.query);
        }
        document.addEventListener("click", this.closePanel, false);
      } else {
        this.menuVisibleOnFocus = false;
        document.removeEventListener("click", this.closePanel, false);
      }
    },
  },
  data() {
    return {
      options: [],
      cachedOptions: [], //当前select下的可操作实例数据
      filteredOptionsCount: 0,
      optionsCount: 0,
      selected: this.multiple ? [] : {},
      selectedLabel: "", //当前input显示的数据
      inputWidth: 0, //当前input的宽度
      initialInputHeight: 0,
      visible: false, //是否显示浮层
      inputHover: false, //鼠标在input内
      currentPlaceholder: this.placeholder,
      cachedPlaceHolder: "",
      query: "",
      menuVisibleOnFocus: false, //浮层是否处于聚焦状态，用于多选时判断浮层状态
    };
  },
  created() {
    this.$on("handleOptionClick", this.handleOptionSelect);
    this.debouncedOnInputChange = debounce(() => {
      this.onInputChange();
    });
  },
  mounted() {
    this.resteInputWidth();
    this.setSelected();
    this.initialInputHeight =
      this.$refs.reference.$el.getBoundingClientRect().height;
  },
  methods: {
    //设置选中项
    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value);
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        if (this.filterable) {
          this.query = this.selectedLabel;
          this.currentPlaceholder = this.selectedLabel;
        }
        return;
      }
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach((item) => {
          result.push(this.getOption(item));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    //获取选中项
    getOption(val) {
      const isObject =
        Object.prototype.toString.call(val).toLowerCase() === "[object object]";
      const isNull =
        Object.prototype.toString.call(val).toLowerCase() === "[object null]";
      const isUndefine =
        Object.prototype.toString.call(val).toLowerCase() ===
        "[object undefined]";
      let option;
      let label = "";
      if (!isObject && !isNull && !isUndefine) {
        for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
          const cachedOption = this.cachedOptions[i];
          if (cachedOption.value === val) {
            option = cachedOption;
            break;
          }
        }
        label = String(val);
      }

      //匹配到值
      if (option) return option;
      //无法匹配合适数据
      let newOption = {
        value: val,
        currentLabel: label,
      };
      return newOption;
    },
    getValueIndex(arr = [], val) {
      return arr.indexOf(val);
    },
    //点击选中项
    handleOptionSelect(option) {
      if (this.multiple) {
        const value = (this.value || []).slice();
        const optionIndex = this.getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else {
          value.push(option.value);
        }
        this.menuVisibleOnFocus = true;
        this.$emit("input", value);
      } else {
        this.visible = false;
        this.$emit("input", option.value);
      }
    },
    toggleMenu() {
      if (!this.multiple) return;
      if (this.menuVisibleOnFocus) {
        this.menuVisibleOnFocus = false;
      } else {
        this.visible = !this.visible;
      }
    },
    handleInputClear() {
      this.$emit("input", "");
      this.$emit("clear");
      // this.visible = false;
    },
    handleFocus(e) {
      this.visible = true;
      this.$emit("focus", e);
      this.menuVisibleOnFocus = true;
      if (this.filterable) {
        this.selectedLabel = "";
      }
    },
    handleBlur(e) {
      setTimeout(() => {
        this.$emit("blur", e);
      }, 50);
      if (this.filterable) {
        this.selectedLabel = this.currentPlaceholder;
      }
    },
    resteInputWidth() {
      this.inputWidth = parseInt(
        this.$refs.reference.$el.getBoundingClientRect().width
      );
    },
    resetInputHeight() {
      this.$nextTick(() => {
        const tags = this.$refs.tags;
        const tagsHeight = tags
          ? Math.round(tags.getBoundingClientRect().height)
          : 0;
        let inputChildNodes = this.$refs.reference.$el.childNodes[0].childNodes;
        let input = [].filter.call(
          inputChildNodes,
          (item) => item.tagName === "INPUT"
        )[0];
        input.style.height =
          (tagsHeight > this.initialInputHeight
            ? tagsHeight + 6
            : this.initialInputHeight) + "px";

        console.log("tagsHeight", tagsHeight);
        // console.log("this.initialInputHeight", this.initialInputHeight);
        // console.log("input.style.height", input.style.height);
        this.broadcast("lkSelectDropdown", "updatePopper");
      });
    },
    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel;
        this.handleQueryChange(this.query);
      }
    },
    handleQueryChange(val) {
      this.filteredOptionsCount = this.optionsCount;
      this.broadcast("lkOption", "queryChange", this.query);
    },
    //点击空白区域隐藏面板
    closePanel(e) {
      e.stopPropagation();
      let elem = this.$el;
      if (elem && !elem.contains(e.target)) {
        this.visible = false;
      }
    },
    deleteTag(e, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1) {
        const value = this.value.slice();
        value.splice(index, 1);
        this.$emit("input", value);
        this.$emit("remove-tag", tag.value);
      }
    },
  },
};
</script>