$(function () {
  // 点击“去注册”的链接
  $('#link-reg').on('click', function () {
    $('.reg').show()
    $('.login').hide()
  })
  // 点击“去登录”的链接
  $('#link-login').on('click', function () {
    $('.login').show()
    $('.reg').hide()
  })
  //从 layui 中获取 form 对象
  const form = layui.form
  const layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位,且不能出现空格'
    ],
    repwd: function (value) {
      //拿到密码框的值
      const pwd = $('.reg [name=password]').val()
      //进行密码比较
      if (pwd !== value) return '两次密码不一致'
    }
  })
  //调用接口 注册请求
  $('#form_reg').on('submit', function (e) {
    //阻止默认提交
    e.preventDefault()
    const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) return layer.msg(res.message)
      layer.msg(res.message)
      // 模拟点击事件
      $('#link-login').click()
    })
  })
  // 登录请求
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        //把 token 字符串存储到本地存储里
        localStorage.setItem('token', res.token)
        location.href = './index.html'
      }
    })
  })
})