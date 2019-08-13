'use strict';

const Controller = require('egg').Controller;

const callfile = require('child_process');
const  exec = require('child_process').execFile;

class ShellController extends Controller {
    async open() {
        // var exec = spawn.execFile;
        callfile.exec('C:\\MyProjects\\AITeachingPlatform\\app\\public\\shell\\hello.sh', function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
            console.log(stderr)
            
        });
        this.ctx.body = 'yes'
    }
}

module.exports = ShellController;
