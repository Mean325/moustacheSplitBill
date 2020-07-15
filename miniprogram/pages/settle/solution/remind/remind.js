const computedBehavior = require('miniprogram-computed');

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    payee: null,
    payer: null,
    amount: 0,

    selectedValue: null,    // 选中的value值
  },
  computed: {
    // activeDay(data) {
    //   return data.bookkeep.date.split("-")[2] || "1";
    // },    // 当前选中的日期,用于右上角小日历显示
    items(data) {
      const { payee, payer, amount } = data;
      return [
        { value: 0, name: `AA还款提醒: ${ payer }需支付给${ payee }¥${ amount }。` },
        { value: 1, name: `${ payer }，还记得大明湖畔你跟我借的¥${ amount }?` },
        { value: 2, name: `我有几个亿的项目快要动工，就差你的¥${ amount }。` },
        { value: 3, name: `你看天边那朵云,像不像欠我的¥${ amount }?@${ payer }` },
        { value: 4, name: `多么吉利的数字啊:¥${ amount }?@${ payer }` },
        { value: 5, name: `我被红包怪盯上了,${ payer }快拿¥${ amount }救我` }
      ]
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { payee, payer, amount } = options;
    this.setData({
      payee, payer, amount
    })
    // wx.showShareMenu()
  },
  handelRadioChange(e) {
    const { value } = e.detail;
    this.setData({
      selectedValue: value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {  // 来自页面内转发按钮
      console.log(this.data.selectedValue);
      const { selectedValue, items } = this.data;
      const title = items[selectedValue].name;
      return {
        title,
        path: '/page/settle/settle',
        imageUrl: '/images/share.png'
      }
    }
    return {
      title: '推荐你一个好用的AA记账软件',
      path: '/page/welcome/welcome',
      imageUrl: '/images/share.png'
    }
  }
})