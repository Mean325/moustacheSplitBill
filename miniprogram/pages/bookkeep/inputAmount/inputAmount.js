const computedBehavior = require('miniprogram-computed');
const utils = require("../../../utils/utils.js");

const app = getApp();

Page({
  behaviors: [computedBehavior],
  data: {
    bookkeep: {
      num: 45,   // 金额
      type: 1,    // 账目类型,1为支出,2为收入
      category: "",    // 账目分类id
      remark: "",    // 备注
      date: "",   // 日期
    },    // 记账数据
    classList: [],    // 记账分类列表

    today: "",    // 今日日期,用于限制日期选择器必须小于今日
    hasDot: false,    // 是否有小数点,防止用户多次输入小数点
    interval: null,   // 定时器
  },
  computed: {
    activeDay(data) {
      return data.bookkeep.date.split("-")[2] || "1";
    },    // 当前选中的日期,用于右上角小日历显示
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
   * 获取分类列表数据
   * 解决修改分类列表后,不更新的问题
   * @hook 页面显示时
   */
  onShow() {
    this.getCategoryList();
  },
  /**
   * @method 从全局变量中获取分类列表数据
   */
  getCategoryList() {
    let { categoryList } = app.globalData;
    console.log(categoryList);
    let date = utils.getDate();
    this.setData({
      categoryList: categoryList,
      'bookkeep.category': categoryList[0][0]._id,
      'bookkeep.date': date,
      today: date
    })
  },
  /**
   * 赋值给activeType,并重新获取分类列表
   * @hook 顶部分类类型组件改变事件
   */
  handleTypeChange(e) {
    let value = e.detail;
    console.log(value);
    let { categoryList } = app.globalData;
    this.setData({
      'bookkeep.type': value,
      'bookkeep.category': categoryList[value - 1][0]._id
    })
  },
  /**
   * @method 选中分类事件
   */
  selectCategory(e) {
    let _id = e.currentTarget.dataset.id;
    this.setData({
      'bookkeep.category': _id
    });
  },
  /**
   * 跳转到分类管理页面
   * @method 自定义按钮点击事件
   */
  toCategoryManage() {
    wx.navigateTo({
      url: '/pages/setting/classManage/classManage',
    })
  },
  /**
   * @method 记账分类右侧日历点击事件
   */
  bindDateChange(e) {
    let date = e.detail.value;
    this.setData({
      'bookkeep.date': date
    })
  },
  /**
   * 实现数据双向绑定
   * @method 备注input输入事件
   */
  handleInputChange(e) {
    setTimeout(() => {
      this.setData({
        'bookkeep.remark': e.detail.value
      })
    }, 200);
  },
  /**
   * num末尾追加当前点击的数字
   * @method 自定义数字键盘按钮点击事件
   */
  tapKey(e) {
    var key = e.currentTarget.dataset.key;
    let { num } = this.data.bookkeep;
    let { hasDot } = this.data;

    num = Number(num + key);
    if (num > 10000000) {
      wx.showToast({
        title: '输入金额不能大于10,000,000',
        icon: 'none'
      })
      return
    } else {
      num = "" + Math.floor(num * 100) / 100;
      if (key == '.') {
        if (hasDot) return;
        num = num + "."
        this.setData({
          hasDot: true
        })
      }
    }
    this.setData({
      'bookkeep.num': num == '0' ? key : num
    })
  },
  /**
   * 调用云函数添加当前交易
   * @method 自定义数字键盘确认按钮点击事件
   */
  tapSubmit() {
    let data = this.data.bookkeep;
    if (!data.num) {
      wx.showToast({
        title: '金额不能为空或者0',
        icon: 'none',
      })
      return;
    }
    if (!data.category) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none',
      })
      return;
    }
    data.updateTime = new Date().getTime();
    data.num = Math.round(data.num * 100) / 100;
    if (!data.date) {
      data.date = utils.getDate();
    }
    wx.cloud.callFunction({
      name: 'bookkeep',
      data: data
    })
    .then(res => {
      console.log(res);
      if (data._id) {    // 如果是新增,返回上上页
        wx.navigateBack({
          delta: 2,
          success: res => {
            wx.showToast({
              title: '编辑成功',
            })
          }
        })
      } else {    // 如果是新增,返回上一页
        wx.navigateBack({
          success: res => {
            wx.showToast({
              title: '已记一笔',
            })
          }
        });
      }
    })
    .catch(err => {
      wx.showToast({
        icon: 'none',
        title: '记账失败'
      })
      console.error(err)
    })
  },
  /**
   * @method 删除按钮点击事件
   */
  tapDel() {
    let data = this.data.bookkeep;
    let num = "" + data.num;    // 转为String
    if (num == '0') return;
    if (num[num.length - 1] == '.') {
      this.setData({
        hasDot: false
      })
    }
    
    this.setData({
      'bookkeep.num': num.length == 1 ? '0' : num.substring(0, num.length - 1)
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