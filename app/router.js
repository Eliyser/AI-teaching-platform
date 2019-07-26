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

  //获取所有章节
  router.get('/api/v1/course/all_courses', controller.course.allCourse);
  //获取分类的章节
  router.get('/api/v1/course', controller.course.courseByTag);
  //获取指定的章节所有项目
  router.get('/api/v1/course/allProject', controller.course.allProject);
  router.post('/api/v1/course/project', controller.course.project);

  //测试
  router.get('/api/v1/test', controller.course.test);


};
