const app = getApp()

Page({
  data: {
  },
  onLoad(options) {
  },
  toVersion() {
    wx.navigateTo({
      url: '/pages/setting/about/version/version',
    })
  }
})