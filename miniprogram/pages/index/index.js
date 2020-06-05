const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamData: {},  // 团队信息  

    slideButtons: [{
      type: 'warn',
      text: '删除'
    }],   // 左滑删除组件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(app.globalData.activeTeamId);
    this.getTeamData();
  },
  // 获取团队信息
  getTeamData() {
    const { activeTeamId } = app.globalData;
    wx.cloud.callFunction({
      name: 'getTeamById',
      data: {
        teamId: activeTeamId
      }
    })
      .then(res => {
        const team = res.result.list[0];
        team.members = team.members.slice(0, 3);
        this.setData({
          teamData: team
        })
      })
      .catch(console.error)
  },
})