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

        let res1 = await this.app.mysql.select('learning_progress_record', {
            where: {
                user_id: req.user_id,
                course_id: req.course_id
            }
        })

        if (res1.length === 0) {
            //用户没有学习记录, 插入记录
            let res2 = await this.app.mysql.insert('learning_progress_record', {
                user_id: req.user_id,
                course_id: req.course_id,
                project_id: req.project_id,
                current_step: req.current_step,
                project_status: 'learning'
            })

            if (res2.affectedRows === 1) {
                //插入成功
                res.msg = "上报数据成功";
                return res
            }
            res.msg = "上报数据失败";
            this.ctx.status = 400;
            return res
        }
        //同个课程。用户该课程有学习记录，需要判断是否是同一个项目，如果是，更新学习进度，如果不是，判断之前的项目是否学完，未学完删除记录。学完了插入
        //如果是同个项目，用户已经学完了，但是重新开始了学习，
        for (let i = 0; i < res1.length; i++) {
            
            if (res1[i].project_status === 'finished' && res1[i].project_id === req.project_id) {
                //同个项目,但是之前已经学过了，学完了。重新开始学习，把之前的记录删掉
                let res4 = await this.app.mysql.delete('learning_progress_record', {
                    id: res1[i].id
                })
                console.log(res4)
                if(res4.affectedRows === 1) {
                    console.log('------delete-----')
                }
            }
            
            if (res1[i].project_status === 'learning' && res1[i].project_id === req.project_id) {
                //同个项目，还没学完
                console.log(res1[i])
                //更新记录
                //获取项目步骤数
                let res2 = await this.app.mysql.select('project', {
                    where: {
                        course_id: req.course_id,
                        project_id: req.project_id
                    },
                    columns: ['step_amount']
                })
                let res3 = await this.app.mysql.update('learning_progress_record', {
          
                    current_step: req.current_step,
                    project_status: (parseInt(req.current_step) < parseInt(res2[0].step_amount)) ? 'learning' : 'finished'
                }, {
                        where: {
                            user_id: req.user_id,
                            course_id: req.course_id,
                            project_id: req.project_id,
                        }
                    })
                console.log(res3)
                if (res3.affectedRows === 1) {
                    //插入成功
                    res.msg = "上报数据成功";
                    return res;
                  
                } else {
                    console.log('-------error-------')
                    res.msg = "上报数据失败";
                    this.ctx.status = 400;
                    return res
                }
                
            }
            
            if (res1[i].project_status === 'learning' && res1[i].project_id !== req.project_id) {
                //不同项目，但是正在学习
                //删除记录
                let res4 = await this.app.mysql.delete('learning_progress_record', {
                    id: res1[i].id
                })
                console.log(res4)
                if(res4.affectedRows === 1) {
                    console.log('------delete-----')
                }
            }
        }
        // 该课程第一次学习，直接插入记录
        let res5 = await this.app.mysql.insert('learning_progress_record', {
            user_id: req.user_id,
            course_id: req.course_id,
            project_id: req.project_id,
            current_step: req.current_step,
            project_status: 'learning'
        })

        if (res5.affectedRows === 1) {
            console.log('----insert------')
            //插入成功
            res.msg = "上报数据成功";
            return res;

        }
        res.msg = "上报数据失败";
        this.ctx.status = 400;
        return res;

    }
}

module.exports = RecordService;
