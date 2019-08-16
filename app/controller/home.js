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
  async testmysql() {


    var hisCourse = [
      {
        "course_id": 3,
        "course_name": "图像处理-OpenCV单元",
        "course_img": "/public/images/course/3.png",
        "project_id": 3,
        "project_name": "任务3：AI社交应用-找出漫展中的Coser",
        "current_step": 1,
        "project_progress": "1/6",
        "project_status": "learning"
      },
      {
        "course_id": 1,
        "course_name": "操作环境-linux单元",
        "course_img": "/public/images/course/1.png",
        "project_id": 1,
        "project_name": "Linux基础命令应用-洞察Linux系统",
        "current_step": 1,
        "project_progress": "1/5",
        "project_status": "learning"
      },
      {
        "course_id": 1,
        "course_name": "操作环境-linux单元",
        "course_img": "/public/images/course/1.png",
        "project_id": 1,
        "project_name": "Linux基础命令应用-洞察Linux系统",
        "current_step": 1,
        "project_progress": "1/5",
        "project_status": "learning"
      }
    ] ;
    var data = {
      "course_id": 1,
      "header": {
        "title": "操作环境-linux单元",
        "introduction": "熟练地使用 Linux，本实验中通过在线动手实验的方式学习 Linux 常用命令，用户与权限管理，目录结构与文件操作等基本知识点"
      },
      "body": {
        "title": "章节内容",
        "project": [
          {
            "project_id": 1,
            "title": "Linux基础命令应用-洞察Linux系统",
            "content": "知识点: 1.linux为何物 2.linux历史简介 3.linux重要人物 4.linux与windows的不同 5.如何学习linux"
          },
          {
            "project_id": 2,
            "title": "Linux压缩与解压应用-文件管理实现",
            "content": "知识点: 1.Linux基本命令 2.通配符的使用 3.查看帮助文档"
          },
          {
            "project_id": 3,
            "title": "Linux Vim命令应用-文本编辑实现",
            "content": "知识点: 1.每个目录的大体内容 2.文件的属性 3.touch,file,rm,mv等基本命令"
          },
          {
            "project_id": 4,
            "title": "Linux软件安装-安装有趣的应用",
            "content": "知识点: 1.ls、cd、pwd、mkdir等命令的使用"
          },
          {
            "project_id": 5,
            "title": "SSH 技术应用-树莓派远程控制",
            "content": "知识点: 1.xxxx"
          }
        ]
      }
    };
    
    for (let i = 0; i < data.body.project.length; i++) {
      hisCourse.forEach(element => {
        data.body.project[i].status = (data.course_id === element.course_id && data.body.project[i].project_id === element.project_id )? element.project_status:'unfinished';
      });
    }
    this.ctx.body = data




    // let res = await this.app.mysql.insert('test', {
    //   // test: '拉拉α哈哈哈 𝑎_𝑥,𝑎_𝑦, 𝑎_𝑧  a'

    //   test: '&#xD835;&#xDC4E;_&#xD835;&#xDC65;,&#xD835;&#xDC4E;_&#xD835;&#xDC66;, &#xD835;&#xDC4E;_&#xD835;&#xDC67;'

    // })
    // let res1 = await this.app.mysql.select('test')
    // this.ctx.body = res1
  }
  async test() {
    // var res = {}
    // let reqMsg = {
    //   course_id: 3,

    // }
    // let result2 = await this.app.mysql.get('course', {
    //   course_id: reqMsg.course_id
    // })
    // let result0 = await this.app.mysql.select('project', {
    //   where: {
    //     course_id: reqMsg.course_id
    //   },
    //   columns: ['project_id'],
    //   orders: [['project_id', 'desc']]
    // });

    // if (result2.length === 0) {
    //   res.msg = '参数course_id不对，没有此课程';
    //   this.ctx.status = 400;
    //   return this.ctx.body = res;
    // }
    // let project_id = (result0.length === 0) ? 1 : parseInt(result0[0].project_id) + 1;
    // let md_str = reqMsg.markdown;
    // //获取二级标题即步骤标题，生成步骤字符串存入
    // // let steps_array = md_str.match(/(?<!#)(##\s)[^\n]*?\r/g);
    // let steps_array = reqMsg.steps;
    // let steps_str = '';
    // for (let i = 0; i < steps_array.length; i++) {
    //   i === steps_array.length - 1 ? steps_str = steps_str + steps_array[i] : steps_str = steps_str + steps_array[i] + ';'
    // }

    // let result1 = await this.app.mysql.insert('project', {
    //   course_id: reqMsg.course_id,
    //   project_id: project_id,
    //   project_name: reqMsg.project_name,
    //   project_description: reqMsg.description,
    //   all_steps: steps_str,
    //   step_amount: steps_array.length,
    //   document: md_str
    // })

    // await this.ctx.render('jupyter')
    // // console.log(str.length)
    // let html_str = marked(str)
    //   let result0 = await this.app.mysql.select('project', {
    //     where: {
    //       course_id: 8
    //     },
    //     columns: ['project_id'],
    //     orders: [['project_id', 'desc']]
    //   });
    //   if(result0.length===0) {
    //     console.log(1)
    // } else {

    // };
    // let strArray = [];
    // let courseArray = []
    // strArray.forEach(function (data) {
    //   courseArray.push(parseInt(data))
    // });
    // const result = await this.app.mysql.select('course', {
    //   where: { course_id: courseArray }
    // });
    // this.ctx.body = 'kkdhfsdhfkdnfvkehr';
    // this.ctx.status = 400;


    // this.ctx.body = '哈哈哈哈哈哈'
    // this.ctx.status = 200
    // let path = 'C:/Users/11023/Desktop/AI教学平台/openCV/opencv第一课.md';
    // let res = fs.readFileSync(path);
    // let str = res.toString();
    // console.log(str.length);
    // //获取二级标题即步骤标题，生成步骤字符串存入
    // let title_array = str.match(/\n(##\s)[^\n]*?\r/g);
    // let title_str = '';
    // for(let i =0;i<title_array.length;i++) {
    //   i === title_array.length-1 ? title_str = title_str + title_array[i].replace('\n## ','').replace('\r','')  : title_str = title_str + title_array[i].replace('\n## ','').replace('\r','') + ';'
    // }
    // const r = await this.ctx.app.mysql.insert('project',{
    //   project_name :  'Python编程界面入门',
    //   project_description : '',
    //   step_amount : title_array.length,
    //   document : str,
    //   all_steps: title_str
    // })

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
