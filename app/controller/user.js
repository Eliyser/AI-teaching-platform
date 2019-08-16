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
      user_id: { type: 'int', required: true },
      password: { type: 'string', required: true }
    };

    var loginMsg = ctx.request.body;
    try {
      await ctx.validate(rule, loginMsg);//校验数据


    }
    catch (e) {
      console.log(e);
      ctx.status = 400;
      return ctx.body = '请求参数格式不合法'
    }
    var result = await ctx.service.user.login(loginMsg);
    // //把密码进行md5加密
    // loginMsg.password = ctx.helper.encrypt(loginMsg.password);
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
        res.data = result.userInfo;
        // 把token加入cookie
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
  //验证用户是否登录
  async vertify() {
    var token = this.ctx.cookies.get('egg_token', {
      signed: true,
    })
    if (token === undefined) {
      this.ctx.status = 401;
      return this.ctx.body = {
        msg: '未授权，请登录'
      }

    } else {
      let decode;
      try {
        decode = JWT.verify(token, "xiaoAqianduanzu");
        if (!decode || !decode.user_id) {
          this.ctx.status = 401;
          return this.ctx.body = {
            msg: '未授权，请登录'
          }

        }
        if (Date.now() / 1000 - decode.exp > 0) {
          this.ctx.status = 402;
          return this.ctx.body = {
            msg: '登录已过期，请重新登录'
          }
        }
        console.log(decode.user_id);
        let result = await this.ctx.service.user.vertifyUser(decode.user_id)
        this.ctx.body = {
          msg: '用户已登录',
          user_id: decode.user_id,
          user_name: result
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
  //获取用户信息接口
  async userMsg() {


    let res1 = await this.app.mysql.select('learning_date_record', {
      where: {
        user_id: this.ctx.state.user
      },
      columns: ['date', 'count'],
      orders: [['date', 'desc']]
    });


    let result = await this.app.mysql.select('user', {

      where: { user_id: this.ctx.state.user },
      columns: ['user_id', 'user_name', 'school', 'first_login_time','grade','class']
    })
    if (result.length == 0) {
      return this.ctx.body = {
        msg: '用户信息获取失败'
      }

    }
    let effectiveTime = 0;//有效学习时间
    for(let i = 0;i<res1.length;i++) {
      effectiveTime += parseInt(res1[i].count);
    }
    //实验次数
    
    let result1 = await this.app.mysql.select('learning_progress_record',{
      where: {
        user_id: this.ctx.state.user,
        project_status: 'finished'
      }
    })
    let experimentsTime = result1.length;
    console.log(result1)
    this.ctx.body = {
      msg: '用户信息获取成功',
      data: [{
        'stuId': result[0].user_id,
        'stuName': result[0].user_name,
        'stuSchool': result[0].school,
        'stuGrade': result[0].grade+ result[0].class+'班',
        'stuAddtime': result[0].first_login_time,
        'effectiveTime': effectiveTime,
        "experimentsTime": experimentsTime
      }]
    }


  }

}
module.exports = UserController;
