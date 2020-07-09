const computedBehavior = require('miniprogram-computed');
const utils = require("../../../utils/utils.js");

const app = getApp();

Page({
  behaviors: [computedBehavior],
  data: {
    bill: {
      num: 0, // 金额
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
    //   return data.bill.date.split("-")[2] || "1";
    // },    // 当前选中的日期,用于右上角小日历显示
  },
  onLoad(options) {
    let { id, num } = options;
    this.setData({
      'bill.num': parseFloat(num)
    })    // 获取上一页所输入的金额值

    this.setDate();   // 设置日期为今天
    this.getCategoryList();   // 获取分类列表

    if(id) this.getBillDetail(id);   // 当路由中带有id时,为编辑,获取账单详情
  },
  /**
   * 页面显示时,重新计算分账
   * @hook 页面显示时
   */
  onShow() {
    this.calcSplit();
  },
  toInputAmount() {
    wx.navigateTo({
      url: `/pages/bill/edit/inputAmount/inputAmount?num=${ this.data.bill.num }&type=edit`,
    })
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
      'bill.categoryId': categoryList[0]._id
    })
  },
  /**
   * @method 选中分类事件
   */
  selectCategory(e) {
    let _id = e.currentTarget.dataset.id;
    this.setData({
      'bill.categoryId': _id
    });
  },
  /**
   * @method 设置默认记账日期为今日,及日期选择器最大日期
   */
  setDate() {
    let date = utils.getDate();
    this.setData({
      'bill.date': date,
      today: date
    })
  },
  // /**
  //  * 跳转到分类管理页面
  //  * @method 自定义按钮点击事件
  //  */
  // toCategoryManage() {
  //   wx.navigateTo({
  //     url: '/pages/setting/classManage/classManage',
  //   })
  // },
  /**
   * 跳转到选择参与人页面
   * @method 参与人cell点击事件
   */
  selectPart() {
    app.globalData.selectedMembers = this.data.bill.partner;
    wx.navigateTo({
      url: '/pages/bill/edit/selectPart/selectPart',
    })
  },
  /**
   * 跳转到选择付款人页面
   * @method 付款人cell点击事件
   */
  selectPayer() {
    app.globalData.selectedMembers = this.data.bill.payer;
    wx.navigateTo({
      url: '/pages/bill/edit/selectPayer/selectPayer',
    })
  },
  //  计算分账 
  calcSplit() {
    if (this.data.bill.splitType === 1) {   // 分账类型为均分时
      
    }
  },
  /**
   * @method 记账分类右侧日历点击事件
   */
  bindDateChange(e) {
    let date = e.detail.value;
    this.setData({
      'bill.date': date
    })
  },
  /**
   * 实现数据双向绑定
   * @method 备注input输入事件
   */
  handleInputChange(e) {
    setTimeout(() => {
      this.setData({
        'bill.remark': e.detail.value
      })
    }, 200);
  },
  /**
   * 调用云函数
   * @method 在编辑时获取账单详情
   */
  getBillDetail(id) {
    console.log(id);
    wx.cloud.callFunction({
      name: 'getBillById',
      data: { id }
    })
      .then(res => {
        const { data, code, message } = res.result;
        if (code === 200) {
          const payerList = data.payer;
          const partnerList = data.partner;
          data.payer = data.payer.map(n => n.openid);
          data.partner = data.partner.map(n => n.openid);
          this.setData({
            payerList,
            partnerList,
            bill: data
          })
        }
      })
      .catch(console.error)
  },
  /**
   * 调用云函数
   * @method 添加账单
   */
  editBill() {
    const { activeTeamId } = app.globalData;
    wx.cloud.callFunction({
      name: 'editBill',
      data: {
        teamId: activeTeamId,
        ...this.data.bill
      }
    })
      .then(res => {
        const { data, code, message } = res.result;
        console.log(data);
        if (code === 200) {
          wx.navigateBack({
            success: res => {
              wx.showToast({
                title: '记账成功',
              })
            }
          });
        }
      })
      .catch(console.error)
  },
})