// 依赖
var page = require('webpage').create();
var fs = require('fs');

// 输出简写
function cl(String) {console.log(String)};

// 打开类目文件，获取所有类目数据
var readCategorie = fs.open('./file/AllCategorie.txt', 'r');
var categorieData = JSON.parse(readCategorie.read());
// 关闭类目文件
readCategorie.close();

cl('测试获取 ' + categorieData.DataList[2].Categorie[0].URL[0].Name + ' 的数据.');

// 页面渲染配置
page.settings = {
    javascriptEnabled: true, // 允许运行js
    loadImages: false        // 禁止加载图片，提升渲染速度
};
page.open(categorieData.DataList[2].Categorie[0].URL[0].URL, function(status) {
    if (status !== 'success') {
        cl('FAIL to load the address');
    } else {
        page.render('./file/' + categorieData.DataList[2].Categorie[0].URL[0].Name + '.png');
        cl('获取资源完成');
        page.includeJs('./node_modules/jquery/dist/jquery.min.js', function() {
            var productData = page.evaluate(function() {
                var tmpArray = [];
                var tmpJSON = {};
                $('#ListViewInner>li').each(function(index, element) {
                    var ts = $(element);
                    var img = ts.find('img');
                    // 商品名
                    tmpJSON.Name = ts.find('h3>a').text();
                    // 价格
                    tmpJSON.Price = ts.find('ul.lvprices>li.lvprice>span').text();
                    // 写到这里，打算用正则获取出数字价格
                    
                    // 货币
                    tmpJSON.Currency = ts.find('ul.lvprices>li.lvprice>span>b').text();
                    if (typeof(img.attr('imgurl')) !== 'undefined') {
                        tmpJSON.ImgURL = img.attr('imgurl');
                    } else {
                        tmpJSON.ImgURL = img.attr('src');
                    }
                    tmpArray.push(JSON.stringify(tmpJSON));
                });
                return tmpArray.join('\n');
            });
            cl(productData);
            // var tmpFile = fs.open('test.html', 'w');
            // tmpFile.write(productData);
            // tmpFile.close();
            // 退出程序
            phantom.exit();
        }); 
        
    }
});


// 数据格式
// var data = {
//     DataName: '产品数据'
//     DataList: [
//         {
//             Letter: 'A',
//             Categorie:[
//                 {
//                     Name: 'Antiques',
//                     CategorieDetailed: [
//                         {
//                             Name: 'Antiquities',
//                             ProductList: [
//                                 {
//                                     Name: 'Product Name',
//                                     Price: 233.33,
//                                     Currency: 'RMB',
//                                     ImgURL: 'http://asdfasdf.asdfadf.jpg'
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// }