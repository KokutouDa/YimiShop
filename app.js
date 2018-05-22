import { Token } from "/utils/token.js"

App({

  /**
   * 当小程序初始化完成时
   */
  onLaunch: function () {
    var token = new Token();
    token.verify();
  },
})
