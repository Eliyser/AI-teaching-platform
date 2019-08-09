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

    var res = {};
    res.data = {};
    const c_id = parseInt(this.ctx.params.id);
    try {
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
        res.msg = '获取项目信息成功，该课程目前暂无项目';
        res.data = {};
      }
    } catch (error) {
      res.msg = '获取项目信息失败';
      this.ctx.status = 400;
    }
    
    this.ctx.body = res;

  }
  // get query传值 如果带参数则判段是否有标签，没有带参数则显示全部
  // 否则根据标签获取分类的章节
  async index() {
    var res = {};
    res.data = [];
    let stuId = this.ctx.state.user;
    console.log(this.ctx.query)
    if (Object.keys(this.ctx.query).length === 0) {
      //无参数，显示全部
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
          this.ctx.status = 404;
        }
      }
    }
    else {
      const tag = this.ctx.query.tag;
      if (tag == undefined) {
        res.msg = '参数不合法';
        this.ctx.status = 400;
      } else {
        const result = await this.app.mysql.select('course');
        var flag = false;
        for (let i = 0; i < result.length; i++) {
          let str = result[i].tag.split('&');
          let isfind = false;
          await str.forEach(element => {
            if (element === tag) {
              isfind = true;
            }
          });

          if (isfind === true) {
            result[i].tag = str;
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
      }
    }
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
    var id = parseInt(result0[0].course_id) + 1
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
    //插入数据库信息
    console.log(insertInfo)
    let result = await this.ctx.service.course.insert(id, insertInfo);
    if (result !== null) {
      res.msg = '新增章节成功';
      res.course_id = id;
    } else {
      res.msg = '新增章节失败',
        this.ctx.status = 400;
    }

    this.ctx.body = res
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
    let result = await this.ctx.service.course.update(id, updateInfo);
    if (result !== null) {
      res.msg = '修改章节信息成功'
    } else {
      res.msg = '修改章节信息失败',
        this.ctx.status = 400;
    }

    this.ctx.body = res

  }

  //删除章节
  async destroy() {
    var res = {};

    var id = parseInt(this.ctx.params.id);
    console.log(id)
    let result1 = await this.app.mysql.delete('course', {
      course_id: id

    })
    if (result1.affectedRows === 1) {
      res.msg = '删除章节成功';
    } else {
      res.msg = '删除章节失败';
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