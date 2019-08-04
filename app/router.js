'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;


  router.get('/', controller.home.index);
  //检查登录情况的中间件
  const checkToken = app.middleware.checkToken({
    secret: "xiaoAqianduanzu"
  });


  //用户登录
  router.post('/api/v1/login', checkToken, controller.user.login);
  //验证用户登录状态
  router.get('/api/v1/verifyUser', controller.user.vertify);
  //获取用户信息
  router.get('/api/v1/userMsg',  checkToken, controller.user.userMsg);

  //获取所有章节
  router.get('/api/v1/course/all_courses', checkToken, controller.course.allCourse);
  //获取分类的章节
  router.get('/api/v1/course', controller.course.courseByTag);
  //获取指定的章节所有项目
  router.get('/api/v1/course/allProject', controller.course.allProject);
  //获取指定的章节具体项目
  router.post('/api/v1/course/project', controller.course.project);
  //获取所有标签
  router.get('/api/v1/course/tag',controller.course.getTag)

  //记录学生学习进度
  router.post('/api/v1/record/progress', checkToken, controller.record.learning_progress);
  //记录学生学习日期与时长
  router.post('/api/v1/record/time', checkToken, controller.record.learning_date)
  //获取学生学习时长记录
  router.get('/api/v1/record/time', checkToken, controller.record.show_time)
  //获取学生学习进度记录
  router.get('/api/v1/record/progress', checkToken, controller.record.show_progress)
  //删除学生学习记录
  router.delete('/api/v1/record', checkToken, controller.record.delete);

  //管理员模块
  router.get('/api/v1/admin/course/all_courses', controller.admin.allCourse);
  router.get('/api/v1/admin/stuId', controller.admin.getBeginId);
  router.resources('stuInfo', '/api/v1/admin/stuInfo', controller.stuInfo)
  
  
  
  
  //测试
  router.get('/api/v1/test', controller.home.test);


};
