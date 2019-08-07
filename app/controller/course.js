'use strict';

const Controller = require('egg').Controller;

var fs = require("fs");
var marked = require("marked");

class CourseController extends Controller {

  //获取所有章节信息
  async allCourse() {
    var res = {};
    let stuId = this.ctx.state.user;
    let result0 = await this.app.mysql.get('user', {
      user_id: stuId
    })
    if (result0.length == 0) {
      res.msg = '获取章节信息失败';
      this.ctx.status = 400;
    } else {
      let strArrray = result0.visable_course.split(',')
      let courseArray = [];
      strArrray.forEach(function (data) {
        courseArray.push(parseInt(data))
      });
      const result = await this.app.mysql.select('course', {
        where: { course_id: courseArray }
      });
      for (let i = 0; i < result.length; i++) {
        let str = result[i].tag;
        result[i].tag = str.split('&');
        result[i].active = false;
      }
      if (result.length != 0) {
        result.unshift({
          "active": true,	//
          "course_name": "全部",
          "course_id": 0,
          "course_description": "",
          "project_amount": 0,
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
    }

    this.ctx.body = res;
  }
  //根据标签获取分类的章节
  async courseByTag() {
    var res = {};
    res.data = [];
    const tag = this.ctx.query.tag;
    const result = await this.app.mysql.select('course');
    var flag = false;
    for (let i = 0; i < result.length; i++) {
      let str = result[i].tag;
      if (str.search(tag) != -1) {
        result[i].tag = str.split('&');
        res.data.push(result[i]);
        flag = true;
      }
    }
    if (result.length != 0 && flag == true) {
      res.msg = '获取分类信息成功';
    } else {
      res.msg = '获取分类信息失败';
      this.ctx.status = 400;
    }
    this.ctx.body = res;
  }
  //获取指定章节的所有项目
  async allProject() {
    var res = {};
    res.data = {};
    const c_id = this.ctx.query.id;
    const result = await this.app.mysql.select('specific_project', {
      where: { course_id: c_id }
    })
    if (result.length != 0) {
      res.msg = '获取项目信息成功';
      res.data.course_id = c_id;
      res.data.header = {
        'title': result[0].course_name,
        'introduction': result[0].course_description
      }
      res.data.body = {
        'title': '章节内容',
        'project': []
      };
      for (let i = 0; i < result.length; i++) {
        res.data.body.project.push({
          'project_id': result[i].project_id,
          'title': result[i].project_name,
          'content': result[i].project_description
        })
      }
    } else {
      res.msg = '获取项目信息失败';
      this.ctx.status = 400;
    }

    this.ctx.body = res;
  }
  //获取具体项目内容
  async project() {
    var requestMsg = this.ctx.request.body;
    var res = {};
    res.data = {};
    var result = await this.app.mysql.select('specific_project', {
      where: {
        course_id: requestMsg.course_id,
        project_id: requestMsg.project_id
      },
      columns: ['course_id', 'course_name', 'project_id', 'project_name', 'document', 'all_steps', 'step_amount']
    })

    if (result.length != 0) {

      res.msg = '获取项目信息成功'
      res.data.course_id = result[0].course_id;
      res.data.course_name = result[0].course_name;
      res.data.project_id = result[0].project_id;
      res.data.project_name = result[0].project_name;
      res.data.step_amount = result[0].step_amount;
      res.data.steps = result[0].all_steps.split(';');
      //处理md字符串
      let md_array = result[0].document.split(/(?=[\n]##[\s])/g)
      let title = md_array.shift() + '\n';
      let steps_md_array = [];
      for (let i = 0; i < md_array.length; i++) {
        steps_md_array.push(md_array[i].replace('\n', '') + '\n');
      };
      res.steps_md_array = steps_md_array;

      //转换成html
      let html_str = marked(result[0].document)
      let steps = html_str.split(/(?=<h2)/g);
      steps.shift();
      res.data.steps_html = steps;

    } else {
      res.msg = '获取项目信息失败';
      this.ctx.status = 400;
    }
    this.ctx.body = res;
  }
  //获取学生可见的所有标签
  async getTag() {

    var res = {};
    let stuId = this.ctx.state.user;
    let result0 = await this.app.mysql.get('user', {
      user_id: stuId
    })
    if (result0.length == 0) {
      res.msg = '获取标签信息失败';
      this.ctx.status = 400;
    } else {
      let strArrray = result0.visable_course.split(',')
      let courseArray = [];
      strArrray.forEach(function (data) {
        courseArray.push(parseInt(data))
      });
      const result = await this.app.mysql.select('course', {
        where: { course_id: courseArray },
        columns: ['tag']
      });
      if (result.length === 0) {
        this.ctx.body = {
          msg: '获取标签信息失败'
        }
        this.ctx.status = 400
      } else {
        let array = [];
        await result.forEach(element => {
          let str = element.tag.split('&');
          array = array.concat(str);
        });

        let set = [...new Set(array)];
        res.msg = '获取标签信息成功';
        res.data = set;
      }
    }

    this.ctx.body = res;

  }


}

module.exports = CourseController;