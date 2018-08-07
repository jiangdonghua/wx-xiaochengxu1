//app.js
import { alert } from 'assets/libs/utils'
import { login } from 'assets/libs/apis'

import { polyfill } from 'assets/libs/object-assign'

polyfill()
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
    getUserInfo: function (callback) {
        const that = this;
        if (that.globalData.userInfo) {
            callback(null, that.globalData.userInfo)
        } else {
            wx.login({

                success: function (res) {
                  console.log(res)
                    login({
                        code: res.code,
                        success(data) {
                            that.globalData.userInfo = data
                            if (data['session_3rd']) {
                                wx.setStorageSync('session_3rd', data['session_3rd'])
                            }
                            wx.getUserInfo({
                                success: function (res) {
                                    that.globalData.userInfo = Object.assign(
                                        that.globalData.userInfo, res.userInfo
                                    )
                                },
                                fail: function (res) {
                                    // fail
                                    alert('获取用户信息失败')
                                },
                                complete: function (res) {
                                    // complete

                                    callback(null, that.globalData.userInfo)
                                }
                            })
                        }
                    })
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        }
    },
  globalData: {
    userInfo: null
  }
})





// App({
//     onLaunch: function () {
//         console.log('App Launch')
//     },
//     onShow: function () {
//         console.log('App Show')
//     },
//     onHide: function () {
//         console.log('App Hide')
//     },
//     onError: function (msg) {
//         wx.showToast(msg)
//     },
//     globalData: {
//         userInfo: null,
//     },
//     getUserInfo: function (callback) {
//         const that = this;
//         if (that.globalData.userInfo) {
//             callback(null, that.globalData.userInfo)
//         } else {
//             wx.login({
//
//                 success: function (res) {
//                     login({
//                         code: res.code,
//                         success(data) {
//                             that.globalData.userInfo = data
//                             if (data['session_3rd']) {
//                                 wx.setStorageSync('session_3rd', data['session_3rd'])
//                             }
//                             wx.getUserInfo({
//                                 success: function (res) {
//                                     that.globalData.userInfo = Object.assign(
//                                         that.globalData.userInfo, res.userInfo
//                                     )
//                                 },
//                                 fail: function (res) {
//                                     // fail
//                                     // alert('获取用户信息失败')
//                                 },
//                                 complete: function (res) {
//                                     // complete
//
//                                     callback(null, that.globalData.userInfo)
//                                 }
//                             })
//                         }
//                     })
//                 },
//                 fail: function (err) {
//                     console.log(err)
//                 }
//             })
//         }
//     },
//
//
// })
