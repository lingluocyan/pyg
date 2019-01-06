//分页页面业务逻辑
//引入模板引擎
const template = require('art-template')
const path = require('path')
const url = require('url')
/**
 * 生成分页的工具
 * @param options 传参对象
 */
module.exports = (options) => {
  //渲染这个分类需要:总页数 total 当前页码 page 
  //显示按钮个数count
  const total = options.total
  const page = options.page
  //没有传入则默认值是5
  const count = options.count || 5
  const req = options.req
  //console.log(req.url)
  //console.log(req.originalUrl)
  //=====获取地址栏所有的传参去修改其中的page====
  //1. 获取地址栏参数返回的是对象格式 {sort:'price',page:9}
  //2. 去修改page属性的值  .page = 10
  //3. 根据这个对象去还原URL的字符串格式的传参  url+?sort=price&page=10
  //const urlObject = url.parse(req.url, true) //返回的对象中包含一个query属性  对象包含传参的对象
  //urlObject.query.page = 10
  //urlObject里面还有一个search属性 就是？后面的字符串包含问号
  //console.log(urlObject.search)
  //urlObject.search = undefined
  //如果设置成undefined  就不是使用search生成URL地址
  //就会使用 query 对象  转换成键值对字符串  querystring模块的 stringify()函数 生成URL地址
  //console.log(url.format(urlObject))  //设置完数据后直接格式化是不会用到设置过的数据的
  // 这里把原始字符串转为对象，如果不加true就换转为键等于值的形式,写在外面下面都可以使用,parse和下面的format都是内置模块url的方法，使用需要导入url模块
  const urlObject = url.parse(req.originalUrl,true)
  // currPage是传入想要改变的页数
  const getUrl = (currPage) => {
    //这里的search是对象的隐藏属性，如果不设置undefined会影响后面的操作
    urlObject.search = undefined
    //这里给里面的page重新赋值，currpage是动态传入的数据
    urlObject.query.page = currPage
    //把对象转回字符串
    return url.format(urlObject)
  }
  //分页按钮逻辑
  let begin = page - Math.floor(count / 2)//以5开始总页数5则开始位置5-2.5向下取整=3，则3是开始位置
  //判断页面往前推的特殊情况
  begin = begin < 1 ? 1 : begin
  let end = begin +  count - 1//当前第5页，则beigin为3 3+5-1=7,为end
  //end不能比总数多
  end = end > total ? total : end
  //当剩余数量不足一页需要从前面补按钮的特殊情况
  begin = end - count + 1
  begin = begin < 1 ? 1 : begin 
  //渲染按钮
  //基于模版和数据
  //单独使用模版引擎来渲染
  //如果想在页面中使用  那么需要控制器中去计算分页需要的数据
  //所以在这封装HTML格式的代码  template('id',data)  template('url',data)
  const urlTemplate = path.join(__dirname,'../views/component/pagination.art')
  //注意 模版引擎输入HTML格式的内容会提前转移成普通字符串  < &lt; > &gt;
  //如果想输入HTML格式的字符串  {{@html}} {{#html}}  <%#=html%>
  //网络安全 xss攻击 ===> cross site script  跨站脚本（js,sql）攻击
  //如果输出的HTML格式 回去执行script脚本 如果这段脚本是恶意的 那么就是xss攻击
  //靠模版引擎输出的：'<script>while (true){alert("你被攻击了")} <\/script>'
  //默认输出的转义过后的字符串
  //在给网站提交数据的时候  后台会默认处理出转义过后的字符
  // 原生语法 <% %> 直接可以写任何的JS语法
  //服务端使用art-template渲染页面,需要(url,{参数})
  //传入了页码,分页开始位置,总页数,分页结束位置,分页函数,以对象形式传入url中的数据
  return template(urlTemplate,{page, begin, end, total, getUrl, query: urlObject.query})
}