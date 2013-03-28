var http = require('http');
var mongodb = require('mongodb');

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.end('Hello World\n');
}).listen(1343, '127.0.0.1');

console.log('Node.js Server running at http://127.0.0.1:1337/');

/*
var replSet = new mongodb.ReplSetServers(
[new mongodb.Server('localhost', '27017', {
	auto_reconnect: true
}),
new mongodb.Server('localhost', '27018', {
	auto_reconnect: true
}),
new mongodb.Server('localhost', '27019', {
	auto_reconnect: true
})], {
	rs_name: 'rs0'
});
*/
/*can play with this to illustrate the w val and its effect on mongostat*/

/*
var db = new mongodb.Db('node', replSet, {
	w: 1
});
*/

var db = new mongodb.Db('node', new mongodb.Server("localhost", 27017), {
	w: 1
});

db.open(function(err, p_db) {
	var collection = db.collection('messages');
	CreateWriter(collection, 'writer-1', 90);
	CreateReader(collection, 'reader-1', 125);
	CreateWriter(collection, 'writer-2', 100);
	CreateReader(collection, 'reader-2', 125);
	CreateReader(collection, 'reader-3', 125);
	CreateWriter(collection, 'writer-3', 80);
	CreateReader(collection, 'reader-4', 125);
	CreateReader(collection, 'reader-5', 125);
	CreateReader(collection, 'reader-6', 125);
	CreateReader(collection, 'reader-7', 125);
	CreateReader(collection, 'reader-8', 125);
	CreateReader(collection, 'reader-9', 125);
	CreateWriter(collection, 'writer-4', 120);
	CreateReader(collection, 'reader-10', 125);
	CreateReader(collection, 'reader-11', 125);
	CreateReader(collection, 'reader-12', 125);
	CreateReader(collection, 'reader-13', 125);
	CreateReader(collection, 'reader-14', 125);
	CreateReader(collection, 'reader-15', 125);
	CreateReader(collection, 'reader-16', 125);
	CreateReader(collection, 'reader-17', 125);
	CreateReader(collection, 'reader-18', 125);
	CreateReader(collection, 'reader-19', 125);
	CreateReader(collection, 'reader-20', 125);
	CreateReader(collection, 'reader-21', 125);
	CreateReader(collection, 'reader-22', 125);
});

function CreateWriter(collection, name, time) {
	setInterval(function() {
		collection.insert({
			message: Math.random(),
			status: 'new',
			date: Date()
		}, {
			safe: true
		}, function(err, objects) {
			if (err) {
				console.log(err);
			} else {
				console.log(name + ' wrote document to DB');
			}
		});
	}, time);
}

function CreateReader(collection, name, time) {
	setInterval(function() {
		collection.findAndModify({
			status: 'new'
		}, {
			date: 1
		}, {
			$set: {
				status: 'processing'
			},
			$inc: {
				touched: 1
			}
		}, function(err, obj) {
			if (err) {
				console.log('there was an error...' + err);
			} else {
				if (obj === null) {
					/*this line is interesting as it slows the whole thing down*/
					console.log('no work for: ' + name);
					return;
				}
				obj['manager'] = name;
				obj['status'] = 'finished';
				delete obj['_id'];

				collection.update({
					message: obj['message'], touched : 1
				}, {
					$set: obj
				}, {
					upsert: 0,
					safe: true
				}, function(err, objects) {
					if (err) {
						console.log(err + ' on ' + JSON.stringify(obj));
					} else {
						console.log('updated: ' + JSON.stringify(obj));
					}
				});
			}
		});
	}, time);
}

/*
Aggregation Commands:
{ $match : { status : 'finished' } }, { $group : { _id : '$manager', touched : { $sum : 1} } }, { $project : { ReaderID : '$_id', Work : '$touched', _id : 0} }, { $sort : {Work : -1 } }

*/