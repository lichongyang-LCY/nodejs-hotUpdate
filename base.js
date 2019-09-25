'use strict';
let fs = require('fs');

/**
 * @brief:
 *
 * @author:   lcy
 * @date:     2019/9/19 20:54
 */

let Base = function (filePath, opts) {
    opts = opts || {self: true, recursion: false, children: false};
    if (!!filePath) {
        _watchFile(filePath, opts);
    }
}
module.exports = Base;

let _watchFile = function (filePath, opts) {
    let module = require.cache[filePath];
    if (opts.self) {
        _watch(filePath);
    }
    if (opts.children) {
        for (let id in module.children) {
            let children = module.children[id];
            if (!!children) {
                let curFilePath = children.filename;
                if (__filename === curFilePath)
                    continue;

                _watch(curFilePath);

                if (opts.recursion)
                    _watchFile(curFilePath, opts);
            }
        }
    }
};

let _watch = function (curFilePath) {
    // 这里用watch 用于监听目录下文件替换 （注意:修改文件不会生效） 建议使用watch
    // 如果想修改文件内容来热更新 可以将fs.watch 改成fs.watchFile
    // 然后注释掉 if ('change' !== eventType) return; 即可
    fs.watch(curFilePath, function (eventType, filename) {
        console.warn(" eventType[%j] - - - fileName[%j]", eventType, filename);
        if ('change' !== eventType)
            return;
        console.log("reload file[%s] start", filename);
        let parentName = _cleanCache(require.resolve(curFilePath));
        let type = filename.split('.')[1];
        let name = filename.split('.')[0];
        reload(name, curFilePath, type, parentName);
        console.log("reload file[%s] end", filename);
    });
}

let _cleanCache = function (modulePath) {
    let module = require.cache[modulePath];
    let parentName = null;
    if(!module)
        return null;
    // remove reference in module.parent
    if (module.parent) {
        parentName = module.parent.filename;
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    require.cache[modulePath] = null;
    return parentName;
}

let reload = function (fileName, filePath, type, parentName) {
    switch (type) {
        case "js" :
            if (!!global[fileName]) {
                global[fileName] = require(filePath);
            }
            break;
        case "json":
            loadData(filePath, parentName);
            break;
    }
}

let loadData = function (filePath, parentName) {
    if (!!parentName) {
        let object = require(parentName).create();
        object.reload(filePath);
    } else {
        console.log("parent  undefined");
    }
}