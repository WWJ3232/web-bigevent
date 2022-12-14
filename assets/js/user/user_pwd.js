$(function () {
  const form = layui.form
  // 定义密码验证规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位,且不能出现空格'
    ],
    // 新密码不能与原密码一致
    nPwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新密码不能与旧密码一致'
      }
    },
    // 新密码与确认密码一致才能修改密码
    samePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次输入密码不一致'
      }
    }
  })

  // 发起请求修改密码
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('密码修改失败')
        }
        $('.layui-form')[0].reset()
        layui.layer.msg('密码修改成功')
      }
    })
  })
})