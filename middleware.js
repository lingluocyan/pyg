const config = require('./config')
const categoryModel = require('./models/category')
//自定义中间件

//页面需要的公用信息设置中间件
exports.base = (req, res, next) => {
  //1. 设置头部信息
  res.locals.site = config.site
  //2. 设置用户信息
  if(req.session.user){
    res.locals.user = req.session.user
  }
  //3. 分类信息  获取树状的数据结构
  //如果已经缓存了
  //req.app.locals 应用对象存数据的对象locals
  //res.locals 响应报文对象存储数据的对象locals
  if(req.app.locals.category){
    res.locals.category = req.app.locals.category
    next()
  }else{
    categoryModel.getCategoryTree().then(data => {
      //当你请求第一次成功  缓存分类数据
      req.app.locals.category = data;
      res.locals.category = data
      next()
    }).catch(err => next(err))
  }
}