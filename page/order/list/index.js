// page/order/list/index.js
import { alert, datetimeFormat, showLoading } from '../../../assets/libs/utils'
import { getReleaseList } from '../../../assets/libs/apis'
import {
  STATUS, STATUS_GIVEUP,
  START_LABEL, TYPE
} from './constant'

const App = getApp()

Page({
  last_id: 0,
  data: {
    items: [],
    hasMore: true,
    STATUS, STATUS_GIVEUP,
    START_LABEL,
    TYPE,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadData()
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

  onPullDownRefresh: function () {
    this.loadData()
  },

  loadData(last_id) {
    if (this.data.loading) {
      return;
    }
    const that = this
    that.setData({
      loading: true
    })
    getReleaseList({
      last_id: last_id || 0,
      success(data) {
        that.last_id = data.last_id
        var list = data.list.map(function (item, i) {
          item.add_time_format = datetimeFormat(item.add_time)
          item.status_label = item.state == '5' ? STATUS_GIVEUP[item.giveup] : STATUS[item.state]
          return item
        })
        that.setData({
          items: last_id ? that.data.items.concat(list) : list,
          hasMore: data.size == 10,
          loading: false,
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onReachBottom(e) {
    if (this.data.hasMore) {
      this.loadData(this.last_id)
    }
  },

})