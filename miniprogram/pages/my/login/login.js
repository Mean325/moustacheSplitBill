const app = getApp()

Page({
  // mixins: [require('../../mixin/themeChanged')],    // 主题mixins
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),    // 判断小程序的API，回调，参数，组件等是否在当前版本可用
    userInfo: {},    // 用户信息,在获取到openid后,保存到全局变量
  },
  onLoad(options) {
    this.getSetting();
  },
  /**
   * 当userInfo可以被获取时,跳转到首页
   * 否则停留在授权页面
   * @method 获取用户设置
   */
  getSetting() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {    // 用户已授权
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo);
              this.setData({
                userInfo: res.userInfo
              })
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              // wx.login({    // 获取到用户的code
              //   success: res => {
              //     console.log(res);
              //     console.log("用户的code:" + res.code);
                  this.login();
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                  // wx.request({
                  //     // 自行补上自己的 APPID 和 SECRET
                  //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                  //     success: res => {
                  //         // 获取到用户的 openid
                  //         console.log("用户的openid:" + res.data.openid);
                  //     }
                  // });
              //   }
              // });
            }
          });
        }
      }
    });
  },
  saveUser(data) {
    wx.cloud.callFunction({
      name: 'editUser',
      data: data,
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  /**
   * @method 授权登录按钮点击事件
   */
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {    // 用户按了允许授权按钮
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      this.setData({
        userInfo: e.detail.userInfo
      })
      this.login();
    } else {    // 用户按了拒绝按钮
      wx.showToast({
        icon: 'none',
        title: `您拒绝了授权, 将无法正常使用该小程序`,
      })
    }
  },
  /**
   * 保存用户信息
   * @method 登录接口
   */
  login() {
    // 调用云函数login
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.setData({
          'userInfo.openid': res.result.openid
        })
        this.saveUser(this.data.userInfo);
        app.globalData.userInfo = this.data.userInfo;
        wx.navigateBack({
          success: res => {
            wx.showToast({
              title: '登录成功',
            })
          }
        });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },
})