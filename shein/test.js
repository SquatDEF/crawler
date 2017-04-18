// const mysql = require('mysql');
// const mysqlConfig = require('./mysql-config.js');

// const connection = mysql.createConnection(mysqlConfig.config);

// connection.connect();

// var sql = 'insert into goods_data(id, sku, title, attr, price, img, source) value(0, ?, ?, ?, ?, ?, ?)';
// var sqlParam = ['mmcskirt-xa17466sets-heathergrey', 'Cross Laced Back Midi Skirt HEATHER GREY',
//                 'Pattern Type:Plain\nSilhouette:Pencil\nLength:Knee Length\nColor:Grey\nMaterial:Cotton\nStyle:Casual\nSize Available:XS,S,M,L\nWaist Size(cm):XS:56cm, S:60cm, M:64cm, L:68cm\nHip Size(cm):XS:84cm, S:88cm, M:92cm, L:96cm\nFabric:Fabric has some stretch\nLength(cm):XS:76cm, S:77cm, M:78cm, L:79cm',
//                 8.00, 'http://img.shein.com/images/shein.com/201612/0f/14815321412653904086.jpg', 'http://www.shein.com/Cross-Laced-Back-Midi-Skirt-HEATHER-GREY-p-334845-cat-1732.html'];
// connection.query(sql, sqlParam, function(err, result) {
// 	if (err) {
// 		console.log('error: ', err.message);
// 		// return;
// 	}
// 	console.log('insert ID:', result);

// });
// connection.end();
const out = process.stdout;
var index = 0;
function run() {
	// out.clearLine();
	out.cursorTo(10);
	out.write('now number is: ' + index);
	out.write('timer: ' + index);
	index++;
	setTimeout(run, 1000);
}
run();