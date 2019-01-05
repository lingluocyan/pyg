const config = require('./config')
const categoryModel = require('./models/category')
//自定义中间件
exports.base = (req,res,next) => {
  //设置头部信息
  res.locals.site = config.site
  //分类信息,获取树状的数据结构
  //使用req.app.locals 应用对象缓存
  if(req.app.locals.category) {
    //如果缓存了直接走缓存
    res.locals.category = req.app.locals.category
    //交给下个中间件处理
    next()
  }
  else {
    categoryModel.getCategoryTree().then(data => {
      //第一次请求肯定没有缓存，进行缓存
      req.app.locals.category = data;
      //第一次没缓存所以放到了响应体里
      res.locals.category = data
      next()
    })
    .catch(err => next(err))
  }
}