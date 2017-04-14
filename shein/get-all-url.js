/**
 * 使用方法
 * phantomjs --config=config.json get-all-url.js <nav file number>
 */

// 依赖
const fs = require('fs');
const system = require('system');
const thisPath = '.'

var GetUrlsToTxt;
var allURL = {URL: []};
var errorURL = {URL: []};
var fileNum = system.args[1];

// file path
var readFilePath = thisPath + '/file/nav_' + fileNum + '.txt';
var weFilePath = thisPath + '/file/url_' + fileNum + '/';

// open nav.txt
var readNav = fs.open(readFilePath, 'r');
const navData = JSON.parse(readNav.read());
readNav.close();

GetUrlsToTxt = function(Urls, callbackPerUrl, callbackFinal) {
    var next, page, retrieve, webpage, indexURL;
    webpage = require('webpage');
    indexURL = 1;
    next = function(status, url, urlArray) {
        page.close();
        indexURL++;
        callbackPerUrl(status, url, urlArray.length);
        retrieve();
    }

    retrieve = function() {
        var url;
        if (Urls.length > 0) {
            url = Urls.shift();
            if (url.URL.indexOf('?') != -1) {
                url.URL = url.URL.split('?')[0];
            }
            page = webpage.create();
            // page option
            page.settings = {
                'userAgent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                'javascriptEnabled': true,
                'loadImages': false,
                'resourceTimeout': 60000
            };

            console.log('------------ Number ' + indexURL + '------------');
            console.log('Name: ' + url.Name, 'URL: ' + url.URL);
            page.open(url.URL, function(status) {
                if (status === 'success') {
                    // window.setTimeout(function() {
                        console.log('Success.');
                        // page.render('./file/test_' + indexURL + '.png');
                        var thisNavNameUrlArray = page.evaluate(function() {
                            var tmpUrlArray = [];
                            tmpUrlArray[0] = window.location.href;
                            $('#box-pagelist>.pageNav>.pagecurrents2>a').each(function(index, element) {
                                if (!($(element).hasClass('she-current')) && !($(element).hasClass('she-active'))) {
                                    var tmpHref = $(element).attr('href');
                                    if (tmpHref.indexOf('http') == -1) {
                                        tmpHref = 'http://www.shein.com' + tmpHref;
                                    }
                                    tmpUrlArray.push(tmpHref);
                                }
                            });
                            return tmpUrlArray;
                        });
                        allURL.URL = allURL.URL.concat(thisNavNameUrlArray);
                        next(status, JSON.stringify(url), thisNavNameUrlArray);
                    // }, 500);
                } else {
                    next(status, JSON.stringify(url), 'cant connection this path.');
                }
            });
            // Time out
            page.onResourceTimeout = function(request) {
                console.log('Time out, perform next!');
                errorURL.URL.push(request.url);
                next(status, request.url, 'can\'t connection this path.');
            };
        } else {
            callbackFinal();
        }
    };
    retrieve();
};

GetUrlsToTxt(navData.Nav, function(status, url, urlArray) {
    if (status !== 'success') {
        console.log('Unable to connection:', url);
    } else {
        console.log('Get url quantity:', urlArray);
    }
}, function() {
    var _next, _write, _end, allTempArray, errTempArray;
    var index = 0;
    _next = function() {
        if (allURL.URL.length > 0) {
            index++;
            _write();
        } else {
            _end();
        }
    };
    _write = function() {
        allTempArray = {URL: []};
        errTempArray = {URL: []};
        allTempArray.URL = allURL.URL.splice(0, 15);
        fs.write(weFilePath + index + '.txt', JSON.stringify(allTempArray), 'w');
        if (errorURL.URL.length > 0) {
            errTempArray.URL = errorURL.URL.splice(0, 15);
            fs.write(weFilePath + index + '.txt', JSON.stringify(errTempArray), 'w');
        }
        _next();
    };
    _end = function() {
        console.log('End.');
        phantom.exit();
    };
    _write();
});

