/**
 * 使用方法
 * phantomjs main.js <function Number> <folder number> <file number>
 */
// 依赖
const spawn = require('child_process').spawn;
const fs = require('fs');
const system = require('system');

// 读取传入第一位参数，判断要执行什么方法
const functionNum = system.args[1];
console.log(functionNum);
switch(functionNum) {   
    case '1':
        console.log('Get Nav.');
        GetNav();
        break;
    case '2':
        console.log('Get All Url.');
        GetAllUrl();
        break;
    case '3':
        console.log('Get Goods.');
        GetGoods();
        break;
}

/**
 * 获取全部Nav
 * phantomjs main.js 1
 */
function GetNav() {
    var child = spawn('node', ['get-nav.js']);
    child.stdout.on('data', function(data) {
        var outShow = JSON.stringify(data);
        outShow = outShow.replace(/\\r\\n/g, '');
        console.log('OUT:', outShow);
    });
    child.stderr.on('data', function(data) {
        var errShow = JSON.stringify(data);
        errShow = errShow.replace(/\\r\\n/g, '');
        console.log('ERR:', errShow);
    });
    child.on('exit', function(code) {
        console.log('EXIT:', code);
        phantom.exit(0);
    });
}

/**
 * 获取所有分页的url
 * phantomjs main.js 2 
 */
function GetAllUrl() {
    var run, next, end;
    // 读取文件列表
    var fileList = fs.list('./file/');
    var txtList = function() {
        var tmpFile = [];
        var tmpLength = fileList.length
        for(var i = 0; i < tmpLength; i++) {
            if (fileList[i].indexOf('.txt') != -1) {
                tmpFile.push(fileList[i]);
            }
        }
        return tmpFile;
    }();
    run = function(NavFileNum) {
        var child = spawn('phantomjs', ['--config=config.json', 'get-all-url.js', NavFileNum]);
        child.stdout.on('data', function(data) {
            var outShow = JSON.stringify(data);
            outShow = outShow.replace(/\\r\\n/g, '');
            console.log('OUT:', outShow);
        });
        child.stderr.on('data', function(data) {
            var errShow = JSON.stringify(data);
            errShow = errShow.replace(/\\r\\n/g, '');
            console.log('ERR:', errShow);
        });
        child.on('exit', function(code) {
            console.log('EXIT:', code);
            next();
        });
    };

    next = function() {
        if (txtList.length > 0) {
            var navNum = txtList.shift().split('.')[0].split('_')[1];
            console.log('------------- ' + navNum + ' -------------');
            run(navNum);
        }else {
            phantom.exit(0);
        }
    };
    next();
}

/**
 * 获取指定url文件夹内的所有商品
 * phantomjs main.js 3 <url folder number>
 */
 function GetGoods() {
    var RunChildProcessGetGoods, NextGetGoods;

    // 读取传入参数
    const folderNum = system.args[2];

    // path
    const folderPath = './file/url_' + folderNum + '/';

    // 读取文件列表
    var fileList = fs.list(folderPath);
    var txtList = function() {
        var tmpFile = [];
        var tmpLength = fileList.length;
        for(var i = 0; i < tmpLength; i++) {
            if (fileList[i].indexOf('.txt') != -1) {
                tmpFile.push(fileList[i]);
            }
        }
        return tmpFile;
    }();

    RunChildProcessGetGoods = function(fileName) {
        var child = spawn('phantomjs', ['--config=config.json', 'get-goods.js', folderNum, fileName]);
        child.stdout.on('data', function(data) {
            var outShow = JSON.stringify(data);
            outShow = outShow.replace(/\\r\\n/g, '');
            console.log('OUT:', outShow);
        });
        child.stderr.on('data', function(data) {
            var errShow = JSON.stringify(data);
            errShow = errShow.replace(/\\r\\n/g, '');
            console.log('ERR:', errShow);
        });
        child.on('exit', function(code) {
            console.log('EXIT:', code);
            NextGetGoods();
        });
    }

    NextGetGoods = function() {
        if (txtList.length > 0) {
            var fileName = txtList.shift();
            console.log('------------ ' + fileName + ' -------------');
            RunChildProcessGetGoods(fileName);
        }else {
            phantom.exit(1);
        }
    }
    NextGetGoods();
}
