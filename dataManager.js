'use strict';
let test = require('./test');

/**
 * @brief:
 *
 * @author:   lcy
 * @date:     2019/9/19 20:57
 */

let DataManager = function () {
    this.dataMap = {};
};
let pro = DataManager.prototype;

//单例
var instance = null;
exports.create = function () {
    if (instance == null) {
        instance = new DataManager();
    }
    return instance;
};

pro.load = function (fileData) {
    fileData = fileData || test;
    for (var data of fileData) {
        if (!!data) {
            this.dataMap[data.a] = data;
        }
    }
    console.log("load - dataMap: %j", this.dataMap);
}

pro.reload = function (fileName) {
    console.warn("reload data -> %s", __filename);
    this.dataMap = null;
    this.dataMap = {};
    this.load(require(fileName));
};