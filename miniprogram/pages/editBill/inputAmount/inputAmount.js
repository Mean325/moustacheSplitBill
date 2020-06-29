const computedBehavior = require('miniprogram-computed');
const utils = require("../../../utils/utils.js");

const app = getApp();

Page({
  behaviors: [computedBehavior],
  data: {
    num: 0,   // 金额

    hasDot: false,    // 是否有小数点,防止用户多次输入小数点
    interval: null,   // 定时器,暂未使用
  },
  computed: {
    // activeDay(data) {
    //   return data.bookkeep.date.split("-")[2] || "1";
    // },    // 当前选中的日期,用于右上角小日历显示
  },
  onLoad(options) {
    let _id = options._id;
    if (_id) {
      let { activeAccountDetail } = app.globalData;
      let { categoryName, openid, categoryIcon, ...data } = activeAccountDetail;
      console.log(_id);
      this.setData({
        bookkeep: { ...data }
      })
    }
  },
  /**
   * num末尾追加当前点击的数字
   * @method 自定义数字键盘按钮点击事件
   */
  tapKey(e) {
    var key = e.currentTarget.dataset.key;
    let { num, hasDot } = this.data;
    let newNum = parseFloat(num + key);
    if (newNum > 10000000) {
      wx.showToast({
        title: '输入金额不能大于10,000,000',
        icon: 'none'
      })
      return
    } else {
      newNum = "" + Math.floor(newNum * 100) / 100;
      if (key === '.') {
        if (hasDot) return;
        newNum = newNum + ".";
        this.setData({
          hasDot: true
        })
      }
    }
    this.setData({
      'num': newNum === '0' ? key : newNum
    })
  },
  /**
   * 调用云函数添加当前交易
   * @method 自定义数字键盘确认按钮点击事件
   */
  tapSubmit() {
    let { num } = this.data;
    if (!num) {
      wx.showToast({
        title: '金额不能为空或者0',
        icon: 'none',
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/editBill/editBill?num=${ num }`,
    })
  },
  /**
   * @method 删除按钮点击事件
   */
  tapDel() {
    let num = "" + this.data.num;
    if (num == '0') return;
    if (num[num.length - 1] == '.') {
      this.setData({
        hasDot: false
      })
    }
    
    this.setData({
      'num': num.length == 1 ? '0' : num.substring(0, num.length - 1)
    })
  },
  /**
   * @method 删除按钮长按事件
   */
  longpressDel() {
    this.tapDel();    // 立即触发一次
    this.setData({
      interval: setInterval(() => {
        this.tapDel()
      }, 500)
    })
  },
  /**
   * @method 删除按钮松开事件
   */
  clearDelInterval() {
    clearInterval(this.data.interval)
  },
  /**
   * @method 自定义数字键盘 - 清除按钮点击事件
   */
  tapClear() {
    this.setData({
      'bookkeep.num': '0',
      hasDot: false
    })
  }
})