const app = getApp();
const log = require('../../utils/log.js');

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    config: {}, // 启动页配置
    statusBarHeight: getApp().globalData.deviceInfo.statusBarHeight, // 获取全局变量的导航栏高度
  },
  onLoad(options) {
    // this.getWelcomeConfig();
    this.getUserInfo();   // 获取用户数据
    this.initData();    // 初始化数据
  },
  // /**
  //  * 调用云函数getWelcomeConfig获取
  //  * @method 获取启动页配置
  //  */
  // getWelcomeConfig() {
  //   wx.cloud.callFunction({
  //     name: 'getWelcomeConfig',
  //     data: {}
  //   })
  //     .then(res => {
  //       let data = res.result.data;
  //       console.log(res);
  //       this.setData({
  //         config: data
  //       });
  //     })
  //     .catch(console.error)
  // },
  /**
   * 当userInfo可以被获取时,保存到userInfo
   * @method 获取用户数据
   */
  getUserInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 用户已授权
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo
              })
            }
          });
        }
        this.getOpenid();
      }
    });
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
        console.log(res);
        this.setData({
          'userInfo.openid': res.result.openid
        })
        app.globalData.userInfo = this.data.userInfo;
        log.info('用户登录:', this.data.userInfo);
      },
      fail: err => {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 1.获取用户配置,如上次active的团队等
   * 2.调用全局获取分类列表方法
   * @method 初始化数据
   */
  initData() {
    Promise.all([app.getConfig(), app.getCategoryList()])
      .then(res => {
        console.log(res)
        wx.switchTab({
          url: '/pages/index/index',
        })
      })
      .catch(e => console.log(e))
  },
})