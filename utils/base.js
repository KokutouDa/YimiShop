import {Config} from '../utils/config.js';

class Base {

  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  request(params) {
    if(!params.type) {
      params.type = 'GET';
    }
    wx.request({
      url: this.baseRequestUrl + params.url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        params.sCallback&&params.sCallback(res.data);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }

  getDataSet(event, key) {
    var data = event.currentTarget.dataset[key];
    return data;
  }
}

export { Base };