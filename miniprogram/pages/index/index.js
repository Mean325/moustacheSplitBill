const app = getApp();
const computedBehavior = require('miniprogram-computed');   // computed/watch拓展
const log = require('../../utils/log.js');
const team = require('../../utils/team.js');   // 团队相关utils

Page({
  behaviors: [computedBehavior],
  data: {
    teamData: {},  // 团队信息
    amount: 0,    // 团队总消费
    bill: [],   // 账单信息

    slideButtons: [{
      type: 'warn',
      text: '删除'
    }],   // 左滑删除组件
  },
  computed: {
    members(data) {
      let members = data.teamData ? data.teamData.members || [] : [];
      return members.slice(0, 3);
    },    // 成员信息,用于右上角展示
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.showModal({
    //   title: '感谢',
    //   content: "感谢您使用小胡子记账,该小程序处于初步上线阶段,有很多不完善的地方,欢迎您在'我的'-'意见反馈'中向我提出.",
    //   showCancel: false
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.refresh();
  },
  onPullDownRefresh() {
    this.refresh();
  },
  /**
   * @method 重新获取当页数据
   */
  refresh() {
    const { activeTeamId } = app.globalData;
    console.log(activeTeamId);
    if (activeTeamId) {
      this.getTeamData(activeTeamId);
      this.getBill(activeTeamId);
    }
  },
  /**
   * @method 根据Id获取团队信息
   */
  getTeamData(teamId) {
    team.getTeamById(teamId).then(res => {
      this.setData({
        teamData: res
      })
      log.info('获取团队数据:', res);
    })
    .catch(err => {
      log.info('获取团队数据失败:', err);
    })
  },
  /**
   * @method 根据Id获取团队账单列表
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
  /**
   * @method 查看账单详情
   */
  toDetail(e) {
    console.log(e);
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/bill/detail/detail?id=${ id }`,
    })
  },
  /**
   * @method 删除账单
   */
  deleteBill(e) {
    const { id } = e.currentTarget.dataset;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '您确定要删除此账单吗?删除后无法恢复',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'delBill',
            data: {
              id
            }
          })
            .then(res => {
              const { data, code, message } = res.result;
              if (code === 200) {
                wx.showToast({
                  title: '删除成功',
                })
                this.refresh();
              }
            })
            .catch(console.error)
        }
      }
    })
  }
})