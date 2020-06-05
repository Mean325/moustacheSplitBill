require('./libs/Mixins.js');

const themeListeners = [];

App({
  globalData: {
    userInfo: {
      openid: "ouGKR4pZmbV1WnrmRCwHP8_Aw7oA"
    },   // 用户信息
    theme: 'dark', // 主题颜色: light/dark
    deviceInfo: {},   // 设备信息

    activeTeamId: "e1422f825ed082ea006506d73940f5f5",   // 当前active的团队Id
    teamMembers: [
      {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/y4Hxkkub7R6RtbBej5wJkhJg5kYaNEplmCeL4SvguX8fTVSpJ3lshfJhtwcXSY1SVIMicPZMeBaknbr5ZrpuBSQ/132",
        city: "",
        country: "中国",
        gender: 1,
        language: "zh_CN",
        nickName: "Envir°",
        openid: "ouGKR4il4Ltmpoy_g0PJZmRYAtJs",
        province: "上海",
        userInfo: {appId: "wx25f0a48d14b3d7c7", openId: "ouGKR4il4Ltmpoy_g0PJZmRYAtJs"},
        _id: "e1422f825ed099da0065f5aa053d973f"
      }, 
      {
        nickName: "虚拟用户1",
        openid: "baada3ac5ed5aed9002c13e774d1a142",
        _id: "baada3ac5ed5aed9002c13e774d1a142"
      },
      {
        nickName: "匿名用户",
        openid: "baada3ac5ed602120030b27b0347df7a",
        _id: "baada3ac5ed602120030b27b0347df7a",
      },
      {
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epbJ7ycR5ic6ft3alRt8d8Ig7sRM8ibOuvEMHlTSm7vzvk1UQr5LlSxbaIYx9gJdX9LiaHEfu1mPPOOA/132",
        city: "Taizhou",
        country: "China",
        gender: 1,
        language: "zh_CN",
        nickName: "Mean。",
        openid: "ouGKR4pZmbV1WnrmRCwHP8_Aw7oA",
        province: "Zhejiang",
        _id: "331568005ed0869f005d421262378271",
      },
      {
        nickName: "新用户2",
        openid: "baada3ac5ed5c850002d461406572115",
        _id: "baada3ac5ed5c850002d461406572115"
      }
    ],    // 团队成员
  },
  themeChanged(theme) {
    this.globalData.theme = theme;
    themeListeners.forEach((listener) => {
      listener(theme);
    });
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener);
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener);
    if (index > -1) {
      themeListeners.splice(index, 1);
    }
  },
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'mean-hfb19',
        traceUser: true,
      })
    }

    // this.globalData = {};
    this.getDeviceInfo();   // 获取设备信息
  },
  /**
   * @method 获取设备信息
   */
  getDeviceInfo() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.deviceInfo = res;
      }
    })
  },
})
