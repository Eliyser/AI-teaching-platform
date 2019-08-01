'use strict';

const Controller = require('egg').Controller;

class RecordController extends Controller {
  //记录学习时长
  async learning_date() {

    let req = this.ctx.request.body;
    //接口数据校验
    const rule = {
      time: { type: 'int', required: true },
    };
    try {

      await this.ctx.validate(rule, req);//校验数据
      let date = new Date()
      req.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      req.username = this.ctx.state.user;
      const result = await this.ctx.service.record.learning_date(req);
      this.ctx.body = result;
    } catch (e) {
      console.log(e);

      this.ctx.status = 400;
      this.ctx.body = '请求参数格式不合法'
    }


  }
  //记录学习进度
  async learning_progress() {

    let req = this.ctx.request.body;
    //接口数据校验
    const rule = {
      course_id: { 
        type: 'integer', 
        required: true },
      project_id: { 
        type: 'integer', 
        required: true },
      current_step: { 
        type: 'integer', 
        required: true }
    };
    try {
      await this.ctx.validate(rule, req);//校验数据
      req.username = this.ctx.state.user;
      const result = await this.ctx.service.record.learning_progress(req);
      this.ctx.body = result;

    } catch (error) {
      console.log(error)
      this.ctx.status = 400;
      this.ctx.body = '请求参数格式不合法'
    }
    
  }

  //获取学生学习时间记录
  async show_time() {
    var res = {};
    let res1 = await this.app.mysql.select('learning_date_record',{
      where: {
        username: this.ctx.state.user
      },
      columns: ['date','count'],
      orders: [['date','desc']]
    })
    if(res1.length==0) {
      res.serialStu = 0; ;//连续学习天数
      res.bSerialStu = 0; //最大连续学习天数
      res.msg= "用户信息获取成功"
      res.dateRecord = [];
      this.ctx.body = res;
    } else{
      let count = 0;
      let serialStu = 0;
      let count_max = 0; //最大连续学习天数-1
      for(let i=0;i<res1.length-1;i++) {
        let diff = ((new Date(res1[i].date).getTime()) - (new Date(res1[i+1].date).getTime()))/(3600*24*1000)
        if(diff === 1) {
          count++;
        } else {
          serialStu = count+1;
          if(count>count_max) {
            count_max = count
          }
          count = 0;
        }
        if(count>count_max) {count_max = count;}
      }
      res.serialStu = serialStu; ;//连续学习天数
      res.bSerialStu = count_max+1; //最大连续学习天数
      res.msg= "用户信息获取成功"
      res.dateRecord = res1;
      this.ctx.body = res;
    }
    
  }

  //获取学生学习进度记录
  async show_progress() {

    var res = {};
    
    try {
      let result = await this.app.mysql.select('learning_progress',{
        where: {
          username: this.ctx.state.user
        }
      });
      res.data = [];
      if(result.length !== 0) {
        for(let i=0;i<result.length;i++) {
          res.data.push({
            "course_id": result[i].course_id,
            "project_id": result[i].project_id,
            "courseImg": result[i].image_url,
            "projectName": result[i].project_name,
            "courseName":  result[i].course_name,
            "progress": result[i].current_step+'/'+ result[i].step_amount
          })
        }
      } 
      res.msg = '学生进度信息获取成功'

    } catch (error) {
      res.msg = '学生进度信息获取失败'
    }
    this.ctx.body = res;

  }
  async delete() {
    var res = {};
    let id = this.ctx.query.course_id;
    let result = await this.app.mysql.delete('learning_progress_record',{
      username: this.ctx.state.user,
      course_id: id 
    })
    if(result.affectedRows === 1) {
      res.msg = '删除学习记录成功'
    } else{
      res.msg = '删除学习记录失败'
      this.ctx.status = 400
    }

    this.ctx.body = res;
  }

}

module.exports = RecordController;
