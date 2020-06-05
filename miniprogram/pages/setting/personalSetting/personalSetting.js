// miniprogram/pages/admin/setWelcome/setWelcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      remind: false,
      remindTime: "0:00"
    }
  },
  /**
   * 获取云端配置
   * @hook 页面加载时
   */
  onLoad(options) {
    this.getWelcomeConfig();
  },
  /**
   * 实现数据双向绑定
   * @hook 提醒switch改变事件
   */
  switchRemind(e) {
    let value = e.detail.value;
    this.setData({
      'config.remind': value
    })
  },
  /**
   * 实现数据双向绑定
   * @hook 提醒日期改变事件
   */
  handleRemindTimeChange(e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({
      'config.remindTime': value
    })
  },
  /**
   * 调用云函数getWelcomeConfig获取
   * @method 获取启动页配置
   */
  getWelcomeConfig() {
    // wx.cloud.callFunction({
    //   name: 'getWelcomeConfig',
    //   data: {}
    // })
    //   .then(res => {
    //     let data = res.result.data;
    //     console.log(res);
    //     this.setData({
    //       config: data
    //     });
    //   })
    //   .catch(console.error)
  },
  /**
   * 调用云函数adminSetWelcome获取
   * @method 设置启动页配置
   */
  saveWelcomeConfig() {
    wx.cloud.callFunction({
      name: 'adminSetWelcome',
      data: {
        config: this.data.config
      }
    })
      .then(res => {
        console.log(res);
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack();
      })
      .catch(console.error)
  }
})