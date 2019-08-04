'use strict';

const Service = require('egg').Service;
const JWT = require('jsonwebtoken');
class AdminService extends Service {
  //生成token函数
  createToken(data) {
    return JWT.sign(data, this.config.jwt.secret, {
      expiresIn: 24 * 60 * 60 * 1
      // expiresIn: 5*60*1, 
    });
  }

    async login(loginMsg) {
        var res = {};
        //将登录信息与数据库中的信息进行比对，存在该用户返回true
        const vertifyUser = await this.app.mysql.get('admin', {
          name: loginMsg.name
        });
    
        if (!vertifyUser) {
          res.code = -2;
        } else {
          //验证该用户的密码是否正确
          if (vertifyUser.password != loginMsg.password) {
            res.code = -1;
          } else {
            const token = this.createToken({
              name: loginMsg.name
            });
    
            res.code = 1;
            res.token = token;
          }
        }
    
        return res;
  }
}

module.exports = AdminService;
