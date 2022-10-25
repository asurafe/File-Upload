# 文件上传

### 文件批量拖拽上传的前后端实现，可展示上传进度和上传结果。

##### 前端：Vue2 + axios + sass + iconfont
##### 后端：Node + Express + Multer

### 前端
* 文件上传
    文件上传分为两种
    - 点击上传 通过`window.showOpenFilePicker` API 唤起文件夹选择文件进行上传
    - 拖拽上传 通过原型上的`dataTransfer`属性获取上传的文件
    通过`formData`将文件转换为上传的格式，然后通过`axios`进行上传
* 进度条
    通过`axios`中`onUploadProgress`动态计算出进度值，再通过`vue`双向数据绑定修改进度条进度，样式通过动态样式控制进度条宽度实现
* 相同文件秒传
    前端通过`MD5`加密算法计算出`hash`值传递给后端，后端判断是否存在此文件。
### 后端
* `Express` 基于 `Node.js` 平台的 `web` 应用开发框架
* `Multer`  `Node.js`中间件，用于处理 `multipart/form-data` 类型的表单数据，它主要用于上传文件。
* `Nodemon` 监视文件更改后自动重新启动节点

