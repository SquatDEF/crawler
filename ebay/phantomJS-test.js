var page = require('webpage').create();
var fs = require('fs');
var productArray = [];   // 产品集合
var urlArray = [];       // 详细类目URL集合
var categorieArray = []; // 类目集合
console.log('start');
page.open('http://www.ebay.com/sch/allcategories/all-categories/?_rdc=1', function(status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        console.log('Success!');
        page.render('test.png');
        page.includeJs("./node_modules/jquery/dist/jquery.min.js", function() { 
            // var ua = page.evaluate(function () {
            //     return document.getElementById('jsResultList').innerHTML; 
            // }); 
            var ua = page.evaluate(function () {
                var gcmaString = $('.gcma').html();
                var segmentationStandard = '<div class="ps" style="height:10px;">&nbsp;</div>';
                var gcmaArray = gcmaString.split(segmentationStandard);
                gcmaArray.splice(0, 1); // 删除第一个空值
                gcmaArray.forEach(function(value, index, array) {
                    var tmpJSON = {
                        Letter: $(value).find('.lgna').text()
                    };
                    // value = value.split('<div class="ps">&nbsp;</div>');
                    // tmpJSON.Categorie = [];
                    // value.forEach(function(val, ind, arr) {
                    //     val = '<div id="tmp">' + val + '</div>';
                    //     tmpJSON.Categorie.push({
                    //         Title: $(val).find('p>a').text(),
                    //         URL: []
                    //     });
                    //     $(val).find('li').each(function(index_li, element) {
                    //         tmpJSON.Categorie[ind].URL.push({
                    //             Name: $(element).find('a').text(),
                    //             URL: $(element).find('a').attr('href')
                    //         });
                    //     });
                    // });
                    if (index == array.length - 1) { tmpJSON.Letter = 'Others'; }
                    categorieArray.push(tmpJSON);
                });
                gcmaArray = gcmaArray.join(',');
                return gcmaArray;
            });
            console.log(ua);
            var file = fs.open('test.html', 'w');
            file.write(ua);
            file.close();
            // var data = page.evaluate(function() {
            //     var infoJSON = {};
            //     var _$ = $('#jsResultList');
            //     infoJSON.TrackNumber = _$.find('.track-number').attr('title');
            //     infoJSON.Country = _$.find('.country').attr('title');
            //     infoJSON.TargetCountry = [];
            //     infoJSON.DeliveryCountry = [];
            //     _$.find('.jsDetailsAll .des-block dd').each(function(index, element) {
            //         infoJSON.TargetCountry.push($(this).text());
            //         console.log($(this).text());
            //     });
            //     _$.find('.ori-block dd').each(function(index, element) {
            //         infoJSON.DeliveryCountry.push($(this).text());
            //     });
            //     infoJSON.ddLen = _$.find('.ori-block dd').length;
            //     return infoJSON;
            // }); 
            console.log('完成文件写入');
            // console.log('URL:' + page.url);
            // console.log('TrackNumber:' + data.TrackNumber);
            // console.log('Country:' + data.Country);
            // console.log('目的国家:');
            // for (var i = 0; i < data.TargetCountry.length; i++) {
            //     console.log(data.TargetCountry[i]);
            // }
            // console.log('发货国家:');
            // for (var i = 0; i < data.DeliveryCountry.length; i++) {
            //     console.log(data.DeliveryCountry[i]);
            // }
            phantom.exit();
        });
    }
});

