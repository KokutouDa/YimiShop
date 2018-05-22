import {Base} from "../../utils/base";

class Ucenter extends Base {
    constructor() {
        super();
    }

    getUserInfo(callback) {
      wx.login({
        success: function(res) {
          wx.getUserInfo({
            success: function(res) {
              callback(res.userInfo);
            }
          })
        }
      })
    }
}

export { Ucenter };