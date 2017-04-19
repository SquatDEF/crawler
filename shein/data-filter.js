/**
 * 使用方法
 * 把文本数据存入数据库
 * node data-filter.js 0 1
 */

// 依赖
const fs = require('fs');
const request = require('request');
const mysql = require('mysql');
const config = require('./config.js');
const out = process.stdout;

// post file
var postFolder = process.argv[2];
var postFile = process.argv[3];

// path
if (!(postFile && postFolder)) {
    console.log('need foler number and file number');
} else {
    var filePath = './file/url_' + postFolder + '/product/' + postFile + '.txt';
    fs.exists(filePath, function(ex) {
        if (ex) {
            var readData = JSON.parse(fs.readFileSync(filePath).toString());
            const connection = mysql.createConnection(config.mysqlConfig);
            connection.connect();
            var index = 0;
            var complete = 0;
            var duplicate = 0;
            const _d = readData.goodsList;
            const _dL = _d.length;
            out.write('quantity: ' + _dL);
            function PostDataToLocalhost() {
                if (index < _dL) {
                    var sql = 'insert into goods_data(id, sku, title, attr, price, img, source) value(0, ?, ?, ?, ?, ?, ?)';
                    var sqlParam = [_d[index].Sku, _d[index].Title, (_d[index].Attr || 'nothing'), _d[index].Price, _d[index].ImgURL, _d[index].SourceURL];
                    connection.query(sql, sqlParam, function(err, result) {
                        out.clearLine(1);
                        out.cursorTo(0, 1);
                        index++;
                        if (err) {
                            duplicate++;
                            out.write('Timer: ' + index + '\nComplete: ' + complete + '\nDuplicate: ' + duplicate + '\nError Message: ' + err.message);
                        }else {
                            complete++;
                            out.write('Timer: ' + index + '\nComplete: ' + complete + '\nDuplicate: ' + duplicate + '\nInsert ID:' + result.insertId);
                        }
                        setTimeout(PostDataToLocalhost, 10);
                    });
                }else {
                    connection.end();
                }
            }
            PostDataToLocalhost();
        }else {
            console.log('this path inexisttence.');
        }
    });
}


