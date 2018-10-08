// pages/list/list.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [], // 电影列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMovieList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  getMovieList() {
    wx.showLoading({
      title: '电影数据加载中...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            movieList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载错误',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误',
        })
      }
    })
  },

  // 进入电影详情
  ToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }
})