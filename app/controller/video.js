'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');
class VideoController extends Controller {
    async upload() {
        var res = {};
        res.videoUrl = [];

        const parts = this.ctx.multipart();
        let part;
        var course_id, project_id,count = 0;

        while ((part = await parts()) != null) {

            if (part.length) {
                if (part[0] === 'course_id') {
                    course_id = parseInt(part[1]);
                }
                if (part[0] === 'project_id') {
                    project_id = parseInt(part[1])
                }

            } else {
                // 接收多文件上传
                if (!part.filename) {
                    continue;
                }
                let target, url = null;
                if (part.fieldname == "video") {
                    console.log(part)

                    let targetDir = path.join(this.config.baseDir, 'app/public/videos/');

                    //判断视频类型
                    let type = part.filename.split('.')[1];
                    console.log(type);
                    
                    let result = await this.ctx.service.video.upload(course_id, project_id, type,count)
                    target = targetDir + course_id + '_' + project_id + '.' + type ;
                    url = result.url;
                    if (url === null) {
                        res.msg = '上传失败';
                        this.ctx.status = 400;
                        return this.ctx.body = res;
                    }
                    res.msg = '上传成功';
                    count ++;
                }
                const writeStream = fs.createWriteStream(target);
                await pump(part, writeStream);
                res.videoUrl.push(url);

            }
        }

        this.ctx.body = res;
    }
}

module.exports = VideoController;
