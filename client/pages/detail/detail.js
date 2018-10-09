// pages/detail/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: null, // 热门电影详情
    btn: [{
        icon: '../../images/show.png',
        text: '查看影评'
      },
      {
        icon: '../../images/add.png',
        text: '添加影评'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.getMovieDetail(options.id)
    }
  },

  // 获取电影详情
  getMovieDetail(id) {
    wx.showLoading({
      title: '电影数据加载中...',
    })
    qcloud.request({
      url: config.service.movieDetail,
      method: 'POST',
      data: {
        id: id
      },
      success: result => {
        wx.hideLoading()
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
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '电影数据加载错误',
        })
      }
    })
  },

  ToItemBtn(e) {
    let idx = e.currentTarget.dataset.idx,
      movieDetail = this.data.movieDetail;
    let url = idx ? '../addComment/addComment' : '../commentList/commentList';
    if (idx) {
      qcloud.request({
        url: config.service.releaseList,
        success: result => {
          let data = result.data
          if (!data.code) {
            let commentList = data.data,
              isAdd = false;
            commentList.forEach(item => {
              if (item.movie_id == movieDetail.id) {
                wx.navigateTo({
                  url: '../commentDetail/commentDetail?cid=' + item.id + '&mid=' + item.movie_id,
                })
                isAdd = true;
              }
            })
            if (!isAdd) {
              wx.showActionSheet({
                itemList: ['文字', '音频'],
                success: res => {
                  console.log(res.tapIndex);
                  wx.navigateTo({
                    url: url + '?id=' + movieDetail.id + '&c_type=' + res.tapIndex,
                  })
                }
              })
            }
          }
        }
      })
    } else {
      wx.navigateTo({
        url: url + '?id=' + movieDetail.id,
      })
    }
  }
})