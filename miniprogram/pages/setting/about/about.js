const app = getApp()

Page({
  data: {
    version: ""
  },
  onLoad(options) {
    const version = this.getVersion();
    this.setData({ version });
  },
  getVersion() {
    const { miniProgram } = wx.getAccountInfoSync()
    const { envVersion, version } = miniProgram;
    switch (envVersion) {
      case "release":
        return version;
      case "develop":
        return "开发版"
      case "trial":
        return "体验版"
      default:
        return ""
    }
  },
  toVersion() {
    wx.navigateTo({
      url: '/pages/setting/about/version/version',
    })
  },
  update() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
      if (!res.hasUpdate) {
        wx.showToast({
          title: '已经是最新版本咯',
          icon: 'none'
        })
      }
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '哎呀,出错了,请您重新添加小程序进行更新',
        showCancel: false
      })
    })
  }
})