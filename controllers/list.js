const productModel = require('../models/product')
const categoryModel = require('../models/category')
//渲染商品列表
exports.index = (req,res,next) => {
    //这些数据都可以通过查询字符串获取参数,然后挂载到全局对象公用
    //获取分类id
    // 路由如果是?id=xx则使用req.query.id
    // 如果是/:id,则使用req.params.id
    const cateId = req.params.id
    //获取分页的页码,默认第一页
    const page = req.query.page || 1
    //定义每页的数量
    const size = 10
    //获取排序方式,没有则默认commend
    const sort = req.query.sort || 'commend'
    //为了同步获取获取数据,使用Promise.all,这个方法等最慢的请求完毕才会继续执行
    Promise.all([
        categoryModel.getCategoryParent(cateId),
        productModel.getCateProducts(cateId,page,size,sort)
    ]).then(results=>{
        res.locals.cate = results[0] //分类数据
        res.locals.list = results[1].list //列表数据
        res.locals.sort = sort  //排序数据   price 降序  -price 升序
        res.locals.total = results[1].total //分页总页数
        res.render('list.art')
    })
}