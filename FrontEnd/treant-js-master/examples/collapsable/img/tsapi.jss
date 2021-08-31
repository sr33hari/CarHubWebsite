//ts
app.get("/cars/ts", mid.checkToken, (req, res) => {
	cars.find({speed:}, function(err, data){
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
		res.send({"Cars":arr,"Image":im64,"ts":ts});
	}).sort({topspeed: -1});
});

//zero100
app.get("/cars/ts", mid.checkToken, (req, res) => {
	cars.find({speed:}, function(err, data){
		arr=[]
		zero=[]
		im64=[]
		var n=0;
		//n = parseInt(req.params.n)-1;
		//console.log(req.params.n)
		while(n<5) {
			arr.push(data[n].name);
			zero.push(data[n].zero100);
			//dat = data[n].created;
			im64.push(fs.readFileSync('./cars/'+data[n].path, 'base64'));
			//res.send({"Cars":arr,"Image":im64});
			
			n++;
		}
		res.send({"Cars":arr,"Image":im64,"zero100":zero});
	}).sort({zero100});
});

//horsepower
app.get("/cars/ts", mid.checkToken, (req, res) => {
	cars.find({speed:}, function(err, data){
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
		res.send({"Cars":arr,"Image":im64,"hp":hp});
	}).sort({hp:-1});
});