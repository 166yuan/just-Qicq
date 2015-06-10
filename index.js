var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var zTool=require('./lib/zTool');
var userMap=new zTool.SimpleMap();
var socketMap=new zTool.SimpleMap();

var db = require('./lib/models');

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

//注册事件派发器
var EventProxy = require('eventproxy');
var tunnel = new EventProxy();
tunnel.on("wrong",function(data){
    console.log(data);
});
tunnel.on("success",function(data){
    console.log(data);
});
tunnel.on("user login",function(user,socket){
    addToList(user,socket);
});
tunnel.on("user exist",function (account,password,socket,n){
    var name=zTool.RandomString(8);
    db.newUser(account,password,socket,n,name);
});

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/qicq.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



//WebSocket连接监听
io.on('connection', function (socket) {
  socket.emit('open');//通知客户端已连接
  console.log("the id of client is:"+socket.id);
  var address = socket.handshake.address;
  console.log(address);
  // 打印握手信息
  // console.log(socket.handshake);
  // 构造客户端对象
  socket.on('login',function(msg){
        var account=msg.account;
        var password=msg.password;
        console.log("account:"+account);
        console.log("password:"+password);
        db.getUser(account,password,tunnel,socket);
      }
  );

  //注册
  socket.on('register',function (account,passwd){
        var n=parseInt(Math.random()*10);
        db.getUser2(account,passwd,tunnel,socket,n);
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
    //摇一摇
  socket.on("shake",function(from,to){
        var usocket=socketMap.get(to);
        if(typeof(usocket)!='undefined'){
          usocket.emit('shake it',from);
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

    //监听退出事件
  socket.on('close',function(data){
        console.log("close connect");
        if(data!=null){
          userMap.remove(data);
          socketMap.remove(data);
          socket.broadcast.emit('userlist',userMap);
        }
      }
  );

});

