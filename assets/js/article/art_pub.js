$(function () {
  const form = layui.form
  const layer = layui.layer
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 定义初始化文章类别的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取文章类别失败')
        // 模板引擎，渲染页面
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 注意： 因为类别是动态生成，所以需要调用form.render() 刷新表单
        form.render()
      }
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面把绑定点击事件
  $('#btnChooseImage').on('click', function () {
    // 模拟点击事件，触发选择图片
    $('#coverfile').click()
  })

  // 监听 coverfile 的change事件
  $('#coverfile').on('change', function (e) {
    const files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) return layer.msg('请选择图片')
    // 将拿到的图片装换为一个对应的url地址
    const newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })
  // 为存为草稿绑定点击事件
  let art_state = '已发布'
  $('#btnsave2').on('click', function () {
    art_state = '草稿'
  })
  // 监听表单的 submit 事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    const fd = new FormData($(this)[0])
    fd.append('state', art_state)
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将得到的文件对象存储到 fd
        fd.append('cover_img', blob)
        // 发起ajax请求
        publishArticle(fd)
      })
  })
  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      succes: function (res) {
        if (res.status !== 0) return layer.msg('发布文章失败')
        layer.msg('发布文章成功')
        location.href = '/code/article/art_list.html'
      }
    })
  }
})