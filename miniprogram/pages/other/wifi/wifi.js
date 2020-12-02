// pages/other/wifi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SSID: 'zjzl_asus_5G', //Wi-Fi 的SSID，即账号
    password: 'Zjzl1234567890123', //Wi-Fi 的密码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { SSID, password } = options;
    this.createQrCode(SSID, password);
    if(SSID && password) {
      // this.createQrCode(SSID, password);
      this.setData({
        SSID,
        password
      })
      this.init();
    } else {
      wx.showToast({
        title: '连接出错',
        icon: "none"
      })
    }
  },
  init() {
    //检测手机型号
    wx.getSystemInfo({
      success: (res) => {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        //2.初始化 Wi-Fi 模块
        this.startWifi();
      }
    })
  },
  //初始化 Wi-Fi 模块
  startWifi() {
    wx.startWifi({
      success: () => {
        //请求成功连接Wifi
        this.connectWifi();
      },
      fail: (res) => {
        wx.showToast({
          title: '请确认设备是否支持WiFi',
        })
      }
    })
  },
  connectWifi() {
    wx.startWifi({
      success: (res) => {
        wx.connectWifi({
          SSID: this.data.SSID,
          password: this.data.password,
          success(res) {
            wx.showToast({
              title: 'wifi连接成功',
            })
          },
          fail: (res) => {
            wx.showToast({
              title: 'wifi连接失败',
            })
          }
        })
      }
    })
  },
  createQrCode(SSID, password) {
    wx.cloud.callFunction({
      name: 'createWifiQrCode',
      data: { SSID, password }
    })
      .then(res => {
        console.log(res);
        let base64 = wx.arrayBufferToBase64(res.result.buffer); 
        base64　= 'data:image/jpeg;base64,' + base64;
        console.log(base64)
      })
      .catch(console.error)
  }
})