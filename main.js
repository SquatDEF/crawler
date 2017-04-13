// 依赖
const cp = require('child_process');

// 简化输出
function cl(String) {console.log(String);}

// 获取所有类目及其URL
var NodeGetNav = cp.exec('node ./shein/get-nav.js', (error, stdout, stderr) => {
    cl('子进程 NodeGetNav 开始');
    if (error) {
        cl(error.stack);
        cl('Error Code:' + error.code);
        cl('Signal Received:' + error.signal);
    }
    cl(stdout);
    cl(stderr);
});

NodeGetNav.on('exit', (code) => {
    cl('子进程 NodeGetNav 已退出，退出码：' + code);
});

// 获取商品信息
var PhantomGetProduct = cp.exec('phantomjs --config=config.json  ./shein/get-all-url.js', (error, stdout, stderr) => {
    cl('子进程 PhantomGetProduct 开始');
    if (error) {
        cl(error.stack);
        cl('Error Code:' + error.code);
        cl('Signal Received:' + error.signal);
    }
    cl(stdout);
    cl(stderr);
});

PhantomGetProduct.on('exit', (code) => {
    cl('子进程 PhantomGetProduct 已退出，退出码：' + code);
});


//               http://img.shein.com/images/shein.com/  201702/d0/14863507275481513646  .jpg
// http://img.shein.com/images/goods_img_bak/shein.com/  201702/d0/14863507275481513646  _thumbnail_405x552.jpg
// 
//               http://img.shein.com/images/shein.com/  201609/10/14745079595359386534  .jpg
// http://img.shein.com/images/goods_img_bak/shein.com/  201609/10/14745079595359386534  _thumbnail_405x552.jpg
// 
//               http://img.shein.com/images/shein.com/  201702/1f/14865167423894917497  .jpg
// http://img.shein.com/images/goods_img_bak/shein.com/  201702/1f/14865167423894917497  _thumbnail_405x552.jpg