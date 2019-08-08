'use strict';
const Crypto = require('crypto');
const fs = require('fs');
module.exports = {
  // md5加密
  encrypt(data) {

    const md5 = Crypto.createHash('md5');
    const result = md5.update(data).digest('hex');

    // console.log(result);
    const a = '202cb962ac59075b964b07152d234b70';//123的md5加密结果
    return result;
  },
  // md5解密
  decrypt(pwd) {
    
  }
};
