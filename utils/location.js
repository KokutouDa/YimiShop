import {Base} from './base.js'

class Location extends Base {
  constructor() {
    super();
  }

  //获取指定id的门店位置
  getLocation(id, callback) {
    var params = {
      url: "location/" + id,
      type: "GET",
      sCallback(data) {
        callback && callback(data)
      }
    };
    this.request(params)
  }

  /**
   * la2 float 用户位置 经度
   * lo2 float 用户位置 纬度
   */
  getDistance(la2, lo2, callback) {
    var that = this;
    wx.getLocation({
      success: function(res) {
        var la1 = res.latitude;
        var lo1 = res.longitude;
        var distance = that.calDistance(la1, lo1, la2, lo2);
        callback && callback(distance);
      },
    })
  }

  calDistance (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + 
    Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    return s
  }
}

export { Location };