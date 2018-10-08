/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://qy0afcum.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    // 拉取用户信息
    user: `${host}/weapp/user`,

    // 获取随机一部热门电影
    hotMovie: `${host}/weapp/movie/`,

    // 获取热门电影列表
    movieList: `${host}/weapp/movie`,

    // 获取热门电影详情
    movieDetail: `${host}/weapp/movie`,

    // 添加热门电影评论
    addComment: `${host}/weapp/comment`,

    // 获取热门电影评论列表
    commentList: `${host}/weapp/comment`,

    // 获取热门电影评论详情
    commentDetail: `${host}/weapp/comment`,

    // 获取我的电影评论列表
    releaseList: `${host}/weapp/release`,

    // 收藏热门电影评论
    addCollection: `${host}/weapp/collect`,

    // 获取收藏电影评论列表
    collectionList: `${host}/weapp/collect`,

  }
};

module.exports = config;