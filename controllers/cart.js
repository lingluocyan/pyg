//购物车路由中间件
const config = require('../config')
const productModel = require('../models/product')
exports.add = (req,res,next) => {
    //购物车相关逻辑
    const id = req.query.id
    //req前面的加号使其转为数组类型
    const amount = +req.query.amount || 1
    //判断是否登录,使用session来判断
    //登录状态
    if(req.session.user) {

    }
    else {
        //把购物车信息存在cookie中
        //约定存储信息的key和value
        //key:pyg_cart_key
        //value:json格式的数组[{id:'商品id',amount:'商品件数'},{}]
        // 获取当前cookie中的购物车信息
        //req.cookies 客户端所有的cookie信息,是中间件cookie-parser提供的
        const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
        //转换为数组类型的json对象，没有数据默认是一个空字符串类型的数组
        const cartList = JSON.parse(cookieStr)
        //添加购物车数据
        //判断购物车数据中是否已经有了现在要加入的商品
        //find方法返回一个对象,条件是item.id == id也就是存在了的数据
        const cart = cartList.find(item => item.id == id)
        if(cart) {
            //说明存在要加入的商品
            cart.amount += amount
        }
        else {
            //没有存在的商品,则追加对象
            cartList.push({
                id,amount
            })
        }
        //把修改好的购物车数据再次存到cookie中
        //设置过期事件
        const expires = new Date(Date.now()+config.cookie.cart_expires)
        res.cookie(config.cookie.cart_key,JSON.stringify(cartList),{expires})
        //获取当前添加的商品信息 渲染页面,传入true只获取基本信息
        productModel.getProduct(id,true)
        .then(data => {
            // 返回需要的信息
            res.locals.cartInfo = {
                id:data.id,
                name:data.name,
                thumbnail:data.thumbnail,
                amount:amount
            }
            res.render('cart-add.art')
        })
        .catch(err=>next(err))
    }
}

//响应页面
exports.index = (req, res, next) => {
    res.render('cart.art')
  }
//查询列表
exports.list = (req, res, next) => {
    if (req.session.user) {
      // 登录状态查询购物车列表信息
    } else {
      //未登录状态的查询购物车列表信息
      /*1. 获取cookie信息*/
      const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
      const cartList = JSON.parse(cookieStr)
      /*2. 根据存储的商品id获取页面需要的数据*/
      /*2.1 生成一个promise数组  有几个商品就生成几个*/
      const promiseArr = cartList.map(item => productModel.getProduct(item.id, true))
      /*2.2 去并行获取*/
      Promise.all(promiseArr).then(results => {
        //results 正好就是一个商品列表数据
        //处理一下 满足页面需要
        const list = results.map((item, i) => {
          return {
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
            price: item.price,
            amount: cartList[i].amount
          }
        })
        res.json({list})
      }).catch(err => {
        res.json([])
      })
    }
  }
/*编辑*/
exports.edit = (req, res, next) => {}
/*删除*/
exports.remove = (req, res, next) => {}