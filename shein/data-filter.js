// 依赖
const fs = require('fs');
const system = require('system');

// path
const filePath = './file/';
const allDataWritePath = './file/Data/all-data.txt';

// get all valid file path
var validFileList = function() {
    var fileList = fs.list(filePath);
    var tmpArr = [];
    var tmpTxtFileArr = [];
    for(var i = 0; i < fileList.length; i++) {
        if (fileList[i].indexOf('url') != -1) {
            tmpArr.push(fileList[i]);
        }
    }
    for(var j = 0; j < tmpArr.length; j++) {
        var tmpPath = filePath + tmpArr[j] + '/product/';
        if (fs.exists(tmpPath)) {
            var txtFileList = fs.list(tmpPath);
            for(var k = 0; k < txtFileList.length; k++) {
                if (txtFileList[k].indexOf('.txt') != -1 && txtFileList[k].indexOf('.error.txt') == -1) {
                    tmpTxtFileArr.push(tmpPath + txtFileList[k]);
                }
            }
        }
    }
    return tmpTxtFileArr;
}();

// get All data to the file
var validFileListLength = validFileList.length;
var allData = [];
for(var v = 0; v < validFileListLength; v++) {
    var tmpReadData = JSON.parse(fs.open(validFileList[v], 'r').read());
    if (tmpReadData.goodsList.length > 0) {
        allData = allData.concat(tmpReadData.goodsList);
    }
}
var allDataLength = allData.length;
// Filtering data
function validAllData(array) {
    var filter, next, end, tmpArray = [];
    filter = function() {
        var data = array.shift();
        var notExisted = true;
        for(var i = 0; i < array.length; i++) {
            if (data.Sku == array[i].Sku) {
                notExisted = false;
                break;
            }
        }
        if (notExisted) {
            tmpArray.push(data);
        }
        next();
    };
    next = function() {
        if (array.length > 0) {
            filter();
        }else {
            end();
        }
    };
    end = function() {
        // write the file
        console.log('allData length:', allDataLength);
        console.log('validAllData length:', tmpArray.length);
        console.log('Invalid quantity:', allDataLength - tmpArray.length);
        tmpArray = {goodsList: tmpArray};
        fs.write(allDataWritePath, JSON.stringify(tmpArray), 'w');
        if (fs.exists(allDataWritePath)) {
            console.log('get all data success.');
        }else {
            console.log('defeated.');
        }
        phantom.exit(0);
    };
    filter();
};
validAllData(allData);

