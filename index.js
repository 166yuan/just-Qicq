var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var zTool=require('./lib/zTool');
var userMap=new zTool.SimpleMap();
var socketMap=new zTool.SimpleMap();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:root@localhost:3306/qicq');
//以下为数据库初始化
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

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/qicq.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//设置日志级别
io.set('log level', 1);

//WebSocket连接监听
io.on('connection', function (socket) {
  socket.emit('open');//通知客户端已连接
  console.log("the id of client is:"+socket.id);
  // 打印握手信息
  // console.log(socket.handshake);

  // 构造客户端对象
  socket.on('login',function(msg){
        var account=msg.account;
        var password=msg.password;
        console.log("account:"+account);
        console.log("password:"+password);
        getUser(account,password,socket);
      }
  );

  //注册
  socket.on('register',function (account,passwd){
        var n=parseInt(Math.random()*10);
        var isexist=getUser2(account,socket);
        if(isexist){
          socket.emit("register result",{isok:-1});
        }else{
          newUser(account,passwd,n);
          socket.emit("register result",{isok:1});
        }

      }
  );
  //一对一发送消息
  socket.on('send message',function(from,to,msg){
        console.log('to'+to+msg);
        var usocket=socketMap.get(to);
        if(typeof(usocket)!='undefined'){
          usocket.emit('get message',msg);
        }else{
          console.log("fail to chat!");
        }
      }
  );
  //多人聊天广播
  socket.on("broadcast",function(data){
        socket.broadcast.emit("multi talk",data);
      }
  );
  //监听出退事件
  socket.on('disconnect', function () {
    console.log('Disconnect');
  });
  socket.on('close',function(data){
        if(data!=null){
          userMap.remove(data);
          socketMap.remove(data);
          socket.broadcast.emit('userlist',userMap);
        }
      }
  );

});

function initDb(){
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
    console.log(err);
  });
}
function newUser(account,passwd,random){
  User.build({account : account, 'password' : passwd,image_url:"img/pic"+random+".jpg",name:"unName"}).save().on('success', function(msg){
    console.log("success new user");
  }).on('failure', function(err){
    console.log(err);
  });
}
function getUser(account,password,socket){
  var isfind;
  User.find({ where: {account: account,password:password} }).then(function(project) {
    console.log(" here is result:"+project);
    if(project==null){
      console.log("can't find user");
      socket.emit("is login",{info:"fail login",status:false});
    }else{
      console.log("success find");
      var user=project.dataValues;
      socket.emit("is login",{info:"success login",status:true,user:user});
      addToList(user,socket);
    }
  });
  return isfind;
}
function getUser2(account,socket){
  var isfind;
  User.find({ where: {account: account} }).then(function(project) {
    console.log(" here is result:"+project);
    if(project==null){
      isfind=false;
    }else{
      isfind=true;
    }
  });
  return isfind;
}
function addToList(user,socket){

  var us=userMap.get(user.account);
  if(typeof(us)=='undefined'){
    userMap.put(user.account,user);
    var usocket= socketMap.put(user.account,socket);
    if(typeof(usocket)=='undefined'){
      userMap.put(user.account,socket);
    }
    socket.emit('userlist',userMap);
    socket.broadcast.emit('userlist',userMap);
  }else{

  }
}