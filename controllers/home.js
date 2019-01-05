//首页相关业务逻辑
const homeModel = require('../models/home')
const productModel = require('../models/product')

exports.index = (req, res, next) => {
  //渲染轮播图
  Promise.all([
      homeModel.getSlider(),
      productModel.getLikeProducts()
    ])
    .then(results => {
      //result[0]代表第一个计算后返回的结果
      res.locals.sliders = results[0]
      res.locals.likes = results[1]
      res.render('home.art')
    })
    .catch(err => {
      next(err)
    })
}

//猜你喜欢的数据
exports.like = (req, res, next) => {
  productModel.getLikeProducts().then(data => {
    res.json(data)
  }).catch(err => next(err))
}