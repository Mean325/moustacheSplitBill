const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),    // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    teamData: {},   // 当前邀请的团队信息
    userInfo: {},    // 用户信息,在获取到openid后,保存到全局变量
    
  },
  onLoad(options) {
    console.log(options);
    const { code } = options;
    if (code) {
      this.getTeamById(code);   // 根据code获取团队信息
    } else {
      console.log("找不到当前code,返回首页")
      wx.navigateTo({
        url: '/pages/welcome/welcome',
      })
    }
  },
  /**
   * 因分享时生成code失效,暂停使用
   * @method 根据路由中的code获取团队信息
   */
  getInvite(code) {
    wx.cloud.callFunction({
      name: 'getInvite',
      data: { code }
    })
    .then(res => {
      console.log(res);
      this.setData({
        teamId: res.result.data._id
      })
    })
    .catch(console.error)
  },
  /**
   * @method 根据路由中的teamId获取团队信息
   */
  getTeamById(teamId) {
    wx.cloud.callFunction({
      name: 'getTeamById',
      data: { teamId }
    })
    .then(res => {
      const { data, code, message } = res.result;
      if (code === 200 && !data.inTeam) {
        this.setData({
          teamData: data
        })
      } else {
        // 未找到该团队时,跳转到首页
        wx.navigateTo({
          url: '/pages/welcome/welcome',
        })
      }
    })
    .catch(console.error)
  },
  /**
   * @method 授权登录按钮点击事件
   */
  bindGetUserInfo(e) {
    const { userInfo } = e.detail;
    if (userInfo) {    // 用户按了允许授权按钮
      this.setData({
        userInfo
      })
      const { _id } = this.data.teamData;
      this.joinTeam(_id);
      this.getOpenid();
    } else {    // 用户按了拒绝按钮
      wx.showToast({
        title: '您拒绝了授权，有些功能将无法正常使用',
        icon: 'none'
      })
    }
  },
  /**
   * @method 加入团队
   */
  joinTeam(teamId) {
    wx.cloud.callFunction({
      name: 'joinTeam',
      data: { teamId },
      success: res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          wx.showToast({
            title: message,
          })
        }
        this.editConfig(teamId) // 更新当前团队及配置
      },
      fail: err => {
        wx.showToast({
          title: '加入团队失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 将新加入的团队设置为当前active
   * @method 保存用户配置
   */ 
  editConfig(teamId) {
    console.log(teamId);
    app.editConfig({
      activeTeamId: teamId
    })
    .then(res => {
      app.globalData.activeTeamId = teamId;
    })
  },
  /**
   * 调用云函数login
   * @method 获取用户openid
   */
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          'userInfo.openid': res.result.openid
        })  // 更新当前页面信息,用户后续储存
        this.saveUser(this.data.userInfo);  // 保存用户信息至数据库
        app.globalData.userInfo = this.data.userInfo;  // 保存用户信息至全局
      },
      fail: err => {}
    })
  },
  /**
   * @method 添加用户信息
   */
  saveUser(data) {
    wx.cloud.callFunction({
      name: 'editUser',
      data: data,
      success: res => {
        wx.navigateTo({
          url: '/pages/welcome/welcome',
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
})