'use strict';

const Service = require('egg').Service;
const JWT = require('jsonwebtoken');

class UserService extends Service {
  //生成token函数
  createToken(data) {
    return JWT.sign(data, this.config.jwt.secret, {
      expiresIn: 24 * 60 * 60 * 1
      // expiresIn: 5*60*1, 
    });
  }

 
  // 登录接口
  async login(loginMsg) {
    var res = {};
    //将登录信息与数据库中的信息进行比对，存在该用户返回true
    const vertifyUser = await this.app.mysql.get('user', {
      user_id: loginMsg.user_id
    });

    if (!vertifyUser) {
      res.code = -2;
    } else {
      //验证该用户的密码是否正确
      if (vertifyUser.password != loginMsg.password) {
        res.code = -1;
      } else {
        const token = this.createToken({
          user_id: loginMsg.user_id
        });

        if(vertifyUser.first_login_time==null) {
          
          let date = new Date()
          let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
          console.log(time);
          const row = {
            first_login_time: time
          }
          const options = {
            where:{
              user_id: loginMsg.user_id}
          }
          const result = await this.app.mysql.update('user',row,options);

        }
        res.userInfo = {
          user_id: loginMsg.user_id,
          user_name: vertifyUser.user_name
        };
        res.code = 1;
        res.token = token;
      }
    }

    return res;
  }

  async vertifyUser(params) {
    let result = await this.app.mysql.get('user',{
      user_id: params
    })
    if(result === null) {
      return  'user_id出错，找不到用户名'
    } else {
      return  result.user_name

    }
  }
}

module.exports = UserService;
