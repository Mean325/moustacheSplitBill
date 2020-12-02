// miniprogram/pages/my/about/version/detail/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    this.getDetail(id);
  },
  getDetail(id) {
    wx.cloud.callFunction({
      name: 'getVersionById',
      data: {
        id
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            detail: data
          })
        }
      })
      .catch(console.error)
  }
})