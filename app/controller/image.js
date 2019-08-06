'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');

class ImageController extends Controller {
    async upload() {
        // const stream = await this.ctx.getFileStream();
        // const filename = stream.filename;

        // // const filename = stream.fields.name + path.extname(stream.filename).toLowerCase();
        // console.log(stream)
        // const target = path.join(this.config.baseDir, 'app/public/images/uploads', filename);
        // const writeStream = fs.createWriteStream(target);
        // await pump(stream, writeStream);
        // console.log(stream.mimeType)
        // console.log(writeStream)


        var res = {};
        res.imageUrl = [];

        const parts = this.ctx.multipart();
        let part;
        while ((part = await parts()) != null) {
            if (part.length) {
                // arrays are busboy fields
            } else {
                // 接收多文件上传
                if (!part.filename) {
                    continue;
                }
                let target,url;
                if (part.fieldname == "image") {
                    console.log(part)
                    //创建目录
                    let date = new Date();
                    let fileFolderName = date.getFullYear() + '_' + (parseInt(date.getMonth()) + 1);
                    console.log(fileFolderName);
                    let targetDir = path.join(this.config.baseDir, 'app/public/images/uploads', fileFolderName);
                    fs.mkdir(targetDir, function (err) {
                        if (err) {
                            return console.log('创建目录失败，目录已存在')
                        }
                        console.log('创建目录成功');
                    });
                    //判断图片类型
                    let type = part.mimeType.replace('image/','');
                    if(type === 'jpeg') {type = 'jpg'}
                    console.log(type)
                    //获取最新的url
                    let result = await this.ctx.service.image.upload(fileFolderName,type)
                    if(result !== null) {
                        target = path.join(targetDir, result.imageName);
                        url = result.url
                    } else {
                        res.msg = '上传失败',
                        this.ctx.status = 400;
                    }
                }
                const writeStream = fs.createWriteStream(target);
                await pump(part, writeStream);
                res.imageUrl.push(url);
                res.msg = '上传成功'
            }
        }

        this.ctx.body = res;


    }
}

module.exports = ImageController;
