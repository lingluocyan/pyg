//导入api中的公共配置
const axios = require('./api')
// => {}这种形式需要写return => xxx 这种可以省略return 
exports.getCategoryTree = () => {
    //调用分类接口
    //获取全部分类数据，支持两种数据格式。
    return axios.get('categories?format=tree')
    .then(res=>res.data)
    .catch(err=>Promise.reject(err))
}

exports.getCategoryParent = (cateId) => {
    //调用分类包含上一级信息的接口
    //可以不用?直接以/后面加数字来传递参数
    //这里使用es6模板字符串来拼接
    return axios.get(`categories/${cateId}?include=parent`)
    .then(res=>res.data)
    .catch(err=>Promise.reject(err))
}