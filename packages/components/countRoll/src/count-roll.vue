<template>
  <div class="lk-count-roll" v-if="orderNum.length > 0">
    <div
      class="lk-count-roll_wrap"
      :class="{ 'is-number': !isNaN(item) }"
      v-for="(item, index) in orderNum"
      :key="index"
    >
      <div ref="numberItem" v-if="!isNaN(item)" class="lk-count-roll_item">
        <span v-for="i in 10" :key="i">{{ i - 1 }}</span>
      </div>
      <div v-else>,</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "lkCountRoll",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    //输入限定位数
    rollCount: {
      type: Number,
      validator: (val) => {
        return val >= 4 && val <= 8;
      },
      default: 6,
    },
    animation: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value: {
      handler(val) {
        this.setNumber(val);
      },
      immediate: true,
    },
  },
  data() {
    return {
      orderNum: [],
      numberItem: [],
      timer: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.numberItem = this.$refs.numberItem;
    });
  },
  methods: {
    //处理传入数据为数组数据
    setOrderNum(val) {
      val = parseInt(val).toString();
      let diffLen = this.rollCount - val.length;
      if (diffLen >= 0) {
        let str = "";
        while (diffLen) {
          val = "0" + val;
          diffLen--;
        }
        for (let i = 0, len = val.length; i < len; i++) {
          if (i !== 0 && (len - i) % 3 == 0) {
            str += ",";
          }
          str += val[i];
        }
        this.orderNum = str.split("");
      } else {
        this.$message.warning("超过限定长度");
      }
    },
    //设置正常数字
    setNumber(val) {
      this.setOrderNum(val);
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setNumberTransform(this.orderNum);
      });
    },
    //设置显示数字
    setNumberTransform(str) {
      let index = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        let val = str[i];
        if (isNaN(val)) {
          continue;
        }
        if (this.numberItem.length) {
          this.numberItem[index].style.transform =
            "translateY(-" + val * 10 + "%)";

          const _transition = this.animation
            ? "transform .5s ease-in-out"
            : "none";

          this.numberItem[index].style.transition = _transition;
          index++;
        }
      }
    },
  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
  },
};
</script>