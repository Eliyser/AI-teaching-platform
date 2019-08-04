'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    await ctx.render('index');
  }
  async test() {
    // var path = 'C:/Users/11023/Desktop/AI教学平台/Linux项目实训/Linux系统简介.md';
    // var res = fs.readFileSync(path);
    // var str = res.toString();
    // // console.log(str.length)
    // let html_str = marked(str)
    
    // const row = {
    //   document: str
    // }
    // const options = {
    //   where: {
    //     project_serial: 1
    //   }
    // }
    // const result = await this.app.mysql.update('project', row, options)
    // console.log(result)
    // const result = await this.app.mysql.get('project',{
    //   project_id: 1,
    //   course_id: 1
    // })
    // let html_str = marked(result.document);
    // let s = html_str.split(/(?=<h2)/g);
    // let title = s.shift();
    // console.log(title)
    // // console.log()
    // this.ctx.body = s[0];
  //   let res2 = await this.app.mysql.select('project', {
  //     where: {
  //         course_id: 1,
  //         project_id: 1
  //     },
  //     columns: ['step_amount']
  // })
  // console.log(res2[0])
    let req = {
      username: '123'
    }
  let row = {

  }
  row.username = req.username == undefined ? undefined : req.username
  row.test = req.pass
    this.ctx.body  = row
  }

}

module.exports = HomeController;
