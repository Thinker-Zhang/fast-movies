// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    commentList: [], // 我的影评列表
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getReleaseList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  getReleaseList() {
    qcloud.request({
      url: config.service.releaseList,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            commentList: data.data
          })
        }
      }
    })
  },

  getCollectList() {
    qcloud.request({
      url: config.service.collectionList,
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            commentList: data.data
          })
        }
      }
    })
  },

  onTapLogin() {
    app.login({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
      }
    })
  },


  ToCommentDetail(e) {
    let idx = e.currentTarget.dataset.idx,
      commentList = this.data.commentList;
    wx.navigateTo({
      url: '../commentDetail/commentDetail?cid=' + commentList[idx].id + '&mid=' + commentList[idx].movie_id,
    })
  },

  showNavbarAction() {
    wx.showActionSheet({
      itemList: ['发布的影评', '收藏的影评'],
      success: res => {
        // console.log(res.tapIndex);
        if (res.tapIndex) {
          this.getCollectList()
        } else {
          this.getReleaseList()
        }
        this.setData({
          currentIndex: res.tapIndex
        })
      }
    })
  },

  // 回到首页
  ToHome() {
    wx.navigateBack({})
  }
})