<template>
  <div class="lk-upload">
    <input
      ref="input"
      type="file"
      hidden
      @change="handleChange"
      :multiple="multiple"
      :accept="accept"
    />

    <div
      v-if="!isShowPicture"
      class="lk-upload_inner"
      :class="{ 'is-drag': drag }"
      @click="handleClick"
      @drop.prevent="onDrag"
      @dragover.prevent
    >
      <slot></slot>
    </div>

    <div v-if="$slots.tip" class="lk-upload_tip">
      <slot name="tip"></slot>
    </div>

    <!-- 上传文件列表 -->
    <transition-group
      name="lk-zoom-in-top"
      class="lk-upload-list"
      :class="{ 'is-picture': isShowPicture }"
    >
      <!-- <ul> -->
      <li
        class="lk-upload-list_item"
        v-for="file in allFileList"
        :key="file.uid"
      >
        <template v-if="isShowPicture">
          <div class="lk-upload-list_item_img">
            <div class="lk-upload-list_item_img_mask"></div>
            <i
              @click="handleRemove(file)"
              class="lk-icon-delete lk-upload-list_item_img_close"
            ></i>
            <img :src="file.url" />
          </div>
        </template>
        <template v-else>
          <i class="lk-icon-document"></i>
          <span class="lk-upload-list_item_name"> {{ file.name }}</span>
          <i
            @click="handleRemove(file)"
            class="lk-upload-list_item_close lk-icon-close"
          ></i>
        </template>
      </li>
      <!-- </ul> -->
    </transition-group>
    <div
      v-if="isShowPicture"
      class="lk-upload_inner is-picture"
      @click="handleClick"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import ajax from "./ajax";
function noop() {}
export default {
  name: "lkUpload",
  props: {
    name: {
      type: String,
      default: "file",
    },
    action: {
      type: String,
      required: true,
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    accept: String,
    multiple: Boolean,
    disabled: Boolean,
    drag: Boolean,
    autoUpload: {
      type: Boolean,
      default: true,
    },
    httpRequest: {
      type: Function,
      default: ajax,
    },
    onStart: {
      type: Function,
      default: noop,
    },
    onProgress: {
      type: Function,
      default: noop,
    },
    onSuccess: {
      type: Function,
      default: noop,
    },
    onError: {
      type: Function,
      default: noop,
    },
    onRemove: {
      type: Function,
      default: noop,
    },
    limit: Number,
    onExceed: {
      type: Function,
      default: noop,
    },
    onChange: {
      type: Function,
      default: noop,
    },
    beforeUpload: Function,
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    listType: String,
  },
  watch: {
    fileList: {
      immediate: true,
      handler(list) {
        this.allFileList = list.map((item) => {
          item.status = "finished";
          item.percentage = 100;
          item.uid = new Date().getTime() + this.upIndex++;
          return item;
        });
      },
    },
  },
  computed: {
    isShowPicture() {
      return this.listType === "picture" && !this.drag;
    },
  },
  data() {
    return {
      allFileList: [],
      upIndex: 1,
    };
  },
  methods: {
    onDrag(e) {
      if (!this.drag || this.disabled) return;
      const files = e.dataTransfer.files;
      this.uploadFiles(files);
    },
    handleStart(rawFile) {
      this.onStart(rawFile);
      rawFile.uid = Date.now() + this.upIndex++;
      let file = {
        status: "ready",
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
      };
      if (this.listType === "picture") {
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[Element Error][Upload]", err);
          return;
        }
      }
      this.allFileList.push(file);
      this.onChange(file, this.allFileList);
    },
    handleRemove(file) {
      this.allFileList.splice(this.allFileList.indexOf(file), 1);
      this.onRemove(file, this.allFileList);
      this.onChange(file, this.allFileList);
    },
    handleChange(e) {
      const files = e.target.files;
      if (!files) return;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      //超过限制长度
      if (this.limit && this.allFileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.allFileList);
        return;
      }
      //转成数组便于操作
      let postFiles = Array.prototype.slice.call(files);
      if (postFiles.length === 0) return;
      postFiles.forEach((rawFile) => {
        //开始上传的钩子
        this.handleStart(rawFile);
        this.autoUpload && this.upload(rawFile);
      });
    },
    //更新文件数据前做数据处理
    upload(rawFile) {
      this.$refs.input.value = null;
      //上传文件前，没有自定义上传前钩子
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }
      //上传文件前，自定义上传前钩子
      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(
          (processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile);

            if (fileType === "[object File]" || fileType === "[object Blob]") {
              if (fileType === "[object Blob]") {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type,
                });
              }
              for (const p in rawFile) {
                if (rawFile.hasOwnProperty(p)) {
                  processedFile[p] = rawFile[p];
                }
              }
              this.post(processedFile);
            } else {
              this.post(rawFile);
            }
          },
          () => {
            this.handleRemove(rawFile);
          }
        );
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.handleRemove(rawFile);
      }
    },
    //上传文件数据到后台地址
    post(rawFile) {
      const option = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        action: this.action,
        file: rawFile,
        data: this.data,
        filename: this.name,
        onProgress: (e) => {
          this.onProgress(e, rawFile, this.allFileList);
        },
        onSuccess: (e) => {
          this.onSuccess(e, rawFile, this.allFileList);
        },
        onError: (e) => {
          this.onError(e, rawFile, this.allFileList);
        },
      };
      const req = this.httpRequest(option);
      if (req && req.then) {
        req.then(option.onSuccess, option.onError);
      }
    },
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
  },
  beforeDestroy() {
    this.allFileList.forEach((file) => {
      if (file.url && file.url.indexOf("blob:") === 0) {
        URL.revokeObjectURL(file.url);
      }
    });
  },
};
</script>