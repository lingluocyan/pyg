//详情相关的控制器
//导入数据模型product使用其getProduct方法
const productModel = require('../models/product')
exports.index = (req,res,next) => {
    //1.需要商品图片数据
    //2.需要商品信息
    //3.需要商品简介
    //4.需要随机的商品列表信息
    //5.需要商品分类数据
    //?id传参使用req.query，/id传参使用pramas ,请求体使用req.body
    const id = req.params.id
    Promise.all([
        //传入false 获取完整信息
        productModel.getProduct(id,false),
        productModel.getLikeProducts()
    ])
    .then(results => {
        res.locals.detail = results[0]
        res.locals.likes = results[1]
        res.render('item.art')
        //输出所有挂载到locals的数据到页面上
        // res.json(res.locals)
    })
    .catch(err => next(err))
}