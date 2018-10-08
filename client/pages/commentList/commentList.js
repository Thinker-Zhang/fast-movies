// pages/commentList/commentList.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 电影ID
    commentList: [], // 评论列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.getCommentList(options.id)
      this.setData({
        id: options.id
      })
    }
  },

  getCommentList(id) {
    qcloud.request({
      url: config.service.commentList,
      data: {
        movie_id: id
      },
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

  ToCommentDetail(e) {
    let idx = e.currentTarget.dataset.idx,
      commentList = this.data.commentList;
    wx.navigateTo({
      url: '../commentDetail/commentDetail?cid=' + commentList[idx].id + '&mid=' + commentList[idx].movie_id,
    })
  },

  // 回到首页
  ToHome() {
    wx.redirectTo({
      url: '../home/home',
    })
  }
})