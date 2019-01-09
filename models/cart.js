const axios = require('./api')
//购物车相关的数据操作
exports.add = (userId, productId, amount) => {
  return axios.post(`users/${userId}/cart`, {
    id: productId, amount
  }).then(res => res.data).catch(err => Promise.reject(err))
}

exports.find = (userId) => {
  return axios.get(`users/${userId}/cart`).then(res => res.data).catch(err => Promise.reject(err))
}