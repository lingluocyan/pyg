//操作产品相关的数据
const axios = require('./api')
// => {}这种形式需要写return => xxx 这种可以省略return
// 获取猜你喜欢数据,需要type=like才能获取到数据
exports.getLikeProducts = () => {
    return axios.get('products?type=like&limit=6')
    .then(res=>res.data)
    .catch(err=>Promise.reject(err))
}
//获取某个分类下的产品
//https://ns-api.uieee.com/v1/categories/:id/products?page=1&per_page=10&limit=10&offset=0&sort=commend&include=introduce,category&q=电视
exports.getCateProducts = (cateId, page, size, sort) => {
    const url = `/categories/${cateId}/products?page=${page}&per_page=${size}&sort=${sort}`
    return axios.get(url).then(res => {
      //注意：这个接口的响应头中 x-total-pages 的属性  存储的是总条数数据
      return {list:res.data,total:res.headers['x-total-pages']}
    }).catch(err => Promise.reject(err))
  }