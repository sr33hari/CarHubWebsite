const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const {exec} = require('child_process');
const fs = require('fs');
var cors = require('cors')
var Twit = require('twit')

var fl = '';

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
  	let ext = path.extname(file.originalname).split('.')[1];
  	fl = file.fieldname + '-' + Date.now()+"."+ext
    callback(null, file.fieldname + '-' + Date.now()+"."+ext);
  }
});

var upload = multer({ storage: storage })

const {users} = require('./models');
const {cars} = require('./models');
const {secret} = require('./models');
const {iden} = require('./models');
const mid = require('./mid');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

var mongoDB = 'mongodb://127.0.0.1/WT2';
mongoose.connect(mongoDB, { useNewUrlParser: true });

var T = new Twit({
  consumer_key:         'V5tcwjVhFUc0mTA7qpo13bwtM',
  consumer_secret:      'rGxbuxPaPZf8Qjqigu0FN7kFOJqvcQ1eX1jiVJM1S9dZbZGpcX',
  access_token:         '103001721-mivTwlI89z78RJIbPyja03wMFfHnu37NYp6JR01A',
  access_token_secret:  'AXRI0cnrNmwdVGBSNimiAL6tiU2mpfJsFvfqvRP3OWacq',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  
})


//Get the default connection
var db = mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let port = 8000;

app.post('/login', (req, res) => {
	pass = req.body.password;
	//console.log(req.body)
	users.find({username: req.body.username}, function(err, data){
		if (err) return handleError(err);
		if (data.length>0){
		bcrypt.compare(req.body.password, data[0]["password"], function(err, resp){
			if(resp)
			{
				let token = jwt.sign({username: req.body.username},
          			secret,
          			{
          				expiresIn: '24h' // expires in 24 hours
          			}
        		);
        		token = "Bearer " + token;
        		res.cookie("user", req.body.username);
        		res.cookie("Auth",token,{expires: new Date(new Date().getTime()+5*60*1000)});
        		res.send({"Cookie": req.body.username, "Message":"Success"});

			}
			else
				res.send({"Message":"Wrong Password"});
		});}
		else
			res.send({"Message":"User does not Exist"});
	});

});

app.post('/register', (req, res) => {
	console.log(req.body.intr);
	users.find({username: req.body.username}, function(err, data){
		if (data.length > 0){
			res.json({"Message":"User Exists"});
		}
		else {
			let pw = bcrypt.hashSync(req.body.password, 10)
			const u = new users({name: req.body.name, username: req.body.username, password: pw});
			users.create(u, function(err){
				if (err) { return console.error(err) }
			});

				let token = jwt.sign({username: req.body.username},
          			secret,
          			{
          				expiresIn: '24h' // expires in 24 hours
          			}
        		);
        		token = "Bearer " + token;
        		res.cookie("user", req.body.username);
        		res.cookie("Auth",token,{httpOnly: true, expires: new Date(new Date().getTime()+5*60*1000)});
        		res.send({"Message":"Success"});
			res.json({"Message":"Success"});
		}
	});
});

app.post('/ident', upload.single('image'), (req, res) => {
	console.log("test")
  if (!req.file) {
    return res.send({
      success: false
    });

  } else {
    	st = "python3 Car-Recognition/demo.py uploads/"+fl;
    	exec(st, (err, stdout, stderr) => {
    		r = stdout.split(",");
    		if(parseFloat(r[1]) >= 0.50)
    		{
    			const u = new iden({username: req.username, carname: r[0], imge: fl});
				iden.create(u, function(err){
				if (err) { return console.error(err) }
				res.send({"Car":r[0]});
			});
    		}
    		else
    			res.send({"Car":"Not Found"});
    	});
  }
});

app.get("/iden/hist/:n", mid.checkToken, (req, res) => {
	console.log("id");
	iden.find({username: req.username}, function(err, data){
		car = []
		dat = []
		im = []
		n = parseInt(req.params.n)-1;
		console.log(req.params.n)
		if(n < data.length) {
			car = data[n].carname;
			dat = data[n].created;
			var im64 = fs.readFileSync('./uploads/'+data[n].imge, 'base64');
			res.send({"Car":car, "Date":dat, "Image":im64});
		}
		else
		{
			res.send({"Error":"History Over"});
		}
	}).sort({created: -1});
});

