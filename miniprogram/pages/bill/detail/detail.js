// miniprogram/pages/bill/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },
  getOrderDetail(id) {
    console.log(id);
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