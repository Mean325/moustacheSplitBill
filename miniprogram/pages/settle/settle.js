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
    wx.startPullDownRefresh();
  },
  onPullDownRefresh() {
    const { activeTeamId } = app.globalData;
    this.getSettle(activeTeamId);
  },
  /**
   * @method 根据Id获取团队信息
   */
  getSettle(teamId) {
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
      })
      .catch(console.error)
  },
  toSolution() {
    wx.navigateTo({
      url: '/pages/settle/solution/solution',
    })
  }
})