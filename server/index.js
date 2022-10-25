const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;
// 获取存储文件夹绝对路径
const uploadsPath = path.resolve(__dirname, "./uploads");

const map = new Map();

// 磁盘存储引擎
const storage = multer.diskStorage({
  // 确定上传的文件应该存储在哪个文件夹中
  destination: function (req, file, callback) {
    callback(null, uploadsPath);
  },
  // 确定文件名
  filename: function (req, file, callback) {
    const filename = req.headers["x-file-name"];
    console.log(decodeURIComponent(filename));
    callback(null, `${Date.now()}-${decodeURIComponent(filename)}`);
    return;
  },
});

const upload = multer({ storage });

// 启动跨域和服务的预检请求
app.use(cors());

// 将文件存在req.file中返回
app.post("/upload", upload.single("file"), (req, res) => {
  map.set(req.headers.uniquehash, req.file);
  console.log("map", map, "req", req.file);
  res.json({ url: `http://localhost:3000/uploads/${req.file.filename}` });
});

// 判断相同文件秒传
app.get("/hash", (req, res) => {
  let query = req.query[0];
  if (map.has(query)) {
    res.send({
      status: 0, //0表示成功 1表示失败
      msg: "文件已经上传", //状态的描述
      data: {
        url: `http://localhost:3000/uploads/${decodeURIComponent(
          map.get(query).filename
        )}`,
      }, //需要响应给客户端的数据
    });
  } else {
    res.send({
      status: 1, //0表示成功 1表示失败
      msg: "文件没有上传", //状态的描述
      data: query, //需要响应给客户端的数据
    });
  }
});

// 设置路由
app.use("/uploads", express.static(uploadsPath));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
