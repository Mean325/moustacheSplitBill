const app = getApp();

Page({
  data: {
    activeType: 1,    // 当前分类类型,1为支出,2为收入
    listData: [],
    pageMetaScrollTop: 0,
    scrollTop: 0,
  },
  /**
   * @hook 进入该页面时获取分类列表
   */
  onShow() {
    this.getClassList();
  },
  /**
   * 调用云函数adminClassList获取
   * @method 获取分类列表数据
   */
  getClassList() {
    this.drag = this.selectComponent('#drag');
    let type = this.data.activeType;
    wx.cloud.callFunction({
      name: 'getClassList',
      data: {
        type
      }
    })
      .then(res => {
        let data = res.result.data;
        console.log(data);
        data[type - 1].forEach((item, index) => {
          item.id = index;
          item.bookkeepNum = 0;
          item.fixed = false;
        })
        this.setData({
          listData: data
        });
        app.setCategoryList(data);    // 更新全局categoryList

        this.drag.init();   // 拖动列表初始化
      })
      .catch(console.error)
  },
  /**
   * 赋值给activeType,并重新获取分类列表
   * @hook 顶部分类类型组件改变事件
   */
  handleTypeChange(e) {
    let value = e.detail;
    this.setData({
      activeType: value
    })
  },
  /**
   * 保存改变后的数据
   * 调用云函数
   * @hook 数组拖动排序结束事件
   */
  sortEnd(e) {
    let listData = e.detail.listData;
    let type = this.data.activeType;
    console.log("sortEnd", listData);
    this.setData({
      [`listData[${ type }]`]: listData
    });
    wx.cloud.callFunction({
      name: 'saveClassList',
      data: {
        list: listData,
        type: type
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  },
  /**
   * @hook 数组拖动排序改变事件
   */
  change(e) {
    console.log("change", e.detail.listData)
  },
  /**
   * @hook 数组item点击事件
   */
  itemClick(e) {
    let data = e.detail.data;
    if (data._id) {
      app.setActiveCategoryDetail(data);
      wx.navigateTo({
        url: `/pages/setting/classManage/addClass/addClass?_id=${ data._id }&type=${ data.type }`
      })
    }
  },
  /**
   * 调用云函数delCategory
   * @method 可拖动列表item,右滑删除按钮点击事件
   */
  handleDel(e) {
    console.log(e.detail);
    let { _id, type } = e.detail;
    wx.showModal({
      content: '删除后无法恢复,是否删除?',
      confirmText: '删除',
      confirmColor: '#fa5151',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'delCategory',
            data: {
              _id,
              type
            }
          })
            .then(res => {
              console.log(res);
              // if (res.result.stats.removed === 1) {
              wx.showToast({
                title: '删除成功'
              })
              wx.vibrateShort();
              this.getClassList();
              // }
            })
            .catch(console.error)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 页面滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },
  /**
   * 携带当前记账类型参数,跳转到添加分类页面
   * @method 添加分类按钮点击事件
   */
  addClass() {
    let type = this.data.activeType;
    wx.navigateTo({
      url: `/pages/setting/classManage/addClass/addClass?type=${type}`,
    })
  },
})