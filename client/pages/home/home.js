// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: [{
      icon: '../../images/love.png',
      text: '热门'
    }, {
      icon: '../../images/user.png',
      text: '我的'
    }],
    hotMovie: null, // 随机一部热门电影
    id: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHotMovie()
  },

  getHotMovie() {
    wx.showLoading({
      title: '电影数据加载中...',
    })
    let id = Math.floor(Math.random() * 14 + 1) // 获取1-15的随机数
    qcloud.request({
      url: config.service.hotMovie + id,
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            hotMovie: data.data,
            id
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

  ToDetail() {
    let id = this.data.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },

  ToCommentDetail(){
    let id = this.data.id,
    hotMovie = this.data.hotMovie;
    wx.navigateTo({
      url: '../commentDetail/commentDetail?mid=' + id + '&cid=' + hotMovie.firstComment.id,
    })
  },

  // 跳转页面
  ToItemTab(e) {
    let idx = e.currentTarget.dataset.idx;
    let url = idx ? '../user/user' : '../list/list';
    wx.navigateTo({
      url: url,
    })
  }
})