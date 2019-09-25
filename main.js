'use strict';

let http = require('http');
require('./public');
require('./javaScript');
let DataManager = require('./dataManager').create();
/**
 * @brief:
 *
 * @author:   lcy
 * @date:     2019/9/19 20:55
 */

let port = 50111;

let Main = function () {
    global.Public(this, __filename, {recursion: true, children: true});
}

module.exports = Main;
let pro = Main.prototype;

pro.start = function () {
    http.createServer(function (request, response) {
    }).listen(port);
    console.log("http Server 启动完成 visit http://127.0.0.1:%s  ... ...", port);
    console.log("hotUpdate:%j", global.javaScript.hotUpdate);
    DataManager.load();
}

let main = new Main();
main.start();