// 依赖库
var http = require('http');
var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

// test
// var temp = null;
// var tempURL = 'https://www.17track.net/zh-cn/externalcall?resultDetailsH=156&nums=JK501567581GB&fc=0';

// 所有Categorie页面
var allCategoriePage = 'http://www.ebay.com/sch/allcategories/all-categories/?_rdc=1';

// 启动方法
function Start() {
    cl('启动eBay爬虫工具...');
    cl('开始获取全部类目...');
    GetAllCategorie();
}

// 获取所有Categories
function GetAllCategorie() {
    cl('开始获取类目页面资源...');
    console.time('获取类目用时');
    superagent.get(allCategoriePage).end(function(err, res) {
        var categorieArray = []; // 类目集合
        var categorieJSON = {}; // 类目集合
        var _$ = cheerio.load(res.text);
        cl('获取资源完成，开始分割类目页HTML...');
        var gcmaString = _$('.gcma').html();
        var segmentationStandard = '<div class="ps" style="height:10px;">&#xA0;</div>';
        var gcmaArray = gcmaString.split(segmentationStandard);
        gcmaArray.splice(0, 1); // 删除第一个空值
        gcmaArray.forEach(function(value, index, array) {
            var tmpJSON = {
                Letter: _$(value).find('.lgna').text()
            };
            value = value.split('<div class="ps">&#xA0;</div>');
            tmpJSON.Categorie = [];
            value.forEach(function(val, ind, arr) {
                val = '<div id="tmp">' + val + '</div>';
                tmpJSON.Categorie.push({
                    Title: _$(val).find('p>a').text(),
                    URL: []
                });
                _$(val).find('li').each(function(index_li, element) {
                    tmpJSON.Categorie[ind].URL.push({
                        Name: _$(element).find('a').text(),
                        URL: _$(element).find('a').attr('href')
                    });
                });
            });
            if (index == array.length - 1) { tmpJSON.Letter = 'Others'; }
            categorieArray.push(tmpJSON);
        });
        categorieJSON.Name = 'eBay商品类目';
        categorieJSON.DataList = categorieArray;
        categorieJSON = JSON.stringify(categorieJSON);
        cl('类目获取完毕，开始写入类目文件...');
        fs.readdir('./file', (err, files) => {
            if (err) {
                cl('找不到目录');
                fs.mkdir('./file', (err) => {
                    if (err) throw err;
                    cl('创建目录');
                    WriteFile();
                });
            } else {
                WriteFile();
            }
        });
        // 写入文件
        function WriteFile() {
            fs.writeFile('./file/AllCategorie.txt', categorieJSON, 'utf8', '0666', 'w', function(err, fd) {
                if (err) throw err;
                cl('文件写入完成!');
                console.timeEnd('获取类目用时');
            }); 
        }
    });
}

// 输出缩写
function cl(String) {
    // console.log(String);
}

// 导出方法
exports.Start = Start;

// 用于phantomjs调用
Start();