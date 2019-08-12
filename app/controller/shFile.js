'use strict';

const Controller = require('egg').Controller;

const callfile = require('child_process');
const  spawn = require('child_process');

class ShFileController extends Controller {
    async open() {
        var exec = spawn.execFile;
        exec('../public/hello.sh', { encoding: 'utf8' }, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
            this.ctx.body = stdout
        });
        
    }
}

module.exports = ShFileController;
