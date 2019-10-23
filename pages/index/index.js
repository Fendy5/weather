// 加载提示

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo   : {},
    remind: "加载中",
    // 地址
    // 城市
    city: '',

    street:'',
    // 实时数据
    real_time  : {},
    // 七天天气
    list : [],

    forecasts:[],
    now:'',
    lat:'',
    lon:'',
    lifestyle:[]

  },
 


  // 加载事件
  onLoad: function () {
    var that = this;
    // 获取今天是周几
    var d = new Date();
    // 关闭加载中的提示框
    wx.hideLoading();
    // 获取地理位置
    wx.getLocation({
      type: 'gcj02',  // 坐标类型
      success: function (res) {
        // 	纬度，浮点数，范围为-90~90，负数表示南纬
        var lat = res.latitude;
        // 经度，浮点数，范围为-180~180，负数表示西经
        var lon = res.longitude;
        // 速度，浮点数，单位m/s
        var speed = res.speed;
        // 位置的精确度
        var accuracy = res.accuracy;
          that.setData({
            lat:lat,
            lon:lon
          })
        // 根据经纬度获取城市
        that.getNameByLocation(lat, lon);
        // 获取实时状态
        that.now(lat, lon);
        // 根据经纬度获取七天城市天气
        that.getWeatherByLocation(lat, lon);
        that.getforecast(lat,lon);
        that.lifestyle(lat,lon);
      },
      fail: function (res) {
        console.log(res);
        that.boxDelayClose(res.errMsg);
      }
    })
  },

  onReady: function () {

  },
  /**
   * 获取实时的状况
   */
  now: function (lat, lon) {
    var that = this;
    wx.request({
      url: "https://laf.fendy5.cn/laf/weather/now",
      data:{
        lat:lat,
        lon:lon
      },
      success: function (res) {
        console.log("now")
        console.log(res)
        that.setData({
            now:res.data.now
        })
      }
       
  })
  },

  lifestyle: function (lat, lon){
    var that = this;
    wx.request({
      url: "https://laf.fendy5.cn/laf/weather/lifestyle",
      data: {
        lat: lat,
        lon: lon
      },
      success: function (res) {
        console.log("lifestyle:")
        that.setData({
          lifestyle: res.data
        })
        console.log(res)
      }
    })
  },


  getforecast:function(lat,lon){
    var that=this
    wx.request({
      url: 'https://laf.fendy5.cn/laf/weather/forecast',
      data:{
      lat:lat,
      lon:lon
      },
      success:function(res){

      that.setData({
        forecasts: res.data
      })
      if(res.statusCode==200){
        setTimeout(function () {
          that.setData({
            remind: ''
          });
        }, 2000);
      }
      }
    })
  },
  /**
   * 获取地理位置
   */
  getNameByLocation: function (lat, lon) {
    var that = this;
    // 请求
    wx.request({
      url: 'https://laf.fendy5.cn/laf/weather/getname',
      data:{
        lat:lat,
        lon:lon
      },
      success: function (res) {
        var data = res.data.result;
        console.log("data.addressComponent:")
        console.log(data.addressComponent)
        that.setData({
          city: data.addressComponent.city,
          street: data.addressComponent.street,
        });
      },
      fail: function (res) {
        console.log(res);
        that.boxDelayClose(res.errMsg);
      }
    })
  }, // 获取地理位置 结束


  /**
   * 通过地理位置获取七天天气
   */
  getWeatherByLocation: function (lat, lon) {
    var that = this;
    var url = 'https://laf.fendy5.cn/laf/weather/hourly';
    // 请求
    wx.request({
      url: url,
      data:{
        lat:lat,
        lon:lon
      },
      success: function (res) {
        var data = res.data.HeWeather6;
        // 设置数据
        that.setData({
 
          list: res.data
        });
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }, // getWeatherByLocation 结束


  /**
   * 改变地理位置
   */
  changeMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log("change")
        console.log(res);
        // 根据经纬度获取城市
        that.setData({
          street:res.name,
          city: res.address
        })

        // 获取实时状态
        that.now(res.latitude, res.longitude);
        // 根据经纬度获取七天城市天气
        that.getWeatherByLocation(res.latitude, res.longitude);
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '授权失败！',
          image: '../../images/fail.png'
        })
      }
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    // 根据经纬度获取城市
      var lat=this.data.lat,lon=this.data.lon
    this.getNameByLocation(lat, lon);
    // 获取实时状态
    this.now(lat, lon);
    // 根据经纬度获取七天城市天气
    this.getWeatherByLocation(lat, lon);
    // 停止刷新
    // wx.showToast({
    //   title: '刷新成功！',
    //   image: '../../images/success.png'
    // })
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh();

  },



  /**
   * 弹出盒子延时关闭
   */
  boxDelayClose: function(msg){
    wx.showLoading({
      title: msg,
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  }

})
