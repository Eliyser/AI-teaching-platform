'use strict';

const Service = require('egg').Service;

class VideoService extends Service {
    async upload(cid, pid, type) {

        let video_url = '/public/videos/' + cid + '_' + pid + '.' + type
        let result1 = await this.app.mysql.update('project', {
            video_url: video_url
        }, {
                where: {
                    course_id: cid,
                    project_id: pid
                }
            })

        if (result1.affectedRows === 1) {
            return {
                "url": 'http://47.96.95.75:7001' + video_url
            }
        }
        return null;
    }
}

module.exports = VideoService;
