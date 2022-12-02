$.ajaxPrefilter(function (options) {
  options.url = `http://api-breakingnews-web.itheima.net${options.url}`
  // 统一为有权限的请求设置 请求头
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 全局挂载 complete 这个函数
  // 没有登录不能直接访问后台首页
  // 不论请求 成功还是失败 都会调用 complete 这个回调函数
  options.complete = function (res) {
    // 可以通过 res.responseJSON 拿到响应回来的数据
    //console.log(res)
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清除 localStorage 中的token
      localStorage.removeItem('token')
      // 强制跳转到登录页
      location.href = './login.html'
    }
  }
})