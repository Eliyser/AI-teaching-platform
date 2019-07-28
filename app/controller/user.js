'use strict';
/**
 *  用户登录接口
 */
const Controller = require('egg').Controller;
const JWT = require('jsonwebtoken');

class UserController extends Controller {

  //登录接口
  async login() {
    const { ctx } = this;
    //接口数据规则
    const rule = {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    };

    var loginMsg = ctx.request.body;
    try {
      await ctx.validate(rule, loginMsg);//校验数据
      //把密码进行md5加密
      loginMsg.password = ctx.helper.encrypt(loginMsg.password);
      var result = await ctx.service.user.login(loginMsg);
      var res = {};
      switch (result.code) {
        case -2:
          res.msg = '用户不存在';
          ctx.status = 400
          break;
        case -1:
          res.msg = '用户密码不正确';
          ctx.status = 400
          break;
        case 1:
          res.msg = '登录成功';
          res.data = loginMsg.username;
          //把token加入cookie
          ctx.cookies.set('egg_token', result.token, {
            maxAge: 24 * 3600 * 1000,
            httpOnly: true,
            // overwrite:true,
            signed: true,
          })
          break;
      }

      ctx.body = res;
    }
    catch (e) {
      console.log(e);
      ctx.status = 400;
      ctx.body = '请求参数格式不合法'
    }
  }
  //验证用户是否登录
  async vertify() {
    var token = this.ctx.cookies.get('egg_token', {
      signed: true,
    })
    if (token === undefined) {
      console.log('没有token')
      this.ctx.throw(401, '未授权，请登录');
    } else {
      let decode;
      try {
        decode = JWT.verify(token, "xiaoAqianduanzu");
        if (!decode || !decode.username) {

          ctx.throw(401, '未授权，请登录');
        }
        if (Date.now() / 1000 - decode.exp > 0) {
          ctx.throw(402, '登录已过期，请重新登录');
        }
        console.log(decode.username);
        this.ctx.body = {
          username: decode.username
        };
      } catch (e) {
        console.log(e);
      }
    }

  }
  //用户登出接口
  async logout() {

    try {
      this.ctx.cookies.set('egg_token', null);
      this.ctx.body = {
        msg: '注销成功'
      }
    } catch (e) {
      this.ctx.throw(400, '注销失败');
    }
  }


  async userMsg() {

    var token = this.ctx.cookies.get('egg_token', {
      signed: true,
    })
    if (token === undefined) {
      console.log('没有token')
      this.ctx.throw(401, '未授权，请登录');
    } else {
      let decode;
      try {
        decode = JWT.verify(token, "xiaoAqianduanzu");
        if (!decode || !decode.username) {

          ctx.throw(401, '未授权，请登录');
        }
        if (Date.now() / 1000 - decode.exp > 0) {
          ctx.throw(402, '登录已过期，请重新登录');
        }
        let result = await this.app.mysql.select('user',{
      
          where:{username: decode.username},
          columns: ['username','school','first_login_time']
        })
        if(result.length == 0) {
          this.ctx.body = {
            msg: '用户信息获取失败'
          }

        } else {
          this.ctx.body = {
            msg: '用户信息获取成功',
            data: [{
                'stuName':result[0].username,
                'stuSchool':result[0].school,
                'stuAddtime':result[0].first_login_time,
            }]
          }
        }
        


      } catch (e) {
        console.log(e);
      }
    }
    

  } 

}
module.exports = UserController;
