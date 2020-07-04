const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    solutionList: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.startPullDownRefresh();
  },
  onPullDownRefresh() {
    const { activeTeamId } = app.globalData;
    this.getSolution(activeTeamId);
  },
  /**
   * @method 根据Id获取团队信息
   */
  getSolution(teamId) {
    wx.cloud.callFunction({
      name: 'getSolution',
      data: {
        teamId
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            solutionList: data
          })
        }
        wx.stopPullDownRefresh();
      })
      .catch(console.error)
  },
})