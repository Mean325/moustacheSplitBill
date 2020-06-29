const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamData: {},  // 团队信息
    amount: 0,    // 团队总消费
    bill: [],   // 账单信息

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
    wx.startPullDownRefresh();
  },
  onPullDownRefresh() {
    const { activeTeamId } = app.globalData;
    console.log(activeTeamId);
    this.getTeamData(activeTeamId);
    this.getBill(activeTeamId);
  },
  /**
   * @method 根据Id获取团队信息
   */
  getTeamData(teamId) {
    wx.cloud.callFunction({
      name: 'getTeamById',
      data: {
        teamId
      }
    })
      .then(res => {
        const team = res.result.list[0];
        const { members } = team;
        app.globalData.teamMembers = members;
        team.members = members.slice(0, 3);
        this.setData({
          teamData: team
        })
      })
      .catch(console.error)
  },
  /**
   * @method 根据Id获取团队信息
   */
  getBill(teamId) {
    wx.cloud.callFunction({
      name: 'getBill',
      data: {
        teamId
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            bill: data.list,
            amount: data.amount
          })
          wx.stopPullDownRefresh();
        }
      })
      .catch(console.error)
  },
})