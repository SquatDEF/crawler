/**
 * 使用方法
 * node post-data.js <post data quantity>
 */
// 依赖
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const mysql = require('mysql');
const config = require('./config');
const out = process.stdout;

// post quantity
var postQuantity = process.argv[2];

// 常量
const dev_key = config.postConfig.dev_key;
const secret = config.postConfig.secret;

// parameter
var indexNum = 0;
var _d, postLastID;
var complete = 0;

// connection the server
const connection = mysql.createConnection(config.mysqlConfig);
connection.connect();

const sql = 'SELECT * FROM goods_data LIMIT ' + postQuantity;
const delsql = 'DELETE FROM goods_data LIMIT ' + postQuantity;
connection.query(sql, function(err, result) {
    if (err) {
        console.log(err.message);
    }else {
        _d = result;
        post();
    }
});

function callback(error, response, data) {
    out.clearLine(0);
    out.cursorTo(0, 0);
    if (!error && response.statusCode == 200) {
        complete += data.products.length;
        postLastID = data.products[data.products.length - 1].id;
        out.write('Ack:' + data.ack + '\nComplete: ' + complete + '\nPost Last ID: ' + postLastID);
        if (data.error) {
            duplicate++;
            out.write('Error: ' + data.error);
        }
    } else {
        out.write('Error: ' + error + '\nstatus code: ' + response.statusCode);
    }
    if (postQuantity > 0) {
        indexNum++;
        setTimeout(post, 2000);
    }else {
        connection.query(delsql, function(err, result) {
            if (err) {
                console.log(err.message);
            }else {
                connection.end();
            }
        });
    }
}

var post = function() {
    postQuantity -= 50;
    var date = Math.ceil(new Date().getTime() / 1000);
    // MD5
    var hash = crypto.createHash('md5');
    var sign = hash.update(dev_key + secret + date).digest('hex');
    // 数据格式
    var postData = {
        dev_key   : dev_key,
        sign      : sign,
        timestamp : date,
        products  : [],
        source_url: ''
    };
    var options = {
        headers: {"Connection": "close"},
        url    : config.postConfig.post_url,
        method : 'POST',
        json   : true,
        body   : postData
    };
    var goods_50 = _d.splice(0, 50);
    goods_50.forEach(function(value, index, array) {
        var tmpJSON = {};
        tmpJSON.title = value.title;
        tmpJSON.details = value.attr || 'nothing';
        tmpJSON.size = {length: 0, width: 0, height: 0};
        tmpJSON.weight = 1;
        tmpJSON.skus = [{title: value.title, pricing: value.price, currency: 'USD'}];
        tmpJSON.pictures = [value.img];
        tmpJSON.source_url = value.source;
        postData.products.push(tmpJSON);
    });

    request(options, callback);
};
