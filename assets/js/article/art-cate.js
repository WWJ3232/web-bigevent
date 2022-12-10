$(function () {
  const form = layui.form
  initArtCateist()
  // 获取文章分类的列表
  function initArtCateist() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        const htmlStr = template('tal-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  let index = null
  //为添加类别绑定点击事件
  $('#car-add').on('click', function () {
    //弹出添加类别的弹出层
    index = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类'
      , content: $('#art-add-eject').html()
    });
  })
  // 通过代理的形式，为form表单绑定 submit 事件
  $('body').on('submit', '#art-add-data', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('添加文章分类失败')
        initArtCateist()
        layer.msg('添加文章分类成功')
        layer.close(index)
      }
    })
  })

  //通过代理的形势，为编辑按钮绑定点击事件
  let indeEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    //弹出添加类别的弹出层
    indeEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类'
      , content: $('#dialog-edit').html()
    })

    const id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })
  // 通过代理形式，为修改表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('更改失败')
        initArtCateist()
        layer.msg('更改成功')
        layer.close(indeEdit)
      }
    })
  })

  //通过代理形式，为删除绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg('删除失败')
          layer.msg('删除成功')
          layer.close(index)
          initArtCateist()
        }
      })
    })
  })
})