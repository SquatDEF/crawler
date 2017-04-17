/**
 * 使用方法
 * phantomjs --config=config.json get-goods.js <folder number> <file number>
 */
// 依赖
const fs = require('fs');
const system = require('system');

var Start;
var folderNum = system.args[1];
var fileName = system.args[2];
if (fileName.indexOf('.txt') == -1) {
    fileName += '.txt';
}

// path
const readFile = './file/url_' + folderNum + '/' + fileName;
const productDataFile = './file/url_' + folderNum + '/product/' + fileName;
const errorFile = './file/url_' + folderNum + '/product/' + fileName + '.error.txt';

// 读取文件
if (fs.exists(readFile)) {
    var readData = JSON.parse(fs.open(readFile, 'r').read());
}else {
    console.log('this path inexisttence.');
    phantom.exit(0);
}

// 运行
Start = function(urlData, FON, FIN) {
    var next, run, end, webpage, page, index, _export, AllGoods, errorURL;
    errorURL = {URL:[]};
    AllGoods = {goodsList:[]};
    webpage = require('webpage');
    index = 0;
    next = function(status, url, callbackData) {
        status && page.close();
        index++;
        _export(status, url, callbackData);
        run();
    };
    run = function() {
        if (urlData.length > 0) {
            var url = urlData.shift();
            if (url.indexOf('.php') != -1 || url.indexOf('.js') != -1 || url.indexOf('.asp') != -1) {
                errorURL.URL.push(url);
                next(false, url, 'it is not a valid URL.');
                return false;
            }else if (url.indexOf('?') != -1) {
                urlL = url.split('?')[0];
            }
            page = webpage.create();
            // page option
            page.settings = {
                'userAgent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                'javascriptEnabled': true,
                'loadImages': false,
                'resourceTimeout': 60000
            };
            console.log('Start!', 'Number: ' + index + ',', 'URL: ' + url);
            page.open(url, function(status) {
                if (status == 'success') {
                    console.log('Success!');
                    var thisPageGoods = page.evaluate(function() {
                        var returnData = {goodsList:[]};
                        $('#productsContent1_goods>.row>.prd-ct-gd-item').each(function(index, element) {
                            returnData.goodsList[index] = {};
                            // sku
                            returnData.goodsList[index].Sku = $(element).data('sku');
                            // title
                            returnData.goodsList[index].Title = $(element).find('.product>.description>a').attr('title');
                            // img url
                            var tmpImg = $(element).find('.product>.image>a>img').attr('src');
                            var _1 = 'http://img.shein.com/images/shein.com/';
                            var _2 = '.jpg';
                            tmpImg = tmpImg.replace(/(http:\/\/img\.shein\.com\/images\/goods_img_bak\/shein\.com\/)(.+)(_thumbnail_405x552\.jpg)/g, _1 + '$2' + _2);
                            returnData.goodsList[index].ImgURL = tmpImg;
                            // attribute
                            var tmpAttr = '';
                            $(element).find('.product>.footer>.pj-new-con>.comment-attr>.seo-attr>div').each(function(_ind, _ele) {
                                switch($(_ele).attr('class')) {
                                    case 'seo-attr-name' :
                                        tmpAttr += $(_ele).text();
                                        break;
                                    case 'seo-attr-value' :
                                        tmpAttr += ($(_ele).text() + '\n');
                                        break;
                                }
                            });
                            // price
                            returnData.goodsList[index].Price = $(element).find('.product').attr('data-ga-price');
                            // source url
                            var tmpSURL = $(element).find('.product>.description>a').attr('href');
                            if (tmpSURL.indexOf('www') == -1) {
                                tmpSURL = 'http://www.shein.com' + tmpSURL;
                            }
                            returnData.goodsList[index].SourceURL = tmpSURL;

                            tmpAttr = tmpAttr.substr(0, tmpAttr.length - 1);
                            returnData.goodsList[index].Attr = tmpAttr;
                        });
                        return returnData;
                    });
                    AllGoods.goodsList = AllGoods.goodsList.concat(thisPageGoods.goodsList);
                    next(status, url, thisPageGoods);
                } else {
                    next(status, url, 'can\'t connection this path.');
                }
            });
            // Time out
            page.onResourceTimeout = function(request) {
                errorURL.URL.push(request.url);
                next(status, request.url, 'Time out.');
            };
        } else {
            end();
        }
    };
    _export = function(status, url, callbackData) {
        if (status !== 'success') {
            console.log('Unable to connection: ' + url);
            console.log('error: ' + callbackData);
        } else {
            console.log('Get product quantity: ' + callbackData.goodsList.length);
        }
    };
    end = function() {
        console.log('get goods quantity:', AllGoods.goodsList.length);
        console.log('error quantity:', errorURL.URL.length);
        fs.write(productDataFile, JSON.stringify(AllGoods), 'w');
        if (errorURL.URL != 0) {
            fs.write(errorFile, JSON.stringify(errorURL), 'w');
        }else if(fs.exists(errorFile)) {
            fs.remove(errorFile);
        }
        console.log('End!');
        phantom.exit();
    };
    run();
};
Start(readData.URL, folderNum, fileName);
