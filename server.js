const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const webPush = require("web-push");
require('dotenv').config();


// create server key pairs
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
    "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
}
webPush.setVapidDetails(
  "https://localhost:8000/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 创建 Express 应用程序
const app = express();

// 指定静态资源的根目录
const staticRoot = path.join(__dirname, '/');
// 获取传参中间件
app.use(express.json());
// 配置静态资源中间件
app.use(express.static(staticRoot));
app.get("/vapidPublicKey", function (req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});
app.post("/register", function (req, res) {
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

app.post("/sendNotification", function (req, res) {
  // in real world, you don't need client to trigger it but pick the subscription yourself from maybe a database
  const subscription = req.body.subscription;
  const payload = null;
  const options = {
    TTL: req.body.ttl,
  };

  setTimeout(function () {
    console.log('success inter')
    webPush
      .sendNotification(subscription, payload, options)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        res.sendStatus(500);
        console.log(error);
      });
  }, req.body.delay * 1000);
});


// 指定监听端口
const port = 8000;





// 读取 SSL 证书和私钥
const privateKeyPath = 'mydomain.key';
const certificatePath = 'mydomain.crt';
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// 创建 HTTPS 服务器
const server = https.createServer(credentials, app);

// 启动服务器
server.listen(port, () => {
  console.log(`Static resource server is running on port ${port}`);
});
