// miniprogram/pages/bill/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bill: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    if(id) {
      this.getOrderDetail(id);
    } else {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const pages = getCurrentPages();
    const { options } = pages.pop();
    const { id } = options;
    this.getOrderDetail(id);
  },
  getOrderDetail(id) {
    console.log(id);
    wx.cloud.callFunction({
      name: 'getBillById',
      data: { id }
    })
      .then(res => {
        const { data, code, message } = res.result;
        console.log(data);
        if (code === 200) {
          this.setData({
            bill: data
          })
        }
      })
      .catch(console.error)
  },
  editBill() {
    const pages = getCurrentPages();
    const { options } = pages.pop();
    const { id } = options;
    wx.redirectTo({
      url: `/pages/editBill/editBill?id=${ id }`,
    })
  }
}) 