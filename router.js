//集合所有的路由  具体路由业务在controllers
const express = require('express')
const router = express.Router()
const home = require('./controllers/home')
const account = require('./controllers/account')
const list = require('./controllers/list')
//首页
router.get('/', home.index)
//登录页
router.get('/login', account.login)
//列表页面,正则限制只能输入数字\\代表转义
router.get('/list/:id(\\d+)',list.index)
//猜你喜欢
router.get('/like',home.like)
//查找功能
router.get('/search',list.search)
//exports 不能导出单个内容
module.exports = router