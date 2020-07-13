const utils = require("../../utils/utils.js");
const moment = require('../../utils/moment.min.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamList: [],   // 团队列表
    isDialogShow: false,
    form: {
      name: ''
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.startPullDownRefresh();
  },
  onPullDownRefresh() {
    this.getTeamList();
  },
  getTeamList() {
    wx.cloud.callFunction({
      name: 'getTeamList',
      data: {}
    })
      .then(res => {
        let { data, code, message } = res.result;
        if (code === 200) {
          console.log(data);
          data.forEach(n => {
            n.memberNum = n.members.length;
            n.members = n.members.slice(0, 4);
            n.time = moment(n.createTime).format("YYYY年MM月DD日")
          });
          this.setData({
            teamList: data
          });
        }
        wx.stopPullDownRefresh();
      })
      .catch(console.error)
  },
  /**
   * 调用云函数更新用户当前active的团队
   * @hook 团队点击事件
   */ 
  switchTeam(e) {
    const { teamid, teamname } = e.currentTarget.dataset;

    app.globalData.activeTeamId = teamid;
    wx.navigateBack({
      success: () => {
        wx.showToast({
          icon: 'none',
          title: `切换到团队'${ teamname }'`,
        })
      },
    })
    console.log(teamid);
    app.editConfig({
      activeTeamId: teamid
    })
    .then(res => {
      console.log(res);
      console.log("更新配置");
    })
  },
  showModal() {
    this.setData({
      isDialogShow: true
    })
  },
  tapDialogButton(e) {
    console.log(e);
    if (e.detail.index === 1) {   // 当用户点击确定时
      this.addItem();
    }
    this.setData({
      isDialogShow: false
    })
  },
  /**
   * 实现数据双向绑定
   * @hook 顶部分类名称input输入事件
   */
  handleInputChange(e) {
    this.data.form.name = e.detail.value;
  },
  /**
   * 调用云函数AA_addItem新增用户默认分类
   * @method 底部添加分类事件
   */
  addItem: utils.throttle(function () {
    let pages = getCurrentPages();
    let { options } = pages.pop();
    let type = Number(options.type);   // 获取路由参数type

    let { name } = this.data.form;

    this.setData({
      isDialogShow: false
    })    // 隐藏dialog弹窗

    if (!name) {
      wx.showToast({
        title: '请输入团队名称',
        icon: 'none',
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'addTeam',
      data: {
        name
      }
    })
      .then(res => {
        console.log(res);
        wx.showToast({
          title: '创建成功'
        })
        this.getTeamList();   // 重新获取团队列表
      })
      .catch(console.error)
  }, 1000)
})