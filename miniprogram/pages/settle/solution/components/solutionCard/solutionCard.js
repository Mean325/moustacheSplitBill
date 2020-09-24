const app = getApp();
const utils = require("../../../../../utils/utils.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }, // 
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRemind() {
      const {
        payer,
        collecter,
        num
      } = this.data.data;
      wx.navigateTo({
        url: `/pages/settle/solution/remind/remind?payee=${ collecter.nickName }&payer=${ payer.nickName }&amount=${ num }`,
      })
    },
    /**
     * 确认结清按钮点击事件
     * 本质上是记一笔账
     */
    repay() {
      wx.showModal({
        title: '提示',
        content: '请再次确认已于对方结清金额',
        success: res => {
          if (res.confirm) {
            const {
              activeTeamId
            } = app.globalData;
            const {
              payer,
              collecter,
              num
            } = this.data.data;
            wx.cloud.callFunction({
                name: 'editBill',
                data: {
                  teamId: activeTeamId,
                  num, // 金额
                  categoryId: "a7d38b365f0ea31e004d9ccb382518c7", // 账目分类id为还款
                  remark: "还款结算", // 备注
                  date: utils.getDate(), // 日期
                  partner: [collecter.openid], // 参与者Id
                  payer: [payer.openid], // 付款人Id
                  splitType: 1, // 分账类型为均分
                }
              })
              .then(res => {
                const {
                  data,
                  code,
                  message
                } = res.result;
                console.log(data);
                if (code === 200) {
                  this.sendReceiveRemind(); // 发送收款提醒订阅消息
                  wx.navigateBack({
                    success: res => {
                      wx.vibrateShort(); // 轻微震动
                      wx.showToast({
                        title: '结清成功',
                      })
                    }
                  });
                }
              })
              .catch(console.error)
          }
        }
      })
    },
    /**
     * @method 发送收款提醒订阅消息
     */
    sendReceiveRemind(billId, amount, collecter, payer) {
      wx.cloud.callFunction({
          name: 'sendReceiveRemind',
          data: {
            billId, // 账单id
            amount, // 金额
            partner: collecter.openid, // 收款者名称
            payer: payer.openid, // 付款人名称
          }
        })
        .then(res => {
          const { data, code, message } = res.result;
          if (code === 200) {
            console.log(data);
          }
        })
        .catch(console.error)
    }
  }
})