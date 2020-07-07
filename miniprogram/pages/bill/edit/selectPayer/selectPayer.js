const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 成员列表
    selectedMember: [], // 选中的成员openId列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      teamMembers
    } = app.globalData;
    const list = this.formatList(teamMembers);
    this.setData({
      list
    })
  },
  /**
   * 监听页面卸载
   */
  onUnload() {
    const {
      teamMembers
    } = app.globalData,
    selectedMember = new Set(this.data.selectedMember);

    // 将选中的数据返回到上一页
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    prevPage.setData({
      'bill.payer': Array.from(selectedMember),
      payerList: teamMembers.filter(n => selectedMember.has(n.openid))
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
      selectedMember = new Set(this.data.selectedMember);
    if (selectedMember.has(openid)) { // 当已有该openid时,则删除
      selectedMember.delete(openid);
    } else { // 当没有该openid时,则添加
      selectedMember.add(openid);
    }
    console.log(selectedMember);
    this.setData({
      selectedMember: Array.from(selectedMember)
    })

    wx.navigateBack();
  }
})