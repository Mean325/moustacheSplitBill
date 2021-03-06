const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 成员列表
    selectedMembers: [], // 选中的成员openId列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      teamMembers,
      // selectedMembers
    } = app.globalData;
    const list = this.formatList(teamMembers);
    this.setData({
      list,
      // selectedMembers
    })
  },
  /**
   * 监听页面卸载
   */
  onUnload() {
    const {
      teamMembers
    } = app.globalData,
    selectedMembers = new Set(this.data.selectedMembers);

    // 将选中的数据返回到上一页
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    prevPage.setData({
      'bill.payer': Array.from(selectedMembers),
      payerList: teamMembers.filter(n => selectedMembers.has(n.openid))
    })
  },
  // 根据首字母排序
  formatList(list) {
    console.log(list);
    if (!String.prototype.localeCompare) return null;

    const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ#'.split(''),
      zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split(''),
      isChinese = new RegExp("[\u4E00-\u9FA5]+"),
      isEnglish = new RegExp("[A-Za-z]+");

    let segs = []

    letters.forEach((letter, i) => {
      let cur = {
        alpha: letter,
        subItems: []
      }
      list.forEach(item => {
        let firstChar = item.nickName[0];
        if (isChinese.test(firstChar)) {
          // console.log("中文")
          if (firstChar.localeCompare(zh[i]) >= 0 && firstChar.localeCompare(zh[i + 1]) < 0) {
            cur.subItems.push(item)
          }
        } else if (isEnglish.test(firstChar)) {
          // console.log("英文");
          if (firstChar.toUpperCase() === letter) {
            cur.subItems.push(item)
          }
        } else if (letter === "#") {
          // console.log("其余");
          cur.subItems.push(item)
        }
      })
      if (cur.subItems.length) {
        cur.subItems.sort((a, b) => {
          return a.nickName.localeCompare(b.nickName, 'zh')
        })
        segs.push(cur)
      }
    })

    return segs
  },
  onChoose(e) {
    console.log(e)
    const item = e.detail,
      {
        openid
      } = item,
      selectedMembers = new Set(this.data.selectedMembers);
    if (selectedMembers.has(openid)) { // 当已有该openid时,则删除
      selectedMembers.delete(openid);
    } else { // 当没有该openid时,则添加
      selectedMembers.add(openid);
    }
    console.log(selectedMembers);
    this.setData({
      selectedMembers: Array.from(selectedMembers)
    })

    wx.navigateBack();
  }
})