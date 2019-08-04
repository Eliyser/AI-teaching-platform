'use strict';

const Controller = require('egg').Controller;

class StuInfoController extends Controller {

    //get
    async index() {
        var res = {};
        res.data = []
        let result = await this.app.mysql.select('user');
        for(let i = 0;i<result.length;i++) {
            let visableStrArray = result[i].visable_course.split(',')
            let visableIntArray = [];
            visableStrArray.forEach(function(data){
                visableIntArray.push(parseInt(data))
            });
            let visable_course =  await this.app.mysql.select('course',{
                where: {course_id: visableIntArray},
                columns: ['course_id','course_name']
            })
            let allArray = await this.app.mysql.select('course',{
                
                columns: ['course_id','course_name']
            })
            let hidden_course = allArray.filter(x => !visable_course.find(y => y.course_id === x.course_id));

            res.data.push({
                stuId: result[i].user_id,
                stuName: result[i].user_name,
                stuSchool: result[i].school,
                visable_course: visable_course,
                hidden_course: hidden_course
            })
        }
        res.msg = '获取信息成功'
        this.ctx.body = res
    }

    //post
    async create() {
        
        //接口数据规则
        const rule = {
            info: { type: 'array', required: true }
        };
        let req = this.ctx.request.body;
        console.log(req);
        var res = {};
        try {
            await this.ctx.validate(rule, req);//校验数据
            let flag;
            for (let i = 0; i < req.info.length; i++) {

                //把密码进行md5加密
                req.info[i].password = this.ctx.helper.encrypt(req.info[i].password);
                req.info[i].visable_course_id = req.info[i].visable_course_id.toString();
                console.log(req.info[i].visable_course_id)
                let result = await this.app.mysql.insert('user', {
                    user_id: req.info[i].stuId,
                    user_name: req.info[i].stuName,
                    password: req.info[i].password,
                    school: req.info[i].stuSchool,
                    visable_course: req.info[i].visable_course_id
                })
                if (result.affectedRows === 1) {
                    continue;
                } else {
                    flag = false;
                    break;
                }
            }
            if (flag === false) {
                res.msg = '上报数据失败'
                this.ctx.status = 400;
            } else {
                res.msg = '上报数据成功'

            }

        } catch (error) {
            console.log(error)
            res.msg = '参数不合法'
            this.ctx.body = 400;
        }

        this.ctx.body = res;

    }

    //put
    async update() {
        //接口数据规则
        const rule = {
            info: { type: 'array', required: true }
        };
        let req = this.ctx.request.body;
        console.log(req);
        var res = {};
        try {
            await this.ctx.validate(rule, req);//校验数据
            let flag;
            for (let i = 0; i < req.info.length; i++) {


                //把密码进行md5加密
                req.info[i].password = req.info[i].password === undefined ? undefined : this.ctx.helper.encrypt(req.info[i].password);
                req.info[i].visable_course_id = req.info[i].visable_course_id === undefined ? undefined : req.info[i].visable_course_id.toString();
    
                let row = {
                    user_name: req.info[i].stuName,
                    password: req.info[i].password,
                    school: req.info[i].stuSchool,
                    visable_course: req.info[i].visable_course_id
                };

                let options = {
                    where: {
                        user_id: req.info[i].stuId
                    }
                }
                let result = await this.app.mysql.update('user', row, options)
                if (result.affectedRows === 1) {
                    continue;
                } else {
                    flag = false;
                    break;
                }
            }
            if (flag === false) {
                res.msg = '更新数据失败'
                this.ctx.status = 400;
            } else {
                res.msg = '更新数据成功'

            }

        } catch (error) {
            console.log(error)
            res.msg = '参数不合法'
            this.ctx.body = 400;
        }

        this.ctx.body = res;

    }
}

module.exports = StuInfoController;
