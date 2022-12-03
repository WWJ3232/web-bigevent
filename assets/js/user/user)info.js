$(function () {
  const form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '用户名须在 1 ~ 6 个字符之间'
      }
    }
  })
  usernameInFo()
  // 获取用户的基本信息
  function usernameInFo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) return layer.msg('用户信息获取失败!')
        form.val('userinfo', res.data)
      }
    })
  }

  // 重置信息
  $('#reset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    usernameInFo()
  })

  // 提交更改信息
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('更新用户信息失败')
        layer.msg('更新用户信息成功')
        window.parent.getUserInfo()
      }
    })
  })
})