Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 版本介绍列表

    slideButtons: [{
      type: 'default',
      text: '编辑'
    }, {
      type: 'warn',
      text: '删除'
    }], // 左滑编辑/删除组件
  },
  onShow() {
    this.getList();
  },
  getList() {
    wx.cloud.callFunction({
        name: 'getVersion',
        data: {}
      })
      .then(res => {
        const {
          data,
          code,
          message
        } = res.result;
        if (code === 200) {
          this.setData({
            list: data
          })
        }
      })
      .catch(console.error)
  },
  toEdit(e) {
    const {
      id
    } = e.currentTarget.dataset;
    console.log(id);
    wx.navigateTo({
      url: `/pages/my/admin/version/edit/edit?id=${id}`,
    })
  },
  toDetail(e) {
    const {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/my/about/version/detail/detail?id=${id}`,
    })
  },
  handleSlideTap(e) {
    const {
      index
    } = e.detail;
    const {
      id
    } = e.currentTarget.dataset;
    if (index === 0) { // 点击编辑按钮时
      console.log(id);
      wx.navigateTo({
        url: `/pages/my/admin/version/edit/edit?id=${id}`,
      })
    } else if (index === 1) { // 点击删除按钮时
      console.log(id);
      wx.showModal({
        title: '提示',
        content: '您确定要删除此版本吗?删除后无法恢复',
        success: res => {
          if (res.confirm) {
            wx.cloud.callFunction({
                name: 'delVersion',
                data: {
                  _id: id
                }
              })
              .then(res => {
                const {
                  data,
                  code,
                  message
                } = res.result;
                if (code === 200) {
                  wx.showToast({
                    title: '删除成功',
                  })
                  this.getList();
                }
              })
              .catch(console.error)
          }
        }
      })
    }
  }
})