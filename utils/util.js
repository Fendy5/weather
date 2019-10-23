function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

/**
   * 根据地理位置获取城市名字
   */
function getCityInfo(lat, lon) {
  var that = this;
  var url = 'https://api.map.baidu.com/geocoder/v2/';
  var data = {
    ak: 'ZE4ORURwbsleaBVyeh1MyvGD7sZm9QGg',
    output: 'json',
    location: lat + ',' + lon
  };
  wx.request({
    url: url,
    data: data,
    success: function (res) {
      var res = res.data.result
      // 城市
      var city = res.addressComponent.city;
      // 区域
      var district = res.addressComponent.district;
      // 街道
      var street = res.addressComponent.street;
      city = city.substr(0, (city.length - 1));
      console.log(city);
      console.log(res);

      // 获取天气接口
      that.getWeather(city);
    }
  });
}