app.get("/twet", (req, res) => {
	console.log('test')
	res.status(200).set({
		"connection": "keep-alive",
		"cache-control": "no-cache",
		"content-Type": "text/event-stream"
	});
	users.find({username: "Ishaan1"}, function(err, data){
		T.get('search/tweets', { q: '#cars', count: 1, result_type: 'recent', lang: 'en'}, function(err, data, response) {
  			tw = data.statuses
  			console.log(tw[0].text)
  			res.write("data:"+tw[0].text+"\n\n")
  		});
  		T.get('search/tweets', { q: '#ferrari', count: 1, result_type: 'recent', lang: 'en'}, function(err, data, response) {
  			tw = data.statuses
  			res.write("data:"+tw[0].text+"\n\n")
  		});
  		T.get('search/tweets', { q: '#redbull', count: 1, result_type: 'recent', lang: 'en'}, function(err, data, response) {
  			tw = data.statuses
  			res.write("data:"+tw[0].text+"\n\n")
  		});
  		T.get('search/tweets', { q: '#hypercar', count: 1, result_type: 'recent', lang: 'en'}, function(err, data, response) {
  			tw = data.statuses
  			res.write("data:"+tw[0].text+"\n\n")
  		});
  		T.get('search/tweets', { q: '#tesla', count: 1, result_type: 'recent', lang: 'en'}, function(err, data, response) {
  			tw = data.statuses
  			res.write("data:"+tw[0].text+"\n\n")
  		});
  		var stream = T.stream('statuses/filter', { track: '#cars' })
		stream.on('tweet', function (tweet) {
			tww = (tweet.extended_tweet).full_text
			console.log(tww)
  			// tw = tweet.statuses
  			res.write("data:"+tww+"\n\n")
		})
		res.send();
	});
})

//ts
app.get("/cars/ts", mid.checkToken, (req, res) => {
	cars.find({}, function(err, data){
		arr=[]
		ts=[]
		im64=[]
		var n=0;
		//n = parseInt(req.params.n)-1;
		//console.log(req.params.n)
		while(n<5) {
			arr.push(data[n].name);
			ts.push(data[n].topspeed);
			//dat = data[n].created;
			im64.push(fs.readFileSync('./cars/'+data[n].path, 'base64'));
			//res.send({"Cars":arr,"Image":im64});
			
			n++;
		}
		res.send({"Cars":arr,"ts":ts});
	}).sort({topspeed: -1});
});

//zero100
app.get("/cars/zer", mid.checkToken, (req, res) => {
	cars.find({}, function(err, data){
		arr=[]
		zero1=[]
		im64=[]
		var n=0;
		//n = parseInt(req.params.n)-1;
		//console.log(req.params.n)
		while(n<5) {
			arr.push(data[n].name);
			zero1.push(data[n].zero);
			//dat = data[n].created;
			im64.push(fs.readFileSync('./cars/'+data[n].path, 'base64'));
			//res.send({"Cars":arr,"Image":im64});
			
			n++;
		}
		res.send({"Cars":arr,"zero100":zero1});
	}).sort({zero});
});

//horsepower
app.get("/cars/hp", (req, res) => {
	cars.find({}, function(err, data){
		arr=[]
		hp=[]
		im64=[]
		var n=0;
		//n = parseInt(req.params.n)-1;
		//console.log(req.params.n)
		while(n<5) {
			arr.push(data[n].name);
			hp.push(data[n].hp);
			//dat = data[n].created;
			im64.push(fs.readFileSync('./cars/'+data[n].path, 'base64'));
			//res.send({"Cars":arr,"Image":im64});
			
			n++;
		}
		res.send({"Cars":arr,"hp":hp});
	}).sort({hp:-1});
});

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});