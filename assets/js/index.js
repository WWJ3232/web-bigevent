$(function () {
  getUserInfo()
  //实现退出登录
  $('#out').on('click', function () {
    //弹出确认框
    layui.layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 删除本地存储的 token
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = './login.html'
      // 关闭弹出框
      layer.close(index);
    })
  })
})

// 获取用户信息和图像的函数
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
      renderAvater(res.data)
    },
    /*     // 没有登录不能直接访问后台首页
        // 不论请求 成功还是失败 都会调用 complete 这个回调函数
        complete: function (res) {
          // 可以通过 res.responseJSON 拿到响应回来的数据
          //console.log(res)
          if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清除 localStorage 中的token
            localStorage.removeItem('token')
            // 强制跳转到登录页
            location.href = './login.html'
          }
        } */
  })
}

// 获取用户的头像
function renderAvater(users) {
  const name = users.nickname || users.username
  $('#weclome').html(name)
  // 按需渲染头像
  if (users.user_pic !== null) {
    $('.layui-nav-img').attr('src', users.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
