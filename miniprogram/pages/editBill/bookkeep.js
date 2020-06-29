const computedBehavior = require('miniprogram-computed');
const utils = require("../../utils/utils.js");

const app = getApp();

Page({
  behaviors: [computedBehavior],
  data: {
    bookkeep: {
      num: 45, // 金额
      categoryId: "", // 账目分类id
      remark: "", // 备注
      date: "", // 日期
      partner: [], // 参与者Id
      payer: [], // 付款人Id
      splitType: 1, // 分账类型, 1为均分, 2为具体
    }, // 记账数据

    partnerList: [], // 参与人列表,仅用于显示
    payerList: [], // 付款人列表
    categoryList: [], // 记账分类列表
    today: "", // 今日日期,用于限制日期选择器必须小于今日
  },
  computed: {
    // activeDay(data) {
    //   return data.bookkeep.date.split("-")[2] || "1";
    // },    // 当前选中的日期,用于右上角小日历显示
  },
  onLoad(options) {
    let { _id, num } = options;
    this.setData({
      'bookkeep.num': num
    })

    this.getCategoryList();

    if (_id) {
      let {
        activeAccountDetail
      } = app.globalData;
      let {
        categoryName,
        openid,
        categoryIcon,
        ...data
      } = activeAccountDetail;
      console.log(_id);
      this.setData({
        bookkeep: {
          ...data
        }
      })
    }
  },
  /**
   * 页面显示时,重新计算分账
   * @hook 页面显示时
   */
  onShow() {
    this.setDate();
    this.calcSplit();
  },
  /**
   * @method 从全局变量中获取分类列表数据
   */
  getCategoryList() {
    let {
      categoryList
    } = app.globalData;
    this.setData({
      categoryList,
      'bookkeep.categoryId': categoryList[0]._id
    })
  },
  /**
   * @method 选中分类事件
   */
  selectCategory(e) {
    let _id = e.currentTarget.dataset.id;
    this.setData({
      'bookkeep.categoryId': _id
    });
  },
  /**
   * @method 设置默认记账日期为今日,及日期选择器最大日期
   */
  setDate() {
    let date = utils.getDate();
    this.setData({
      'bookkeep.date': date,
      today: date
    })
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
  // 选择参与人
  selectPart() {
    wx.navigateTo({
      url: '/pages/editBill/selectPart/selectPart',
    })
  },
  // 选择付款人
  selectPayer() {
    wx.navigateTo({
      url: '/pages/editBill/selectPayer/selectPayer',
    })
  },
  //  计算分账 
  calcSplit() {
    if (this.data.bookkeep.splitType === 1) {   // 分账类型为均分时
      
    }
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
   * 调用云函数
   * @method 添加账单
   */
  editBill() {
    wx.cloud.callFunction({
      name: 'editBill',
      data: {
        ...this.data.bookkeep
      }
    })
      .then(res => {
        let { data } = res.result;
        console.log(data);
      })
      .catch(console.error)
  },
})