'use strict';

const Service = require('egg').Service;

class CourseService extends Service {


  async show(c_id) {

    var res = {};
    res.data = {};
    let result;
    try {
        result = await this.app.mysql.select('specific_project', {
        where: { course_id: c_id }
      })
    } catch (error) {
      res.msg = '获取项目信息失败';
      this.ctx.status = 400;
      return res;
    }
    
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
      return res;
    }

    res.msg = '获取项目信息成功，但该课程目前暂无项目';
    return res;

  }

  async showAll(stuId) {
    var res = {};
    res.data = [];
    let result0 = await this.app.mysql.get('user', {
      user_id: stuId
    })
    if (result0.length !== 0) {
      //学生信息存在
      let strArray = result0.visable_course === null ? [] : result0.visable_course.split(',');
      let courseArray = [];

      strArray.forEach(function (data) {
        courseArray.push(parseInt(data))
      });
      if (courseArray.length === 0) {
        res.msg = '该学生没有任何可见课程';
        return res;
      }

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
        return  res;
      }
    }
    res.msg = '获取章节信息失败';
    this.ctx.status = 400;
    return  res;

  }

  async showByTag(tag) {
    var res = {};
    res.data = [];
    const result = await this.app.mysql.select('course');
    var flag = false;
    for (let i = 0; i < result.length; i++) {
      if(result[i].tag===undefined || result[i].tag===''|| result[i].tag===null) {
        //课程可能没标签
        continue;
      }
      
      let strArray = result[i].tag.split('&');
      let isfind = false;
      await strArray.forEach(element => {
        if (element === tag) {
          isfind = true;
        }
      });

      if (isfind === true) {
        result[i].tag = strArray;//返回的标签是个数组
        res.data.push(result[i]);
        flag = true;
      }
    }
    if (result.length != 0 && flag == true) {
      res.msg = '获取分类信息成功';
      return res;
    }
    res.msg = '获取分类信息失败';
    this.ctx.status = 400;
    return res;

  }


  async update(id, updateInfo) {
    if (Object.keys(updateInfo).length === 0) {
      this.ctx.status = 400;
      return false;
    }
    let result = await this.app.mysql.update('course', updateInfo, {
      where: {
        course_id: id
      }
    })
    if (result.affectedRows === 1) {
      return true;
    }
    this.ctx.status = 400;
    return false;

  }

  
  async insert(id, insertInfo) {
    if (Object.keys(insertInfo).length === 0) {
      this.ctx.status = 400;
      return false;
    }
    insertInfo.course_id = id;
    let result = await this.app.mysql.insert('course', {
      course_id: id,
      course_name: insertInfo.course_name,
      course_description: insertInfo.course_description,
      tag: insertInfo.tag,
      image_url: insertInfo.image_url
    })
    if (result.affectedRows === 1) {
      return true;
    }
    this.ctx.status = 400;
    return false;
  }


  async destroy(id) {
    let result1 = await this.app.mysql.delete('course', {
      course_id: id

    })
    if (result1.affectedRows === 1) {
      return true;
    }
    this.ctx.status = 400;
    return false;
  }



  async getTag(stuId) {
    var res = {}
    let result0 = await this.app.mysql.get('user', {
      user_id: stuId
    })
    if (result0.length !== 0) {
      //学生信息正确
    
      let strArray = (result0.visable_course ===null || result0.visable_course ==='' || result0.visable_course ===undefined)?[]:result0.visable_course.split(',')
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
        return res;
      }
      if (result.length !== 0) {

        let array = [];
        for (let index = 0; index < result.length; index++) {

          if (result[index].tag === null || result[index].tag === undefined || result[index].tag === '') {
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
        return res;
      }
    }
    res.msg = '获取标签信息失败';
    this.ctx.status = 400;
    return  res;

  }



}

module.exports = CourseService;
