'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');

class JupyterController extends Controller {
    async getUrl() {
        var res = {}
        let user_id = parseInt(this.ctx.state.user);
        let result = await this.app.mysql.get('jupyter', {
            user_id: 3
        });
        if (result !== null) {
            let targetDir = result.file_dir + '/' + user_id;
            console.log(targetDir)
            await fs.mkdir(targetDir, function (err) {
                if (err) {
                    return console.log('创建目录失败，目录已存在')
                }
                console.log('创建目录成功');
            });
            res.msg = "获取 Jupyter 路径成功";
            res.url = result.jupyter_url + '/' + user_id;
            return this.ctx.body = res
        }
        res.msg = "获取 Jupyter 路径失败";
        this.ctx.body = res
    }

    async upload() {
        
    }
}

module.exports = JupyterController;
