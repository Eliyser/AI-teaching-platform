'use strict';

const Service = require('egg').Service;

class CourseService extends Service {
  async update(id, updateInfo) {
    if(Object.keys(updateInfo).length === 0) {
      return null;
    } else {
      let result = await this.app.mysql.update('course',updateInfo,{
        where: {
          course_id: id
        }
      })
      if(result.affectedRows === 1) {
        return 1;
      } else {
        return null;
      }
    }
    
  }
  async insert(id, insertInfo) {
    if(Object.keys(insertInfo).length === 0) {
      return null;
    } else {
      insertInfo.course_id = id;
      let result = await this.app.mysql.insert('course',{
        course_id: id,
        course_name: insertInfo.course_name,
        course_description: insertInfo.course_description,
        tag: insertInfo.tag,
        image_url: insertInfo.image_url
      })
      if(result.affectedRows === 1) {
        return 1;
      } else {
        return null;
      }
    }
    
  }
}

module.exports = CourseService;
