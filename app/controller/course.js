'use strict';

const Controller = require('egg').Controller;

var marked = require("marked");
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
class CourseController extends Controller {

  // get :id
  // 获取指定章节信息下的所有项目信息
  async show() {

    
    const c_id = parseInt(this.ctx.params.id);
    //校验数据

    let result = await this.ctx.service.course.show(c_id);
    this.ctx.body = result;

  }

  // get query传值 如果带参数则判段是否有标签，没有带参数则显示全部
  // 否则根据标签获取分类的章节
  async index() {
    
    //获取学生信息
    let stuId = this.ctx.state.user;
    console.log(this.ctx.query)
    //校验请求，分情况处理

    if (Object.keys(this.ctx.query).length === 0) {
      //无参数，显示全部
      let result = await this.ctx.service.course.showAll(stuId);
      return this.ctx.body = result;

    }
    else if(this.ctx.query.tag !== undefined){
      
      let result = await this.ctx.service.course.showByTag(this.ctx.query.tag);
      return this.ctx.body = result;
    }
    res.msg = '参数不合法';
    this.ctx.status = 400;
    this.ctx.body = res;
  }


  // post 增加课程
  async create() {

    var res = {};
    //接收文件的形式接收参数
    const parts = this.ctx.multipart();
    let part;
    var insertInfo = {};
    let result0 = await this.app.mysql.select('course', {
      columns: ['course_id'],
      orders: [['course_id', 'desc']]
    });
    var id = parseInt(result0[0].course_id) + 1;
    while ((part = await parts()) != null) {
      console.log(part)
      if (part.length) {
        // arrays are busboy fields
        if (part[0] === 'course_name') {
          insertInfo.course_name = part[1];
        }
        if (part[0] === 'description') {
          insertInfo.course_description = part[1]
        }
        if (part[0] === 'tag') {
          insertInfo.tag = part[1]
        }
      } else {
        // 接收图片文件上传
        if (!part.filename) {
          continue;
        }
        let target;
        if (part.fieldname === "image") {

          //判断图片类型
          let type = part.mimeType.replace('image/', '');
          if (type === 'jpeg') { type = 'jpg' }

          let url = '/public/images/course/' + id + '.' + type;
          insertInfo.image_url = url;
          target = path.join(this.config.baseDir, 'app', url);

        }

        const writeStream = fs.createWriteStream(target);
        await pump(part, writeStream);
      }
    }
    
    //校验数据
    const rule = {
      course_name: { type: 'string', required: true },
      course_description: { type: 'string', required: true },
      tag: { type: 'string', required: false },
      image_url: { type: 'string', required: true }
    };
    try {
      await this.ctx.validate(rule, insertInfo);//校验数据
    } catch (error) {
      res.msg = "参数格式不对";
      this.ctx.status = 400;
      return this.ctx.body = res
    }
    let result = await this.ctx.service.course.insert(id, insertInfo);
    res.msg = (result === true) ? '新增章节成功' : '新增章节失败';
    res.course_id = (result === true) ? id : null;
    res.test = undefined;
    this.ctx.body = res;
  }

  // put 修改课程
  async update() {
    console.log(this.ctx.params)
    var res = {}
    var id = parseInt(this.ctx.params.id);

    //接收文件的形式接收参数
    const parts = this.ctx.multipart();
    let part;
    var updateInfo = {};

    while ((part = await parts()) != null) {
      if (part.length) {
        // arrays are busboy fields
        if (part[0] === 'course_name') {
          updateInfo.course_name = part[1];
        }
        if (part[0] === 'description') {
          updateInfo.course_description = part[1]
        }
        if (part[0] === 'tag') {
          updateInfo.tag = part[1]
        }
      } else {
        // 接收图片文件上传
        if (!part.filename) {
          continue;
        }
        if (part.fieldname == "image") {

          //判断图片类型
          let type = part.mimeType.replace('image/', '');
          if (type === 'jpeg') { type = 'jpg' }
          console.log(type)
          let url = '/public/images/course/' + id + '.' + type;
          updateInfo.image_url = url;
          let target = path.join(this.config.baseDir, 'app', url);
          const writeStream = fs.createWriteStream(target);
          await pump(part, writeStream);
        }
      }
    }
    //更新数据库信息
    console.log(updateInfo)
    //校验数据
    const rule = {
      course_name: { type: 'string', required: false },
      course_description: { type: 'string', required: false },
      tag: { type: 'string', required: false },
      image_url: { type: 'string', required: false }
    };
    try {
      await this.ctx.validate(rule, updateInfo);//校验数据
    } catch (error) {
      res.msg = "参数格式不对";
      this.ctx.status = 400;
      return this.ctx.body = res
    }
    let result = await this.ctx.service.course.update(id, updateInfo);
    res.msg = (result === true) ? '更新章节成功' : '更新章节失败';
    this.ctx.body = res
  }

  //删除章节
  async destroy() {
    var res = {};

    var id = parseInt(this.ctx.params.id);
    let result = await this.ctx.service.course.destroy(id);
    res.msg = result === true ? '删除章节成功' : '删除章节失败';
    this.ctx.body = res;
  }

  //获取该学生可见的所有标签，学生页面使用
  async getTag() {

    var res = {};
    let stuId = this.ctx.state.user;
    let result0 = await this.app.mysql.get('user', {
      user_id: stuId
    })
    if (result0.length !== 0) {
      //学生信息不对
      let strArray = result0.visable_course.split(',')
      let courseArray = [];
      strArray.forEach(function (data) {
        courseArray.push(parseInt(data))
      });
      let result;
      try {
        result = await this.app.mysql.select('course', {
          where: { course_id: courseArray },
          columns: ['tag']
        });
      } catch (error) {
        res.msg = courseArray.length === 0 ? '该学生没有可见的课程，获取失败' : '获取标签信息失败';
        this.ctx.status = 400;
        return this.ctx.body = res;
      }
      if (result.length !== 0) {
        
        let array = [];
        for (let index = 0; index < result.length; index++) {
          
          if(result[index].tag===null || result[index].tag===undefined || result[index].tag==='') {
            //该课程没有标签
            continue;
          }
          let str = result[index].tag.split('&');
          array = array.concat(str);
        }
      
        //数组去重
        let set = [...new Set(array)];
        res.msg = '获取标签信息成功';
        res.data = set;
        return this.ctx.body = res;
      }
    }
    res.msg = '获取标签信息失败';
    this.ctx.status = 400;
    this.ctx.body = res;

  }


}

module.exports = CourseController;