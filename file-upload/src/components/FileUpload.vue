<template>
  <div class="drop-box">
    <div
      class="drop-area"
      @click="handleClick"
      @drop.prevent="handleDrop"
      @dragover.prevent
    >
      <i class="iconfont icon-upload upload-icon"></i>
      <p class="tips">点击&拖拽文件到此处</p>
    </div>
    <div class="task-list">
      <div
        class="task"
        :class="progressCss[item.status - 1]"
        v-for="item in tasks"
        :key="item.id"
        :style="{ width: item.progress + '%' }"
      >
        <a target="_blank" :href="item.url" class="task-name">{{
          item.name
        }}</a>
        <span class="task-progress">{{ item.progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
// 上传状态码 上传中：1 上传成功：2 上传失败：3
const TASK_STATUS = {
  PROCESSING: 1,
  SUCCESS: 2,
  ERROR: 3,
};
import computeFileMD5 from "@/assets/sprakMd5.js";
import axios from "axios";
import base from "@/assets/api.js";
export default {
  data() {
    return {
      tasks: [],
      progressCss: ["progress", "progress-down", "progress-wrong"],
    };
  },
  methods: {
    // 点击上传文件
    async handleClick() {
      // 打开文件
      const arrFileHandle = await window.showOpenFilePicker({
        multiple: true,
      });

      // 遍历选择的文件
      for (const fileHandle of arrFileHandle) {
        // 获取文件内容
        const file = await fileHandle.getFile();
        this.upload(file);
      }
    },

    // 拖动文件放置在目标区域
    handleDrop(e) {
      const { items, files } = e.dataTransfer;
      // 判断上传是一个文件还是多个文件
      if (items) {
        for (const item of items) {
          if (item.kind === "file") {
            // 获取拖拽数据file对象
            const file = item.getAsFile();
            // console.log("file:", file);
            this.upload(file);
          }
        }
      } else {
        for (const file of files) {
          // console.log("file:", file);
          this.upload(file);
        }
      }
    },

    // 上传文件
    upload(file) {
      const formData = new FormData();
      // 把文件转换成发出去的格式
      formData.append("file", file);
      const task = {
        id: this.tasks.length,
        name: file.name,
        status: TASK_STATUS.PROCESSING,
        progress: 0,
      };
      // 判断文件是否已经上传
      async function fileAdd(file) {
        let md5 = await computeFileMD5(file);
        axios
          .get(`${base.dev}/hash`, {
            params: md5,
          })
          .then((res) => {
            if (res.data.status == 0) {
              task.progress = 100;
              task.status = TASK_STATUS.SUCCESS;
              task.url = res.data.data.url;
            } else {
              uploadFile(md5);
            }
          });
      }
      // 上传文件
      function uploadFile(md5) {
        axios
          .post(`${base.dev}/upload`, formData, {
            headers: {
              "Content-type": "multipart/form-data",
              "x-file-name": encodeURIComponent(file.name),
              uniqueHash: md5,
            },
            // 计算进度值
            onUploadProgress: (e) => {
              const { loaded, total } = e;
              const progress = Math.round((loaded / total) * 100);
              task.progress = progress;
            },
          })
          .then(
            (res) => {
              task.status = TASK_STATUS.SUCCESS;
              task.url = res.data.url;
            },
            () => {
              task.status = TASK_STATUS.ERROR;
            }
          );
      }
      fileAdd(file);
      this.tasks.unshift(task);
      // 滚动条自动滚到顶部
      document.getElementsByClassName("task-list")[0].scrollTop = 0;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.drop-box {
  width: 90vw;
  .drop-area {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8c8c8c;
    border: 6px dashed #bfbfbf;
    border-radius: 16px;
    cursor: pointer;
    .upload-icon {
      color: #40a9ff;
      font-size: 100px;
    }
    .tips {
      font-size: 40px;
    }
  }
  .task-list {
    height: 40vh;
    margin-top: 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .task {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      align-items: center;
      font-size: 24px;
      color: #333;
      padding: 16px;
    }
    .progress {
      background-color: #bae7ff;
    }
    .progress-down {
      background-color: #d9f7be;
    }
    .progress-wrong {
      background-color: #ffccc7;
    }
  }
}
</style>
