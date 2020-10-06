module.exports = options => {
  return async function adminauth (ctx, next) {
    console.log("openId>>>>", ctx.session.openId)
    console.log("session", ctx.session)
    // console.log("header", ctx.header)
    if (ctx.session.openId) {
      await next()
    } else {
      ctx.body = { data: '没有登录' }
    }
  }
}