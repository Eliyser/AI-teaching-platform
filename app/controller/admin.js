'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
    //管理员登录
    async login() {
      const { ctx } = this;
      //接口数据规则
      const rule = {
        name: { type: 'String', required: true },
        password: { type: 'string', required: true }
      };
  
      var loginMsg = ctx.request.body;
      try {
        await ctx.validate(rule, loginMsg);//校验数据
        //把密码进行md5加密
        loginMsg.password = ctx.helper.encrypt(loginMsg.password);
        var result = await ctx.service.admin.login(loginMsg);
        var res = {};
        switch (result.code) {
          case -2:
            res.msg = '管理员不存在';
            ctx.status = 400
            break;
          case -1:
            res.msg = '管理员密码不正确';
            ctx.status = 400
            break;
          case 1:
            res.msg = '登录成功';
            res.data = {
              name: loginMsg.name
            };
            // 把token加入cookie
            ctx.cookies.set('egg_admin_token', result.token, {
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
    //管理员获取全部课程
    async allCourse() {
      var res = {};
      const result = await this.app.mysql.select('course');
      for(let i=0;i<result.length;i++) {
        let str = result[i].tag;
        result[i].tag = str.split('&');
        result[i].active = false;
      }
      if(result.length!=0) {
        result.unshift({
          "active": true,	//
          "course_name": "全部",
          "course_id": 0, 
          "course_description": "",
          "project_amount": 4, 
          "tag": ["全部"], 
          "image_url": "", 
          "learn_amount": 0
        })
  
        res.msg = '获取章节信息成功';
        res.data = result;
      } else {
        // this.ctx.throw('400','获取章节信息失败');
        res.msg = '获取章节信息失败';
        this.ctx.status = 400;
      }
      this.ctx.body = res;
    }

    //获取新增学生的起始 id
    async getBeginId() {
      let res = {}
      try {
        let result = await this.app.mysql.select('user',{
          columns: ['user_id'],
          orders: [['user_id','desc']]
        })
        res.begin_id = result[0].user_id + 1
        res.msg = '获取信息成功'
      } catch (error) {
        res.msg = '获取信息失败'
      }
    
      this.ctx.body = res;

    }

}

module.exports = AdminController;
