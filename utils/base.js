import { Config } from '../utils/config.js';
import { Token } from "../utils/token.js";

class Base {

  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  //noRefetch 防止重复的未授权重试机制
  request(params, noRefetch) {
    var that = this;
    if (!params.type) {
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
      success: function (res) {
        var statusCode = res.statusCode.toString();
        var firstChar = statusCode.charAt(0);
        if (firstChar == 2) {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (statusCode == '401' && !noRefetch) {
            that.refetchToken(params);
          }
          if (noRefetch) {
            eCallback && eCallback(res);
          }
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }

  refetchToken(params) {
    var token = new Token();
    var noRefetch = true;
    token.getTokenFromServer(() => {
      this.request(params, noRefetch);
    });
  }

  getDataSet(event, key) {
    var data = event.currentTarget.dataset[key];
    return data;
  }

  isEmptyJson(json) {
    for (var i in json) {
      return false;
    }
    return true;
  }
}

export { Base };