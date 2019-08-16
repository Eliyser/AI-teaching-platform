'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;


  router.get('/', controller.home.index);
  router.get('/admin', controller.home.admin)
  //检查登录情况的中间件
  const checkToken = app.middleware.checkToken({
    secret: "xiaoAqianduanzu"
  });

  const checkAdminToken = app.middleware.checkAdminToken({
    secret: "xiaoAqianduanzu"
  });
  //用户登录
  router.post('/api/v1/login', checkToken, controller.user.login);
  //用户登出
  router.get('/api/v1/logout',controller.user.logout)
  //验证用户登录状态
  router.get('/api/v1/verifyUser', controller.user.vertify);
  //获取用户信息
  router.get('/api/v1/userMsg', checkToken, controller.user.userMsg);

  //restful风格，对course的增删查改
  router.resources('course', '/api/v1/course' , controller.course)
  //获取该学生可见的所有标签
  router.get('/api/v1/courseTag', controller.course.getTag)
  
  //对项目的增删查改
  // router.resources('project','/api/v1/project', controller.project);
  router.get('/api/v1/project',  controller.project.index);
  router.post('/api/v1/project',  controller.project.create);
  router.put('/api/v1/project',  controller.project.update);
  router.delete('/api/v1/project',  controller.project.delete);


  //记录学生学习进度
  router.post('/api/v1/record/progress', checkToken, controller.record.learning_progress);
  //记录学生学习日期与时长
  router.post('/api/v1/record/time', checkToken, controller.record.learning_date)
  //获取学生学习时长记录
  router.get('/api/v1/record/time', checkToken, controller.record.show_time)
  //获取学生学习进度记录
  router.get('/api/v1/record/progress', checkToken, controller.record.show_progress)
  //获取学生课程学习进度
  router.get('/api/v1/record/courseProgress', checkToken, controller.record.show_course_progress)
  //删除学生学习记录
  router.delete('/api/v1/record', checkToken, controller.record.delete);

  //管理员模块
  router.post('/api/v1/admin/login', controller.admin.login)
  //验证管理员登录状态
  router.get('/api/v1/admin/verifyAdmin', controller.admin.vertify);
  //获取所有课程
  router.get('/api/v1/admin/course/all_courses', controller.admin.allCourse);
  //获取该学生可见的所有标签
  router.get('/api/v1/admin/courseTag', controller.admin.getTag)
  //
  router.get('/api/v1/admin/course', controller.course.show)

  //获取学生选课情况和其它个人信息
  router.get('/api/v1/admin/stuId', controller.admin.getBeginId);
  //resful风格对学生信息的增删查改
  router.resources('stuInfo', '/api/v1/admin/stuInfo', controller.stuInfo)
  //上传图片获取图片路径
  router.post('/api/v1/admin/image/upload', controller.image.upload);


  
  //获取jupyter路径
  router.get('/api/v1/jupyterUrl',checkToken, controller.jupyter.getUrl);



  //测试
  router.get('/api/v1/test', controller.home.test);
  router.get('/api/v1/testsh', controller.shell.open);
  router.get('/api/v1/testmysql', controller.home.testmysql);

  

};
