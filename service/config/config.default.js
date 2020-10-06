/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {

  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1591173407209_4011';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // 对 mysql 数据库的配置项 
  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: '12341234',
      // database
      database: 'react_blog',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  // 对 cros 的配置
  config.security = {
    csrf: { enable: false },
    domainWhiteList: ['http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://localhost:3001']
  };
  config.cors = {
    // origin: 'http://localhost:3000', //只允许这个域进行访问接口
    credentials: true,   // 开启认证 允许cookied跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };

  return {
    ...config,
    ...userConfig,
  };
};
