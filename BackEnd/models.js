const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    int1: String,
    int2: String,
    int3: String,
    int4: String,
    int5: String,
    created: { 
        type: Date,
        default: Date.now
    }
});

var users = mongoose.model('User', userSchema);

var carSchema = mongoose.Schema({
    path: String,
	name: String,
    year: Number,
    topspeed: Number,
    zero100: Number,
    hp: Number,
   	type: String,
    engine: String,
    created: { 
        type: Date,
        default: Date.now
    }
});

var cars = mongoose.model('Car', carSchema);

var idSchema = mongoose.Schema({
    username: String,
	carname: String,
	imge: String,
    created: { 
        type: Date,
        default: Date.now
    }
});

var iden = mongoose.model('Idens', idSchema);

module.exports = {
  users: users,
  cars: cars,
  secret: 'worldisfullofdevelopers',
  iden: iden
}