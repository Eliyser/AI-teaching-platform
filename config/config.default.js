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
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1563759840532_9296';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  //配置模板引擎
  config.view={
    mapping: {
      '.html': 'ejs',
    },
  };

  //配置mysql
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // host: '120.79.148.35',
      // host: '47.96.95.75',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      //密码 
      password: '123456',
      // 数据库名
      database: 'ai_teaching_platform',

    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  //允许跨域访问
  config.cors = {
    // origin: 'http://192.168.1.123:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true
  };

  //修改csrf
  config.security = {
    domainWhiteList: ['http://192.168.1.123:8080', 'http://localhost:8080', 'http://192.168.1.243:8080'],
    csrf: {
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      enable: false,
      ignoreJSON: true,
    },
  };
  //配置JWT
  config.jwt = {

    secret: "xiaoAqianduanzu"
  };
  config.multipart = {
    // mode: 'file',
    fileSize: '80mb',
    fileExtensions: [
      '.foo',
      '.apk',
    ],
  };
  config.alinode = {
   server: 'wss://agentserver.node.aliyun.com:8080',
   appid: '81727',
   secret: 'c07688bc1b145e29827b59894b2a2cd433aadf29',
   logdir: '/root/logs/alinode/'
 }
  return config;
};
