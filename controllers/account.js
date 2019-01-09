//导入生成验证码插件
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
const accountModel = require('../models/account')
const config = require('../config')
const cartModel = require('../models/cart')
//离线时只是渲染登录页面
exports.index = (req,res,next)=>{
  //显示登录的页面
  //验证码功能,create()为一张图片
  const captcha = svgCaptcha.createMathExpr({width:108,height:30,fontSize:34})
  //挂到locals上，可以直接{{@svg}}使用
  res.locals.svg = captcha.data
  //保存验证码结果,以便登录使用
  //使用session保存数据
  req.session.captchaText = captcha.text
  res.render('login')
} 

//登录逻辑
//真正的登录
exports.login = (req,res,next) => {
  const body = req.body
  Promise.resolve()
  .then(()=>{
    //1.校验表单数据完整性
    if(!(body.username && body.password && body.captcha)) {
      throw createError(400,'请输入完整的信息！')
    }
    //2.检验验证码
    //如果请求体中的验证码和后端渲染的验证码的内容不一样
    if(body.captcha !== req.session.captchaText) {
      throw createError(400,'验证码错误！')
    }
    //3.校验用户名和密码
    return accountModel.login(body.username,body.password)
  })
  .then(user => {
    if(!(user&&user.id)) {
      throw createError(400,"用户名或密码错误")
    }
    //走到这里说明登录成功
    req.session.user = user
    //4.自动登录功能
    if(body.auto === 1) {
      //传入需要的数据,id和密码
      const autoData = {uid:user.id,pwd:user.password}
      const expires = new Date(Date.now() + config.cookie.remember_expires)
      //传入key value 过期时间
      //设置cookie
      res.cookie(config.cookie.remember_key,JSON.stringify(autoData),{expires})
    }
    //5.cookie中的购物车合并到账号中的购物车
    //拿取cookie数据,以数组的形式,没有则为空数组
    const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
    const cartList = JSON.parse(cookieStr)
    //有几件商品 需要调用几次 添加购物车的接口
    const promiseArr = cartList.map(item => cartModel.add(user.id, item.id, item.amount))
    return Promise.all(promiseArr)
  }).then(() => {
    //合并成功 清除cookie
    res.clearCookie(config.cookie.cart_key)
    //登录逻辑 验证码清除
    req.session.captcahText = null
    //正常的逻辑  重定向 个人中心首页
    res.redirect('/member')
  })
  // .then(()=>{})
  .catch(err => {
    //统一处理错误信息
    console.log('-----------------'+err.message)
    res.locals.errorMessage = err.message
    if(err.status !== 400) {
      res.locals.errorMessage = "服务器繁忙,请稍后再试"
    }
    //验证码错误则保留账号密码
    res.locals.username = body.username
    res.locals.password = body.password
    //由于要重新渲染因此要加上需要的数据
    const captcha = svgCaptcha.createMathExpr({width:108,height:30,fontSize:34})
    res.locals.svg = captcha.data
    req.session.captchaText = captcha.text
    res.render('login')
  })
}