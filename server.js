const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

// 创建 Express 应用程序
const app = express();

// 指定静态资源的根目录
const staticRoot = path.join(__dirname, '/');

// 配置静态资源中间件
app.use(express.static(staticRoot));

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
