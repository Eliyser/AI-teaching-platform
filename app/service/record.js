'use strict';

const Service = require('egg').Service;

class RecordService extends Service {

    async learning_date(req) {
        var res = {}

        let res1 = await this.app.mysql.get('learning_date_record', {
            user_id: req.user_id,
        })
        if (res1 == null) {
            //说明用户还没有记录，插入记录
            let res2 = await this.app.mysql.insert('learning_date_record', {
                user_id: req.user_id,
                date: req.date,
                count: req.time
            })
            if (res2.affectedRows === 1) {
                //插入成功
                res.msg = "上报数据成功";
            } else {
                res.msg = "上报数据失败";
                this.ctx.status = 400;
            }

        } else {
            //用户有记录，判断日期是否同天，累加当天学习时长
            let res2 = await this.app.mysql.get('learning_date_record', {
                user_id: req.user_id,
                date: req.date
            })
            if (res2 == null) {
                //不同日期，插入记录
                let res3 = await this.app.mysql.insert('learning_date_record', {
                    user_id: req.user_id,
                    date: req.date,
                    count: req.time
                })
                if (res3.affectedRows === 1) {
                    //插入成功
                    res.msg = "上报数据成功";
                } else {
                    res.msg = "上报数据失败";
                    this.ctx.status = 400;
                }

            } else {
                //同日期，更新
                let res3 = await this.app.mysql.update('learning_date_record', {
                    count: parseInt(req.time) + parseInt(res2.count)
                }, {
                        where: {
                            user_id: req.user_id,
                            date: req.date
                        }
                    })
                if (res3.affectedRows === 1) {
                    //插入成功
                    res.msg = "上报数据成功";
                } else {
                    res.msg = "上报数据失败";
                    this.ctx.status = 400;
                }

            }
        }
        return res
    }

    async learning_progress(req) {

        var res = {};

        let res1 = await this.app.mysql.get('learning_progress_record', {
            user_id: req.user_id,
            course_id: req.course_id
        })
        if (res1 === null) {
            //用户没有学习记录
            let res2 = await this.app.mysql.insert('learning_progress_record', {
                user_id: req.user_id,
                course_id: req.course_id,
                project_id: req.project_id,
                current_step: req.current_step,
                status: 'learning'
            })

            if (res2.affectedRows === 1) {
                //插入成功
                res.msg = "上报数据成功";
            } else {
                res.msg = "上报数据失败";
                this.ctx.status = 400;
            }
        } else {
            let res2 = await this.app.mysql.select('project', {
                where: {
                    course_id: req.course_id,
                    project_id: req.project_id
                },
                columns: ['step_amount']
            })
            let res3 = await this.app.mysql.update('learning_progress_record', {
                current_step: req.current_step,
                project_id: req.project_id,
                status: (parseInt(req.current_step) < parseInt(res2[0].step_amount)) ? 'learning' : 'finished'
            }, {
                    where: {
                        user_id: req.user_id,
                        course_id: req.course_id
                        
                    }
                })
            if (res3.affectedRows === 1) {
                //插入成功
                res.msg = "上报数据成功";
            } else {
                res.msg = "上报数据失败";
                this.ctx.status = 400;
            }

        }
        return res;

    }
}

module.exports = RecordService;
