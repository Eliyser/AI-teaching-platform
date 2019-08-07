'use strict';

const Controller = require('egg').Controller;
var fs = require("fs");
var marked = require("marked");
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index');
  }

  async admin() {
    const { ctx } = this;
    await ctx.render('index_admin');
  }
  async test() {
    
    // // console.log(str.length)
    // let html_str = marked(str)

    
    let path = 'C:/Users/11023/Desktop/AI教学平台/openCV/opencv第一课.md';
    let res = fs.readFileSync(path);
    let str = res.toString();
    console.log(str.length);
    //获取二级标题即步骤标题，生成步骤字符串存入
    let title_array = str.match(/\n(##\s)[^\n]*?\r/g);
    let title_str = '';
    for(let i =0;i<title_array.length;i++) {
      i === title_array.length-1 ? title_str = title_str + title_array[i].replace('\n## ','').replace('\r','')  : title_str = title_str + title_array[i].replace('\n## ','').replace('\r','') + ';'
    }
    const r = await this.ctx.app.mysql.insert('project',{
      project_name :  'Python编程界面入门',
      project_description : '',
      step_amount : title_array.length,
      document : str,
      all_steps: title_str
    })
    
    //更新
    // const row = {
    //   all_steps: title_str
    // }
    // const options = {
    //   where: {
    //     project_serial: 5
    //   }
    // }
    // const result0 = await this.app.mysql.update('project', row, options)
    
    // console.log(result0.affectedRows)

    // const result = await this.app.mysql.get('project', {
    //   course_id: 2,
    //   project_id: 1
    // });
    // let md_array = result.document.split(/(?=[\n]##[\s])/g)
    // let title = md_array.shift()+'\n';
    // let step_md_array = [];
    // for(let i=0;i<md_array.length;i++){
    //   step_md_array.push(md_array[i].replace('\n','')+ '\n');
    // };
 
    // let s = md_str.split(/^(##)(.*)/g);
    
    

    this.ctx.body = r;

    // let html_str = marked(result.document);

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
    //   let req = {
    //     username: '123'
    //   }
    // let row = {

    // }
    // row.username = req.username == undefined ? undefined : req.username
    // row.test = req.pass
    //   this.ctx.body  = row



  }

}

module.exports = HomeController;
