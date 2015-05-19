/**
 * 
 */
window.onload=function(){
     qicq=new Qicq();
    qicq.init();
}

var Qicq=function(){
	this.socket = null;
};

Qicq.prototype={
	step:1,
	init:function(){
		var that = this;
		sessionStorage.setItem("step",this.step);
		this.socket = io.connect('http://localhost:3000');
		this.socket.on('connect', function (data) {
			console.log("connect to service");
        });
        this.socket.on("is login",function(data){
                if(data.status){
                    $('.login-box').removeClass('bounceIn');
                    $('.login-box').addClass('flipOutY');
                    $('.login-box').addClass('hidden');
                    $('.login-box').addClass('hidden');
                    $('.user-list').removeClass('hidden');
                    $('.my-image').attr('src',data.user.image_url);
                    $('.myname').html(data.user.name);
                    sessionStorage.setItem("myimage",data.user.image_url);
                    step=2;
                    console.log('to'+data.user.account);
                    socket.on('get message',function(data){

                                if (sessionStorage.getItem('step')==3){
                                    if (data.from==talkto){

                                        var content=showEmoji(data.content);
                                        $('#single-chat').append(
                                                "<li class=info-friend><img class=use-img src="+data.image_url+"><span>"+content+"</span></li>" +
                                                "<div class=clear></div>"
                                        );

                                    }else{

                                        $('#chatlist li').each(function(){
                                                    var tag= $(this).find('input').val();
                                                    if(tag==data.from){
                                                        $(this).css("background-image","url(/img/shake.gif)");
                                                    }
                                                }
                                        );
                                    }

                                }else if (sessionStorage.getItem('step')==2||sessionStorage.getItem('step')==4){
                                  $('#chatlist li').each(function(){
                                               var tag= $(this).find('input').val();
                                             if(tag==data.from){
                                                 $(this).css("background-image","url(/img/shake.gif)");
                                             }
                                          }
                                  );
                                }

                                  //把消息缓存进入localStorage
                                 var key=data.from+"to"+data.to;
                                 console.log(key);
                                 var messageArray=localStorage.getItem(key);
                                 console.log(messageArray);
                                 if(messageArray==null){
                                    console.log("store first");
                                    var array=new Array();
                                    array[0]=message1(data.from,data.to,data.content);
                                    localStorage.setItem(key,JSON.stringify(array));
                                   }else{
                                     console.log("store first");
                                     var msgArray=JSON.parse(messageArray);
                                     var size=msgArray.length;
                                     msgArray[size]=message1(data.from,data.to,data.content);
                                     localStorage.setItem(key,JSON.stringify(msgArray));
                                    console.log(msgArray);
                                }
                            }
                    );
                }else{
                    $('.login_error').removeClass("hidden");
                }
                }
        );
	}
}