// pages/commentDetail/commentDetail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: null, // 热门电影详情
    commentDetail: null, // 电影评论详情
    btn: [{
        icon: '../../images/label.png',
        text: '收藏影评'
      },
      {
        icon: '../../images/edit.png',
        text: '写影评'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.getMovieDetail(options.mid)
      this.getCommentDetail(options.cid)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 获取电影详情
  getMovieDetail(id) {
    qcloud.request({
      url: config.service.movieDetail,
      method: 'POST',
      data: {
        id: id
      },
      success: result => {
        let data = result.data
        if (!data.code) {
          this.setData({
            movieDetail: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '电影数据加载错误',
          })
        }
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误',
        })
      }
    })
  },

  // 获取影评详情
  getCommentDetail(id) {
    wx.showLoading({
      title: '影评数据加载中...',
    })
    qcloud.request({
      url: config.service.commentDetail,
      method: 'POST',
      data: {
        id: id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            commentDetail: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '影评数据加载错误',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '影评数据加载错误',
        })
      }
    })
  },

  palyAudio() {
    console.log('点击按钮')
    innerAudioContext.src = this.data.commentDetail.content
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
  },

  ToItemBtn(e) {
    let idx = e.currentTarget.dataset.idx,
      commentDetail = this.data.commentDetail;
    if (idx) {
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success: res => {
          // console.log(res.tapIndex);
          wx.navigateTo({
            url: '../addComment/addComment?id=' + commentDetail.movie_id + '&c_type=' + res.tapIndex,
          })
        }
      })
    } else {
      wx.showLoading({
        title: '正在收藏评论'
      })
      qcloud.request({
        url: config.service.addCollection,
        login: true,
        method: 'PUT',
        data: {
          comment_id: commentDetail.id
        },
        success: result => {
          wx.hideLoading()
          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '收藏评论成功'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏评论失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '收藏评论失败'
          })
        }
      })
    }
  }
})