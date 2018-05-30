 import { Base } from './base.js';

 class Category extends Base {
   constructor() {
     super();
     this._typeDelivery = "delivery";
     this._typeTakeOut = "take-out";

     this._storageKeyName = "type";

     this._takeOut = "take_out";
     this._deliveryFar = "delivery_far";
     this._deliveryNear = "delivery_near";
   }

   getCategory(callback) {
     var params = {
       url: "category",
       sCallback(data) {
         callback && callback(data);
       }
     }
     this.request(params)
   }

   getByType(type, callback) {
     var params = {
       url: "category/" + type,
       sCallback(data) {
         callback && callback(data);
       } 
     }
     this.request(params);
   }

   setStorage(type) {
    wx.setStorageSync(this._storageKeyName, type);
   }

   getStorage() {
     return wx.getStorageSync(this._storageKeyName);
   }
 }

 export { Category };