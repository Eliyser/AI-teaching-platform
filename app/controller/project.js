'use strict';

const Controller = require('egg').Controller;
var marked = require("marked");

class ProjectController extends Controller {

    //get query传值 获取具体项目内容
    async index() {
        var requestMsg = this.ctx.query;
        var res = {};
        res.data = {};
        var result = await this.app.mysql.select('specific_project', {
            where: {
                course_id: parseInt(requestMsg.course_id),
                project_id: parseInt(requestMsg.project_id)
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
            let md_array = result[0].document.split(/(?=(?<!#)##\s)/g);
          
            // let steps_array = result[0].document.match(/(?<!#)##\s/g);
            let title = md_array.shift();
            res.steps_md_array = md_array;
  
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

    // post 新建项目
    async create() {
        var res = {};

        let reqMsg = this.ctx.request.body;
        //接口数据规则
        const rule = {
            course_id: { type: 'int', required: true },
            project_name: { type: 'string', required: true },
            description: { type: 'string', required: true },
            markdown: { type: 'string', required: true },
            steps: { type: 'array', required: true}
        };
        //验证接口数据规则
        try {
            await this.ctx.validate(rule, reqMsg);//校验数据
            let result0 = await this.app.mysql.select('project', {
                where: {
                    course_id: reqMsg.course_id
                },
                columns: ['project_id'],
                orders: [['project_id', 'desc']]
            });
            let project_id;
            if(result0.length===0) {
                project_id = 1
            } else {
                project_id = parseInt(result0[0].project_id) + 1;
            }
            

            let md_str = reqMsg.markdown;
            //获取二级标题即步骤标题，生成步骤字符串存入
            // let steps_array = md_str.match(/(?<!#)(##\s)[^\n]*?\r/g);
            let steps_array = reqMsg.steps;
            let steps_str = '';
            for (let i = 0; i < steps_array.length; i++) {
                i === steps_array.length - 1 ? steps_str = steps_str + steps_array[i]: steps_str = steps_str + steps_array[i] + ';'
            }

            let result1 = await this.app.mysql.insert('project', {
                course_id: reqMsg.course_id,
                project_id: project_id,
                project_name: reqMsg.project_name,
                project_description: reqMsg.description,
                all_steps: steps_str,
                step_amount: steps_array.length,
                document: md_str
            })
            let result2 = await this.app.mysql.get('course',{
                course_id: reqMsg.course_id
            })
            let result3 = await this.app.mysql.update('course',{
                project_amount: parseInt(result2.project_amount) + 1
            },{
                where: {
                    course_id: reqMsg.course_id
                }
            });


            if (result1.affectedRows === 1) {
                res.msg = '新建项目成功';
                res.project_id = project_id;
            } else {
                res.msg = '新建项目失败';
                this.ctx.status = 400;
            }
            this.ctx.body = res;
        } catch (error) {
            res.msg = '参数格式不对';
            this.ctx.status = 400;
            this.ctx.body = res;
        }
    }
    //put 修改项目信息
    async update() {
        var res = {};

        let reqMsg = this.ctx.request.body;
        //接口数据规则
        const rule = {
            course_id: { type: 'int', required: true },
            project_id: { type: 'int', required: true },
            project_name: { type: 'string', required: false },
            description: { type: 'string', required: false },
            markdown: { type: 'string', required: false },
        };
        //验证接口数据规则
        try {
            await this.ctx.validate(rule, reqMsg);//校验数据

            let md_str = reqMsg.markdown;
            var rows = {};
            rows.project_name = reqMsg.project_name;
            rows.project_description = reqMsg.description;
            if (md_str !== undefined) {
                //获取二级标题即步骤标题，生成步骤字符串存入
                let steps_array = md_str.match(/\n(##\s)[^\n]*?\r/g);
                let steps_str = '';
                for (let i = 0; i < steps_array.length; i++) {
                    i === steps_array.length - 1 ? steps_str = steps_str + steps_array[i].replace('\n## ', '').replace('\r', '') : steps_str = steps_str + steps_array[i].replace('\n## ', '').replace('\r', '') + ';'
                }
                rows.step_amount = steps_array.length;
                rows.document = md_str;
                rows.all_steps = steps_str;
            }

            let result1 = await this.app.mysql.update('project', rows, {
                where: {
                    course_id: reqMsg.course_id,
                    project_id: reqMsg.project_id,

                }
            })

            if (result1.affectedRows === 1) {
                res.msg = '修改项目信息成功';
            } else {
                res.msg = '修改项目信息失败';
                this.ctx.status = 400;
            }
            this.ctx.body = res;
        } catch (error) {
            console.log(error)
            res.msg = '参数格式不对';
            this.ctx.status = 400;
            this.ctx.body = res;
        }
    }
    //删除项目
    async delete() {
        var res = {};

        let reqMsg = this.ctx.request.body;
        //接口数据规则
        const rule = {
            course_id: { type: 'int', required: true },
            project_id: { type: 'int', required: true },
        };
        //验证接口数据规则
        try {
            await this.ctx.validate(rule, reqMsg);//校验数据
            let result1 = await this.app.mysql.delete('project', {
                course_id: reqMsg.course_id,
                project_id: reqMsg.project_id,

            })
            let result2 = await this.app.mysql.get('course',{
                course_id: reqMsg.course_id
            })
            let result3 = await this.app.mysql.update('course',{
                project_amount: parseInt(result2.project_amount) - 1
            },{
                where: {
                    course_id: reqMsg.course_id
                }
            });
            if (result1.affectedRows === 1) {
                res.msg = '删除项目信息成功';
            } else {
                res.msg = '删除项目信息失败';
                this.ctx.status = 400;
            }
            this.ctx.body = res;
        } catch (e) {
            res.msg = '参数格式不对';
            this.ctx.status = 400;
            this.ctx.body = res;
        }
    }
}

module.exports = ProjectController;
