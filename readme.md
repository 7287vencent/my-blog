## admin  后端
## blog   前端
## service 服务端


### 注意
启动后端端口时：只能使用127.0.0.1:3001
不能使用localhost:3001，这样用的话，服务端，获取不到session,原因暂时未知

### 使用pm2 守护
#### 前端
```
cd blog 
npm i
npm run build 
pm2 start npm -- run start
// open http://localhost:3000/
```
#### 服务端
```
cd service
npm i
// npm start
// open http://localhost:7001/
pm2 start server.js --name test
```
egg 如果想要使用pm2守护的话
需要按准过`egg-script`
并且配置
```
"start": "egg-scripts start --daemon --title=egg-server-service",
"stop": "egg-scripts stop --title=egg-server-service",
```
另外新建 server.js文件
#### 后端
```
cd admin 
npm i
npm run build 
// pm2 start 'npm start'
pm2 start --name admin2 'npm start'
// open http://localhost:3001/
```