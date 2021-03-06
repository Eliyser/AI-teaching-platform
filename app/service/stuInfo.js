'use strict';

const Service = require('egg').Service;

class StuInfoService extends Service {
    async create(req) {
        var res = {};
        let flag;
        let errorId;
        for (let i = 0; i < req.info.length; i++) {

            //把密码进行md5加密,不加密了
            // req.info[i].password = this.ctx.helper.encrypt(req.info[i].password);
            //如果没有选择课程
            req.info[i].visable_course_id = (req.info[i].visable_course_id === undefined ||req.info[i].visable_course_id.length === 0)? null : req.info[i].visable_course_id.toString();
            console.log(req.info[i].visable_course_id);
            let result;
            try {
                result = await this.app.mysql.insert('user', {
                    user_id: req.info[i].stuId,
                    user_name: req.info[i].stuName,
                    password: req.info[i].password,
                    school: req.info[i].stuSchool,
                    grade:  req.info[i].stuGrade,
                    class:  req.info[i].stuClass,

                    visable_course: req.info[i].visable_course_id
                })
            } catch (error) {
                errorId = req.info[i].stuId;
                flag = false;
                break;
            }
            
            if (result.affectedRows === 1) {
                continue;
            }
            errorId = req.info[i].stuId;
            flag = false;
            break;
        }
        if (flag === false) {
            res.msg = '上报数据失败'+ ' stuId为 '+ errorId+' 的数据内容有错，请检查'
            this.ctx.status = 400;
            return res;
        }
        res.msg = '上报数据成功'
        return res;

    }


    async update(info) {
        var res = {};
        let flag = true;
        for (let i = 0; i < info.length; i++) {
            //把密码进行md5加密
            // req.info[i].password = req.info[i].password === undefined ? undefined : this.ctx.helper.encrypt(req.info[i].password);

            let row = {};
            if (info[i].visable_course_id) {
                row.visable_course = info[i].visable_course_id.length===0 ? null:info[i].visable_course_id.toString()
            } 
            if (info[i].stuName) {
                row.user_name = info[i].stuName
            }
            if (info[i].password) {
                row.password = info[i].password
            }
            if (info[i].stuSchool) {
                row.school = info[i].stuSchool
            }
            if (info[i].stuGrade) {
                row.grade = info[i].stuGrade
            }
            if (info[i].stuClass) {
                row.class = info[i].stuClass
            }
        

            console.log(row)
            let options = {
                where: {
                    user_id: info[i].stuId
                }
            }
            let result = await this.app.mysql.update('user', row, options)
            if (result.affectedRows === 1) {
                continue;
            }
            flag = false;
            break;

        }
        if (flag === false) {
            res.msg = '更新数据失败'
            this.ctx.status = 400;
            return res;
        }
        res.msg = '更新数据成功'
        return res

    }

    async destroy(id) {
        let result1 = await this.app.mysql.delete('user', {
            user_id: id

        })
        if (result1.affectedRows === 1) {
            return true;
        }
        this.ctx.status = 400;
        return false;
    }
}

module.exports = StuInfoService;
