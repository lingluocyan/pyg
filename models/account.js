//用户相关的数据操作
const axios = require('./api')
exports.login = (username, password) => {
    //请求users/login接口验证账号密码
    return axios.post('users/login', {
            username,
            password
        })
        .then(res => res.data)
        .catch(err => {
            return Promise.reject(err)
        })
}