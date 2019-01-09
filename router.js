//集合所有的路由  具体路由业务在controllers
const express = require('express')
const router = express.Router()
const home = require('./controllers/home')
const account = require('./controllers/account')
const list = require('./controllers/list')
const item = require('./controllers/item')
const cart = require('./controllers/cart')
const member = require('./controllers/member')
//首页
router.get('/', home.index)
//登录页
router.get('/login', account.index)//请求页面
router.post('/login',account.login)//逻辑
//列表页面,正则限制只能输入数字\\代表转义
router.get('/list/:id(\\d+)',list.index)
//猜你喜欢
router.get('/like',home.like)
//查找功能
router.get('/search',list.search)
//购物车相关路由
router.get('/cart/add',cart.add)
router.get('/cart',cart.index) //响应页面
router.get('/cart/list',cart.list) //查询 返回 json
router.post('/cart/edit',cart.edit) //编辑 返回 json
router.post('/cart/remove',cart.remove) //删除 返回json
//详情页面  :id代表页面路径为/id
router.get('/item/:id(\\d+)',item.index)
//个人中心
router.get('/member',member.index)
//exports 不能导出单个内容
module.exports = router