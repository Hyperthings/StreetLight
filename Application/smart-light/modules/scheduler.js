var moment = require('moment');
var databaseUrl = "localhost:12345/smart-light"; // "username:password@example.com/mydb"
var collections = ["devices","parking_occupancy","test","live_data","area_comparison"]
var mongojs = require('mongojs');
var moment = require('moment');
var db = mongojs(databaseUrl, collections)
var exports = module.exports = {};
var cron = require('node-cron');


console.log('cronjob started');
cron.schedule('0 */10 * * * *', function(){
	console.log('cronjob started for day_wise_data @ ',moment()._d);
	let dateQuery = {};

	dateQuery['ts'] = {
		$gte: moment().subtract(6, 'days').startOf('day')._d,
	    $lte: moment().endOf('day')._d
	}

	db.collection('history').aggregate([
					  
					    {$match:{ts:{$gt: moment().subtract(6, 'days').startOf('day')._d,$lt: moment().endOf('day')._d}}},
					    {
					        $group: {
					            _id : { day: { $dayOfMonth: "$ts" }, month: { $month: "$ts" }, year: { $year: "$ts" } },
					            EGeneration: { '$sum': '$EGeneration' },
					            EConsumption: { '$sum': '$EConsumption' }
					        }
					    }
					], function (err, datas) {
					    
					    if (err || !datas) console.log(err);
					    else {
					        db.collection('day_wise_data').remove();
					      
							datas.forEach(function(obj) { obj.dateString = obj._id.year+''+(obj._id.month < 10 ? '0'+obj._id.month : obj._id.month)+''+(obj._id.day < 10 ? '0'+obj._id.day : obj._id.day) });
					        console.log('datas',datas)
					  	let originalDataArray = datas.map(({dateString}) => dateString);
					  	console.log('originalDataArray',originalDataArray);
						let dataArray = []
						for (let i = 0; i < 7; i++) {
						  dataArray.push(formatDate(i));
						}

						function formatDate (subtractDate) {
						  return moment().subtract(6 - subtractDate, 'days').format('YYYY' + 'MM' + 'DD')
						}
						dataArray = dataArray.filter(c => !originalDataArray.includes(c));

						console.log('diff', dataArray)
							for(let arr of dataArray){
								datas.push({
								 	'EConsumption':0,
								 	'EGeneration': 0,
								 	'dateString' : arr
								})
							}

							console.log('datas',datas);

					        db.collection('day_wise_data').save(datas, function (err, saved) {
					            if (err || !saved){
					                console.log({message: "Data not Added"});
					            } 
					            else {
					               console.log("Data saved")
					             }
					        });

					    }
					})
});




//cron.schedule('0 6 * * *', function(){
cron.schedule('0 */10 * * * *', function(){
  	let monthQuery = {};

 	monthQuery['ts'] = {
		$gte: moment().subtract(6, 'months').startOf('month')._d,
        $lte: moment().endOf('month')._d
    }
    
	db.collection("history").find(monthQuery, function (err, datas) {
	    if (err || !datas) console.log("No data found");
	    else {
			db.collection('six_month_data').remove();
	        db.collection('six_month_data').save(datas, function (err, saved) {
	            if (err || !saved){
	                console.log({message: "Data not Added"});
	            } 
	            else {
	               
					db.collection('six_month_data').aggregate([
					   /* {
					        $project: {
					        	
					            'EGeneration': true,
					            'EConsumption': true,
					            'month': { $month: '$ts' },
					            'year': { $year: '$ts' }
					        }
					    },*/
					    {$match:{ts:{$gt: moment().subtract(6, 'months').startOf('month')._d, $lt: moment().endOf('month')._d}}},
					    {
					        $group: {
					            _id : { month: { $month: "$ts" }, year: { $year: "$ts" } },
					            EGeneration: { '$sum': '$EGeneration' },
					            EConsumption: { '$sum': '$EConsumption' }
					        }
					    }
					], function (err, datas) {
					    if (err || !datas) console.log(err);
					    else {
					        db.collection('month_wise_data').remove();
					        /*let i = 0;
							for(let monthlyData of datas) {
								datas[i].dateString.push(monthlyData._id.month+''+monthlyData._id.year)
							}*/
							datas.forEach(function(obj) { obj.dateString = obj._id.year+''+(obj._id.month < 10 ? '0'+obj._id.month : obj._id.month) });
					        db.collection('month_wise_data').save(datas, function (err, saved) {
					            if (err || !saved){
					                console.log({message: "Data not Added"});
					            } 
					            else {
					               console.log(saved)
					             }
					        });
					        	//monthWiseData = datas;

					    }
					})
	            }
	        });
	    }
	});
});


