$(function () {
  const form = layui.form
  const laypage = layui.laypage
  // 定义查询数据对象
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  // 模板引擎美化时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    const y = dt.getFullYear()
    const m = zero(dt.getMonth() + 1)
    const d = zero(dt.getDate())
    const hh = zero(dt.getHours())
    const mm = zero(dt.getMinutes())
    const ss = zero(dt.getSeconds())
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  // 定义补零函数
  function zero(n) {
    return n > 9 ? n : '0' + n
  }
  initList()
  initCate()
  function initList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取列表失败')
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }

  // 渲染所有分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取失败')
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit时间
  $('#form-cate').on('submit', function (e) {
    e.preventDefault()
    // 获取 筛选的条件
    const state = $('[name=state]').val()
    const cate_id = $('[name=cate_id]').val()
    q.state = state
    q.cate_id = cate_id
    initList()
  })

  // 分页
  function renderPage(total) {
    laypage.render({
      elem: 'pagebox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [2, 3, 5],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initList()
        }
      }
    })
  }

  // 通过代理形式为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取当前分页的删除按钮数量
    const ln = $('.btn-delete').length
    // 获取点击的删除按钮的id
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: `/my/article/delete/${id}`,
        success: function (res) {
          if (res.status !== 0) return layer.msg('删除失败')
          layer.msg('删除成功')
          if (ln === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initList()
        }
      })
      layer.close(index)
    })
  })


})
