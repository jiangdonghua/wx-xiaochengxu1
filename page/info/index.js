// page/info/index.js
import {getPrevPage} from '../../assets/libs/utils'

Page({
  data: {
    prices: [
      '100元以下', '100-200元',
      '200-300元', '300-400元',
      '400-500元'
    ],
    priceIndex: 0,
    weights: [
      '1kg', '1-5kg',
      '5-10kg', '10kg'
    ],
    weightIndex: 0,
    types: [
      '生活用品', '鲜花', '蛋糕',
      '生鲜蔬果', '美食', '钥匙',
      '文件', '电子产品', '服饰',
      '其他'
    ],
    typeIndex: 0,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  priceChange(e) {
    this.setData({
      priceIndex: e.detail.value
    })
  },
  weightChange(e) {
    this.setData({
      weightIndex: e.detail.value
    })
  },
  typeChange(e) {
    console.log(e)
    this.setData({
      typeIndex: e.detail.value
    })
  },
  formSubmit(e) {
    this.setData({
      loading: true
    })
    const params = e.detail.value
    const page = getPrevPage()
    page.setData({
      info: `${this.data.types[params.type]}, ${this.data.weights[params.weight]}, ${this.data.prices[params.price]}`
    })
    wx.navigateBack()  
  }
})