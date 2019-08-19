'use strict';
const JWT = require('jsonwebtoken');

module.exports = options => {
  
  return async function(ctx, next) {

    var token = ctx.cookies.get('egg_admin_token',{
      signed: true,
    })
 

    const method = ctx.method.toLowerCase();
    
    
      if (token === undefined) {
       
        //cookie不存在
        if (ctx.path === '/api/v1/admin/register' || ctx.path === '/api/v1/admin/login') {
          await next();
        } else {
          ctx.status = 401;
            return ctx.body = '未授权，请登录';
        }
      } else {
        //cookie存在，判断用户登录信息是否过期
        let decode;
        try {
          console.log('token :'+token);
          decode = JWT.verify(token, options.secret);
          console.log(decode)
          if (!decode || !decode.name) {
     
            ctx.status = 401;
            return ctx.body = '未授权，请登录';
            
          }
          else if (Date.now()/1000 - decode.exp > 0) {

            ctx.status = 402;
            return ctx.body = '登录已过期，请重新登录';
          }
          else {
            ctx.state.admin = decode.name;
          }

        } catch (e) {
          console.log(e);
        }
        await next();
      } 
      
  };
};
