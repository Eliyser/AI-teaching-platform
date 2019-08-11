'use strict';

const Controller = require('egg').Controller;

class StuInfoController extends Controller {

    //get 获取全部学生信息
    async index() {
        var res = {};
        res.data = [];

        let result = await this.app.mysql.select('user');
        for (let i = 0; i < result.length; i++) {
            
            let allArray = await this.app.mysql.select('course', {

                columns: ['course_id', 'course_name']
            })

            if (result[i].visable_course === null) {
                res.data.push({
                    stuId: result[i].user_id,
                    stuName: result[i].user_name,
                    password: result[i].password,
                    stuSchool: result[i].school,
                    visable_course: [],
                    hidden_course: allArray
                })
                continue;
            }
            let visableStrArray = result[i].visable_course.split(',')
            let visableIntArray = [];
            visableStrArray.forEach(function (data) {
                visableIntArray.push(parseInt(data))
            });
            let visable_course = await this.app.mysql.select('course', {
                where: { course_id: visableIntArray },
                columns: ['course_id', 'course_name']
            })
            
            let hidden_course = allArray.filter(x => !visable_course.find(y => y.course_id === x.course_id));

            res.data.push({
                stuId: result[i].user_id,
                stuName: result[i].user_name,
                password: result[i].password,
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

        try {
            await this.ctx.validate(rule, req);//校验数据
        } catch (error) {
            console.log(error)
            this.ctx.status = 400;
            return this.ctx.body = {
                msg: '参数不合法'
            };
        }
        let res = await this.ctx.service.stuInfo.create(req);
        this.ctx.body = res;

    }

    //put 更新学生信息，批量更新
    async update() {
        //接口数据规则
        const rule = {
            info: { type: 'array', required: true }
        };
        let req = this.ctx.request.body;
        console.log(req);

        try {
            await this.ctx.validate(rule, req);//校验数据

        } catch (error) {
            console.log(error)
            res.msg = '参数不合法'
            this.ctx.status = 400;
            return this.ctx.body = res;

        }
        let res = await this.ctx.service.stuInfo.update(req.info);
        this.ctx.body = res;

    }
    //delete 删除学生信息
    async destroy() {
        var res = {};

        var id = parseInt(this.ctx.params.id);
        let result = await this.ctx.service.stuInfo.destroy(id);
        res.msg = result === true ? '删除学生账号成功' : '删除学生账号失败';
        this.ctx.body = res;
    }

}

module.exports = StuInfoController;
