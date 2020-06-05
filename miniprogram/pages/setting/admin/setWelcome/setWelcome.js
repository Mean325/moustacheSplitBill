// miniprogram/pages/admin/setWelcome/setWelcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      showWeather: false,
      text: ""
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
   * @hook 天气switch改变事件
   */
  switchWeather(e) {
    let value = e.detail.value;
    this.setData({
      'config.showWeather': value
    })
  },
  /**
   * 实现数据双向绑定
   * @hook 文字textaera输入事件
   */
  handleTextInput(e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({
      'config.text': value
    })
  },
  /**
   * 调用云函数getWelcomeConfig获取
   * @method 获取启动页配置
   */
  getWelcomeConfig() {
    wx.cloud.callFunction({
      name: 'getWelcomeConfig',
      data: {}
    })
      .then(res => {
        let data = res.result.data;
        console.log(res);
        this.setData({
          config: data
        });
      })
      .catch(console.error)
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