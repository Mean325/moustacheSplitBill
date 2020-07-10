Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],   // 版本介绍列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getList();
  },
  getList() {
    wx.cloud.callFunction({
      name: 'getVersion',
      data: {}
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            list: data
          })
        }
      })
      .catch(console.error)
  },
  toEdit(e) {
    let { id } = e.currentTarget.dataset;
    console.log(id);
    wx.navigateTo({
      url: `/pages/setting/admin/version/edit/edit?id=${ id }`,
    })
  },
  toDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/setting/about/version/detail/detail?id=${ id }`,
    })
  }
})