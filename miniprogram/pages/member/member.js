const utils = require("../../utils/utils.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},   // 当前用户信息
    teamData: {},

    showActionsheet: false,
    showDialog: false,
    form: {
      nickName: ""
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取当前active的团队信息
    this.getTeamData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    console.log(e);
    const { _id } = this.data.teamData;
    // if (_id) {
      // const aa = await this.createInvite(_teamId);
      // console.log(aa);
      // const { _id } = res.result;
      // console.log(`/pages/invite/invite?code=${ _id }`);
      return {
        title: '我在小胡子AA记账邀请您',
        path: `/pages/invite/invite?code=${ _id }`
      }
    // }
  },
  // 创建邀请     暂未使用
  createInvite(teamId) {
    wx.cloud.callFunction({
      name: 'createInvite',
      data: { teamId }
    })
    .then(res => res)
    .catch(console.error)
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
        const { data, code, message } = res.result;
        if (code === 200) {
          this.setData({
            teamData: data
          })

          app.globalData.teamMembers = data.members;
        }
      })
      .catch(console.error)
  },
  // 邀请按钮点击事件
  addUser() {
    this.setData({
      showActionsheet: true
    })
  },
  close() {
    this.setData({
      showActionsheet: false
    })
  },
  // 添加匿名好友
  showAnonymousUserDialog() {
    this.setData({
      showDialog: true
    })
  },
  tapDialogButton(e) {
    console.log(e);
    if (e.detail.index === 1) {   // 当用户点击确定时
      this.addAnonymousUser();
    }
    this.setData({
      showDialog: false
    })
  },
  /**
   * 实现数据双向绑定
   * @hook 顶部分类名称input输入事件
   */
  handleInputChange(e) {
    this.setData({
      'form.nickName': e.detail.value
    })
  },
  /**
   * 调用云函数AA_addItem新增用户默认分类
   * @method 底部添加分类事件
   */
  addAnonymousUser: utils.throttle(function () {
    let pages = getCurrentPages();
    let { options } = pages.pop();
    let type = Number(options.type);   // 获取路由参数type

    const { nickName } = this.data.form;
    const { activeTeamId } = app.globalData;
    if (!nickName) {
      wx.showToast({
        title: '请输入好友名称',
        icon: 'none',
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'addAnonymousUser',
      data: {
        nickName,
        teamId: activeTeamId
      }
    })
      .then(res => {
        console.log(res);
        wx.showToast({
          title: '创建成功'
        })
        this.setData({
          'form.nickName': ""
        })    // 清空表单数据
        this.getTeamData();   // 重新获取团队信息
      })
      .catch(console.error)
  }, 1000),
  /**
   * @method 跳转到记账页面
   */
  toEditBill() {
    wx.navigateTo({
      url: '/pages/bill/edit/inputAmount/inputAmount',
    })
  }
})