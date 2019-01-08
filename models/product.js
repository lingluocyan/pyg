//操作产品相关的数据
const axios = require('./api')
// => {}这种形式需要写return => xxx 这种可以省略return
// 获取猜你喜欢数据,需要type=like才能获取到数据
exports.getLikeProducts = () => {
  return axios.get('products?type=like&limit=6')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
//获取某个分类下的产品
//https://ns-api.uieee.com/v1/categories/:id/products?page=1&per_page=10&limit=10&offset=0&sort=commend&include=introduce,category&q=电视
exports.getCateProducts = (cateId, page, size, sort) => {
  const url = `/categories/${cateId}/products?page=${page}&per_page=${size}&sort=${sort}`
  return axios.get(url).then(res => {
    //注意：这个接口的响应头中 x-total-pages 的属性  存储的是总条数数据
    return {
      list: res.data,
      total: res.headers['x-total-pages']
    }
  }).catch(err => Promise.reject(err))
}

//获取某个关键字下的产品
//https://ns-api.uieee.com/v1/products?page=1&per_page=10&limit=5&offset=0&sort=commend&filter=cat:1&include=introduce,category&type=like&q=电视
//定义导出一个方法给controllers层调用
//第一个括号里是形参
exports.getSearchProducts = (q, page, size, sort) => {
  //定义url请求路径
  const url = `products?page=${page}&per_page=${size}&sort=${sort}&q=${q}`
  // 调用这个方法则会返回需要的值，这就是models层的作用
  return axios.get(url)
    .then(res => {
      //返回数据列表和总数，total在响应头中
      return {
        list: res.data,
        total: res.headers['x-total-pages']
      }
    })
    .catch(err => Promise.reject(err))
}

//获取商品的详情信息
//使用es6模板字符串传入需要的id(必须)
//传入true则不带额外数据,false则带额外数据
exports.getProduct = (id, isBasic) => {
  return axios.get(`products/${id}` + (isBasic ? '' : '?include=introduce,category,pictures'))
    .then(res => res.data).catch(err => Promise.reject(err))
}