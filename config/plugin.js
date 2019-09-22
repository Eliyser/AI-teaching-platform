'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
//ejs插件
exports.ejs={ 
  enable:true, 
  package:'egg-view-ejs',
};
//jwt
exports.jwt = {
  enable: true,
  package: "egg-jwt"
};
//mysql
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
//跨域调用插件
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.alinode = {
  enable: true,
  package: 'egg-alinode'
};
