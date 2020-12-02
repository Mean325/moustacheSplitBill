let iconList = [
  "/images/category/chongwu.png",
  "/images/category/dianying.png",
  "/images/category/fangzu.png",
  "/images/category/hongbao.png",
  "/images/category/hunyinlianai.png",
  "/images/category/jiaju.png",
  "/images/category/jiaotong.png",
  "/images/category/jiaoyu.png",
  "/images/category/liwu.png",
  "/images/category/lvyoudujia.png",
  "/images/category/maicai.png",
  "/images/category/qicheyongpin.png",
  "/images/category/riyongpin.png",
  "/images/category/yaopin.png",
  "/images/category/yiban.png",
  "/images/category/yinpin.png",
  "/images/category/yiwu.png",
  "/images/category/youxi.png",
  "/images/category/yuer.png",
  "/images/category/yule.png",
  "/images/category/yundong.png",
  "/images/category/huankuan.png"
];

const utils = require("../../../../../utils/utils.js");
const app = getApp();

Page({
  data: {
    iconList: [],   // 图标列表
    activeClass: {
      icon: iconList[0],
      name: ""
    }   // 当前active的分类
  },
  /**
   * @hook 页面加载时,获取当前路由参数
   */
  onLoad(options) {
    console.log(options.type);
    this.setData({
      iconList
    });

    let _id = options._id;
    if (_id) {
      let { activeCategoryDetail } = app.globalData;
      console.log(activeCategoryDetail);
      let { fixed, bookkeepNum, ...data } = activeCategoryDetail;
      console.log(_id);
      
      this.setData({
        activeClass: { ...data }
      })
    }
  },
  /**
   * 实现数据双向绑定
   * @hook 顶部分类名称input输入事件
   */
  handleInputChange(e) {
    setTimeout(()=> {
      this.setData({
        'activeClass.name': e.detail.value
      })
    }, 200);
  },
  /**
   * 修改当前icon数据
   * @method 图标点击事件
   */
  selectIcon(e) {
    let { icon } = e.currentTarget.dataset;
    this.setData({
      'activeClass.icon': icon
    })
  },
  /**
   * 调用云函数adminAddClass新增用户默认分类
   * @method 底部添加分类事件
   */
  addClass: utils.throttle(function () {
    let { name, icon, _id } = this.data.activeClass;
    console.log(name);
    if (!name) {
      wx.showToast({
        title: '请输入分类名称',
        icon: 'none',
      })
      return;
    }
    if (!icon) {
      wx.showToast({
        title: '请输入分类图标',
        icon: 'none',
      })
      return;
    }
    console.log("调用云函数");
    wx.cloud.callFunction({
      // 云函数名称
      name: 'editCategory',
      // 传给云函数的参数
      data: {
        name,
        icon,
        _id
      }
    })
    .then(res => {
      console.log(res);
      wx.showToast({
        title: '添加成功',
        icon: 'none',
      })
      wx.navigateBack();    // 返回上一页
    })
    .catch(console.error)
  }, 1000)
})