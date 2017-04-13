// 依赖库
const http = require('http');
const url = require('url');
const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

// file path
var filePath = '.'

// nav list page
const targetUrl = 'http://www.shein.com/';

function GetNav() {
    superagent.get(targetUrl).end(function(err, res) {
        var navJSON = {Nav: []};
        
        // get nav  
        var $ = cheerio.load(res.text);
        var navWrap = $('ul.nav-wrap');
        var navList = navWrap.find('div.j-list');
        navList.each(function(index, element) {
            $(element).find('a').each(function(index_1, element_1) {
                var tmp = {};
                tmp.Name = $(element_1).text();
                tmp.URL = $(element_1).attr('href');
                if (tmp.URL.substring(0, 4) == 'http') {
                    navJSON.Nav.push(tmp);
                }
            });
        });

        // navJSON = JSON.stringify(navJSON);

        // writh in file
        fs.readdir(filePath + '/file', (err, files) => {
            if (err) {
                fs.mkdir(filePath + '/file', (err) => {
                    if (err) throw err;
                    WriteFile(navJSON);
                });
            } else {
                WriteFile(navJSON);
            }
        });
    });
}

// writh in file
function WriteFile(content, index) {
    var next, write, tempArray;
    var index = 0;
    next = function() {
        if (content.Nav.length > 0) {
            index++;
            write();
        }
    };
    write = function() {
        tempArray = {Nav: []};
        tempArray.Nav = content.Nav.splice(0, 15);
        tempArray = JSON.stringify(tempArray);
        fs.writeFile(filePath + '/file/nav_' + index + '.txt', tempArray, 'utf8', '0666', 'w', function(err, fd) {
            if (err) throw err;
        });
        next();
    };
    write();
}

// 输出简写
function cl(String) {
    console.log(String);
}

// 抛出方法
// exports.Start = GetNav;

// phantomjs
GetNav();