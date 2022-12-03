$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  // 监听上传的 change 事件
  $('#file').on('change', function (e) {
    const filelist = e.target.files
    if (filelist.length === 0) {
      return layui.layer.msg('请选择照片')
    }

    //拿到用户选择的文件
    const file = filelist[0]
    // 将拿到的文件转换为路径 
    const image = URL.createObjectURL(file)
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', image)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域

  })

  // 为 确认 按钮绑定事件
  $('#btnUpload').on('click', function () {

    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 调用接口 把图片上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更换头像失败')
        }
        layui.layer.msg('更换头像成功')
        window.parent.getUserInfo()
      }
    })
  })
})