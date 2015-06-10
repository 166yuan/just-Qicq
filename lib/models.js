/**
 * Created by Administrator on 2015/4/23.
 */

var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:root@localhost:3306/qicq');
var IsOk=true;
var User = sequelize.define('User', {
    // auto increment, primaryKey, unique
    id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true,
        get:function(){
            return this.getDataValue('id');
        },
        set:function(val) {
            this.setDataValue('id', val);
        }
    },
    account : {type : Sequelize.STRING, allowNull : false,
        get:function(){
            return this.getDataValue('account');
        },
        set:function(val) {
            this.setDataValue('account', val);
        }
    },
    password : {type : Sequelize.STRING, allowNull : false,
        get:function(){
            return this.getDataValue('password');
        },
        set:function(val) {
            this.setDataValue('password', val);
        }
    },
    name: {type:Sequelize.STRING,
        get:function(){
            return this.getDataValue('name');
        },
        set:function(val) {
            this.setDataValue('name', val);
        }
    },
    image_url:{type:Sequelize.STRING,
        get:function(){
            return this.getDataValue('image_url');
        },
        set:function(val) {
            this.setDataValue('image_url', val);
        }
    }
});
function newUsers(account,passwd,random){

}
module.exports.initDb = function (){
    User.sync().on('success', function(){
        console.log('init User table');
    }).on('failure', function(){
        console.log('fail create user table');
    });
    User.build({account : '123', 'password' : '123'}).save().on('success', function(msg){
        console.log("success new user");
    }).on('failure', function(err){
        console.log(err);
    });
    User.build({account : 'qwe', 'password' : 'qwe'}).save().on('success', function(msg){
        console.log("success new user");
    }).on('failure', function(err){
    });
}

module.exports.newUser = function (account,passwd,socket,random,name){
    console.log(random);
    User.build({account : account, 'password' : passwd,image_url:"img/pic"+random+".jpg",name:name}).save().on('success', function(msg){
        console.log("success new user");
    }).on('failure', function(err){
        console.log("failure");
        console.log(err);
    });
}

module.exports.getUser = function (account,password,tunnel,socket){
    User.find({ where: {account: account,password:password} }).then(function(project) {
        console.log(" here is result:"+project);
        if(project==null){
            tunnel.emit("wrong","db result---------can't find user");
            socket.emit("is login",{info:"fail login",status:false});
        }else{
            console.log("success find");
            var user=project.dataValues;
            tunnel.emit("success","db result--------success find user");
            socket.emit("is login",{info:"success login",status:true,user:user});
           /* addToList(user,socket);*/
            tunnel.emit("user login",user,socket);
        }
    });
}

module.exports.getUser2 = function (account,password,tunnel,socket,n){
    User.find({ where: {account: account} }).then(function(project) {
        if(project==null){
            tunnel.emit("wrong","db result---------can't find user");
            tunnel.emit("user exist",account,password,socket,n);
            socket.emit("register result",{isok:1});
        }else{
            tunnel.emit("success","db result--------success find user");
            socket.emit("register result",{isok:-1});
        }
    });
}


