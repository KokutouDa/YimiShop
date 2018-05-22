import { Config } from '../utils/config.js';

class Token {
  constructor() {
    this.baseUrl = Config.restUrl;
    this.tokenUrl = this.baseUrl + "/user/token";
    this.verifyUrl = this.baseUrl + "/user/verify"
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this.verifyFromServer(token);
    }
  }

  verifyFromServer(token) {
    var that = this;
    wx.request({
      url: this.verifyUrl,
      method: 'POST',
      data: {
        'token': token
      },
      success: function(res) {
        if (!res.data.valid) {
          that.getTokenFromServer();
        }
      }
    })
  }

  getTokenFromServer(callback) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          wx.request({
            url: that.baseUrl + 'user/token',
            method: 'POST',
            data: {
              "code": code
            },
            success: function (res) {
              wx.setStorageSync("token", res.data.token);
              callback&&callback();
            }
          })
        }
      }
    })
  }
};

export {Token};