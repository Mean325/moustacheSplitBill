const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],   // 结算数据列表
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const { activeTeamId } = app.globalData;
    this.getSettle(activeTeamId);
  },
  onPullDownRefresh() {
    const { activeTeamId } = app.globalData;
    this.getSettle(activeTeamId);
  },
  /**
   * @method 结算当前团队
   */
  getSettle(teamId) {
    wx.showLoading({
      title: '结算中',
    })
    wx.cloud.callFunction({
      name: 'settle',
      data: {
        teamId
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            list: data
          })
          wx.stopPullDownRefresh();
        }
        wx.hideLoading();
      })
      .catch(wx.hideLoading())
  },
  toSolution() {
    wx.navigateTo({
      url: '/pages/settle/solution/solution',
    })
  }
})