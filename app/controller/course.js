'use strict';

const Controller = require('egg').Controller;

var fs = require("fs");
var marked = require("marked");

class CourseController extends Controller {
  async test() {
    var path = 'C:/Users/11023/Desktop/AI教学平台/Linux项目实训/Linux系统简介.md';
    var res = fs.readFileSync(path);
    var str = res.toString();
    // console.log(str.length)
    let html_str = marked(str)
    
    const row = {
      document: str
    }
    const options = {
      where: {
        project_serial: 1
      }
    }
    const result = await this.app.mysql.update('project', row, options)
    // console.log(result)
    this.ctx.body = html_str;
    
  }

  //获取所有章节信息
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
        "course_id": 1, 
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
  //根据标签获取分类的章节
  async courseByTag() {
    var res = {};
    res.data = [];
    const tag = this.ctx.query.tag;
    const result = await this.app.mysql.select('course');
    var flag = false;
    for(let i=0;i<result.length;i++) {
      let str = result[i].tag;
      if(str.search(tag) != -1) {
        result[i].tag = str.split('&');
        res.data.push(result[i]);
        flag = true;
      } 
    }
    if(result.length!=0 && flag == true) {
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
    const result = await this.app.mysql.select('specific_project',{
      where: {course_id: c_id}
    })
    if(result.length!=0) {
      res.msg = '获取项目信息成功';
      res.data.course_id = c_id;
      res.data.header = {
        'title': result[0].course_name,
        'introduction': result[0].course_description
      }
      res.data.body = {
        'title':'章节内容',
        'project': []
      };
      for(let i=0;i<result.length;i++) {
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
    var result = await this.app.mysql.select('specific_project',{
      where: {
        course_id: requestMsg.course_id,
        project_id: requestMsg.project_id
      },
      columns: ['course_id','course_name','project_id','project_name','document','all_steps','step_amount']
    })
    
   
    // var str = 'as\n\r## 还是\r\nw'
    // var pattern = /##+[\S*]+.\\r\\n/;
    // var pattern = /##(.*?)(?=\\r\\n]).w/;

    
    // var pattern = /(?<=#{2}\s).*?(?=\r\n)/g;
    // let r = res.document.match(pattern);
    // // let r = str.match(pattern)
    // console.log(r)

    if(result.length!=0) {
      
      res.msg = '获取项目信息成功'
      res.data.course_id = result[0].course_id;
      res.data.course_name = result[0].course_name;
      res.data.project_id = result[0].project_id;
      res.data.project_name = result[0].project_name;
      res.data.step_amount = result[0].step_amount;
      res.data.steps = result[0].all_steps.split(';');
      res.data.document_md = result[0].document;
      res.data.document_html = marked(result[0].document)
     
    } else {
      res.msg = '获取项目信息失败';
      this.ctx.status =400;
    }
    this.ctx.body = res;
  }

}

module.exports = CourseController;
