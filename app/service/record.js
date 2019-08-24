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
        //获取项目步骤数
        let r = await this.app.mysql.select('project', {
            where: {
                course_id: req.course_id,
                project_id: req.project_id
            },
            columns: ['step_amount']
        })
        var step_amount = parseInt(r[0].step_amount);
        //项目学习状态
        var pStatus = (parseInt(req.current_step) < step_amount) ? 'learning' : 'finished';

        var res1 = await this.app.mysql.select('learning_progress_record', {
            where: {
                user_id: req.user_id,
                course_id: req.course_id
            }
        })
        var r1 = await this.app.mysql.select('learning_course_record', {
            where: {
                user_id: req.user_id,
                course_id: req.course_id
            }
        })
        //获取
        if (res1.length === 0) {

            //用户该课程该项目没有学习记录, 即第一次学习这个课程，插入记录
            let res2 = await this.app.mysql.insert('learning_progress_record', {
                user_id: req.user_id,
                course_id: req.course_id,
                project_id: req.project_id,
                current_step: req.current_step,
                project_status: pStatus
            })
            if (r1.length === 0) {
                //如果课程学习记录也为空，则插入

                let r2 = await this.app.mysql.insert('learning_course_record', {
                    user_id: req.user_id,
                    course_id: req.course_id,
                    finished_projects: pStatus === 'finished' ? req.project_id.toString() : null,
                    course_status: 'learning'
                })
            } else {
                //否则根据情况更新
                if (pStatus === 'finished') {
                    //项目已完成
                    let array = r1[0].finished_projects === null ? [] : r1[0].finished_projects.split(',');

                    let flag = true;
                    await array.forEach(element => {
                        if (element === req.project_id.toString()) {
                            flag = false;
                        }
                    });
                    if (flag === true) {
                        array.push(req.project_id.toString());
                        let r3 = await this.app.mysql.get('course', {
                            course_id: req.course_id
                        })

                        let r4 = await this.app.mysql.update('learning_course_record', {
                            finished_projects: array.toString(),
                            course_status: r3.project_amount === array.length ? 'finished' : 'learning'
                        }, {
                                where: {
                                    user_id: req.user_id,
                                    course_id: req.course_id,
                                }
                            })
                    }

                }
            }

            //更新课程学习人数
            //获取当前课程学习人数
            let res3 = await this.app.mysql.get('course', {
                course_id: req.course_id
            })
            let res4 = await this.app.mysql.update('course', {
                learn_amount: parseInt(res3.learn_amount) + 1
            }, {
                    where: {
                        course_id: req.course_id
                    }
                })
            if (res2.affectedRows === 1 && res4.affectedRows === 1) {
                //插入成功
                console.log('------该课程、该项目没有学习记录 insert -----')

                res.msg = "上报数据成功";
                return res
            }
            res.msg = "上报数据失败";
            this.ctx.status = 400;
            return res
        };
        //下面是该课程有学习记录的情况



        //同个课程。用户该课程有学习记录，需要判断是否是同一个项目，如果是，更新学习进度，如果不是，判断之前的项目是否学完，未学完删除记录。学完了插入
        //如果是同个项目，用户已经学完了，但是重新开始了学习，
        for (let i = 0; i < res1.length; i++) {

            if (res1[i].project_id === req.project_id && res1[i].project_status === 'learning') {
                //同个项目，还没学完
                //更新记录
                let res3 = await this.app.mysql.update('learning_progress_record', {
                    current_step: req.current_step,
                    project_status: pStatus
                }, {
                        where: {
                            user_id: req.user_id,
                            course_id: req.course_id,
                            project_id: req.project_id,
                        }
                    })
                if (pStatus === 'finished') {
                    //项目刚好学完，同时更新课程总体的记录
                    let array = r1[0].finished_projects === null ? [] : r1[0].finished_projects.split(',');
                    let flag = true;
                    await array.forEach(element => {
                        if (element === req.project_id.toString()) {
                            flag = false;
                        }
                    });
                    if (flag === true) {
                        array.push(req.project_id.toString());
                        let r3 = await this.app.mysql.get('course', {
                            course_id: req.course_id
                        })

                        let r4 = await this.app.mysql.update('learning_course_record', {
                            finished_projects: array.toString(),
                            course_status: r3.project_amount === array.length ? 'finished' : 'learning'
                        }, {
                                where: {
                                    user_id: req.user_id,
                                    course_id: req.course_id,
                                }
                            })
                    }

                }
                if (res3.affectedRows === 1) {
                    console.log('------update 记录-----')

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

            if (res1[i].project_id === req.project_id && res1[i].project_status === 'finished') {
                //同个项目,但是之前已经学过了，学完了。重新开始学习，
                //更新覆盖原记录
                let res3 = await this.app.mysql.update('learning_progress_record', {
                    current_step: req.current_step,
                    project_status: (parseInt(req.current_step) < step_amount) ? 'learning' : 'finished'
                }, {
                        where: {
                            user_id: req.user_id,
                            course_id: req.course_id,
                            project_id: req.project_id,
                        }
                    })
                if (res3.affectedRows === 1) {
                    console.log('------update 覆盖原记录-----')

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

            if (res1[i].project_id !== req.project_id && res1[i].project_status === 'finished') {
                //不同项目，但是原项目已经学完
                continue;
            }

            if (res1[i].project_id !== req.project_id && res1[i].project_status === 'learning') {
                //上报的是不同项目，但是已有一个项目正在学习
                //删除记录，插入新记录
                let res4 = await this.app.mysql.delete('learning_progress_record', {
                    id: res1[i].id
                })

                let res5 = await this.app.mysql.insert('learning_progress_record', {
                    user_id: req.user_id,
                    course_id: req.course_id,
                    project_id: req.project_id,
                    current_step: req.current_step,
                    project_status: pStatus
                })
                if (pStatus === 'finished') {
                    //项目刚好学完，同时更新课程总体的记录
                    let array = r1[0].finished_projects === null ? [] : r1[0].finished_projects.split(',');

                    let flag = true;
                    await array.forEach(element => {
                        if (element === req.project_id.toString()) {
                            flag = false;
                        }
                    });
                    if (flag === true) {
                        array.push(req.project_id.toString());
                        let r3 = await this.app.mysql.get('course', {
                            course_id: req.course_id
                        })

                        let r4 = await this.app.mysql.update('learning_course_record', {

                            finished_projects: array.toString(),
                            course_status: r3.project_amount === array.length ? 'finished' : 'learning'
                        }, {
                                where: {
                                    user_id: req.user_id,
                                    course_id: req.course_id,
                                }
                            })
                    }
                }
                if (res4.affectedRows === 1 && res5.affectedRows === 1) {
                    console.log('------先 delete-----------后 insert-----')
                    //插入成功
                    res.msg = "上报数据成功";
                    return res;
                }
            }

        }

        // 该课程有学习记录，但该项目没有，说明该项目第一次学习，直接插入记录
        let res5 = await this.app.mysql.insert('learning_progress_record', {
            user_id: req.user_id,
            course_id: req.course_id,
            project_id: req.project_id,
            current_step: req.current_step,
            project_status: (parseInt(req.current_step) < step_amount) ? 'learning' : 'finished'
        })
        if (pStatus === 'finished') {
            //项目刚好学完，同时更新课程总体的记录
            let array = r1[0].finished_projects === null ? [] : r1[0].finished_projects.split(',');

            let flag = true;
            await array.forEach(element => {
                if (element === req.project_id.toString()) {
                    flag = false;
                }
            });
            if (flag === true) {
                array.push(req.project_id.toString());
                let r3 = await this.app.mysql.get('course', {
                    course_id: req.course_id
                })

                let r4 = await this.app.mysql.update('learning_course_record', {
                    finished_projects: array.toString(),
                    course_status: r3.project_amount === array.length ? 'finished' : 'learning'
                }, {
                        where: {
                            user_id: req.user_id,
                            course_id: req.course_id,
                        }
                    })
            }
        }
        if (res5.affectedRows === 1) {
            console.log('----该课程有学习记录，但该项目没有 insert------')
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
