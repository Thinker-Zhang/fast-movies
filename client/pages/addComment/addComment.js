// pages/addComment/addComment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()
const recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 电影ID
    c_type: 0, // 影评类型
    userInfo: null, // 用户信息
    commentValue: '',
    tempFilePath: null,
    isReview: false,
    isStart: true,
    btn: [{
        icon: '../../images/back.png',
        text: '重新编辑'
      },
      {
        icon: '../../images/release.png',
        text: '发布影评'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.getMovieDetail(options.id)
      this.setData({
        id: options.id,
        c_type: options.c_type
      })
    }
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

  onInput(e) {
    this.setData({
      commentValue: e.detail.value.trim()
    })
  },

  onRecord() {
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options)
    this.setData({
      isStart: false
    })
  },

  stopRecord() {
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const {
        tempFilePath
      } = res
      this.setData({
        tempFilePath
      })
    })
    recorderManager.stop()
    this.setData({
      isStart: true
    })
  },

  palyAudio() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = this.data.tempFilePath
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: res => {
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: res => {
            let data = JSON.parse(res.data)
            console.log(data.data)
            if (!data.code) {
              this.setData({
                tempFilePath: data.data.imgUrl
              })
            }
          }
        })
      },
    })
  },

  ToReview() {
    let content = this.data.commentValue,
      tempFilePath = this.data.tempFilePath;
    if (!content && !tempFilePath) return
    if (this.data.c_type == 1) {
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: tempFilePath,
        name: 'file',
        success: res => {
          let data = JSON.parse(res.data)
          console.log(data.data)
          if (!data.code) {
            this.setData({
              tempFilePath: data.data.imgUrl
            })
          }
        }
      })
    }
    wx.setNavigationBarTitle({
      title: '影评预览',
    })
    this.setData({
      isReview: true
    })
  },

  ToItemBtn(e) {
    let idx = e.currentTarget.dataset.idx,
      c_type = this.data.c_type;
    if (idx) {
      let content = c_type == 1 ? this.data.tempFilePath : this.data.commentValue;
      wx.showLoading({
        title: '正在发表评论'
      })
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'PUT',
        data: {
          content,
          c_type,
          movie_id: this.data.id
        },
        success: result => {
          wx.hideLoading()
          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../commentList/commentList?id=' + this.data.id,
              })
            }, 1500)
          } else {
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      })
    } else {
      wx.setNavigationBarTitle({
        title: '编辑影评',
      })
      this.setData({
        isReview: false
      })
    }
  }

})