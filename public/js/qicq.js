(function ($) {
	function upload(){
        $('#images').trigger("click");
    }
    $('#register-back').click(
        function(){
            $('register-box').addClass('hidden');
            $('login-box').removeClass('hidden');
        });
    var step=0;
    function message1(from,to,content){
        var message=new Object();
        message.from=from;
        message.to=to;
        message.content=content;
        message.time=new Date();
        return message;
    }
    function TimeSort(a,b){
        return new Date(a.time)-new Date(b.time);
    }

    function appendToSingleTalk(from,to){
        console.log('append '+from+" to"+to);
        var key=from+"to"+to;
        var key2=to+"to"+from;
        var t1=localStorage.getItem(key);
        var t2=localStorage.getItem(key2);
        var megArray;
        var myimage=sessionStorage.getItem('myimage');
        var to_image=sessionStorage.getItem('talkto_image');
        if(t1==null){
            megArray=JSON.parse(t2);
            for(var i in megArray){
                if(megArray[i].from==from){
                    $('#single-chat').append(
                        "<li class=info-user><img class=use-img src="+myimage+"><span>"+showEmoji(megArray[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }else{
                    $('#single-chat').append(
                        "<li class=info-friend><img class=use-img src="+to_image+"><span>"+showEmoji(megArray[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }
            }
        }else if(t2==null){
            megArray=JSON.parse(t1);
            for(var i in megArray){
                if(megArray[i].from==from){
                    $('#single-chat').append(
                        "<li class=info-user><img class=use-img src="+myimage+"><span>"+showEmoji(megArray[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }else{
                    $('#single-chat').append(
                        "<li class=info-friend><img class=use-img src="+to_image+"><span>"+showEmoji(megArray[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }
            }
        }else{
            megArray=JSON.parse(t1);
            var megArray2=JSON.parse(t2);
            var meg=megArray.concat(megArray2);
            meg.sort(TimeSort);
            for(var i in meg){
                if(meg[i].from==from){
                    $('#single-chat').append(
                        "<li class=info-user><img class=use-img src="+myimage+"><span>"+showEmoji(meg[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }else{
                    $('#single-chat').append(
                        "<li class=info-friend><img class=use-img src="+to_image+"><span>"+showEmoji(meg[i].content)+"</span></li>"+
                        "<div class=clear></div>"
                    );
                }
            }
        }
        console.log("append end");
    }



    $(function(){
        $('textarea').autosize();
        var talkto;
        var talkto_image;
        var socket = io();
        socket.on('connect', function (data) {

        });

        socket.on("is login",function(data){
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

                            if(step==3){
                                if(data.from==talkto){
                                    var content=showEmoji(data.content);
                                    var device = navigator.userAgent;
                                    alert(device);
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
                            }else if(step==2||step==4){
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

        socket.on("userlist",function(data){
                console.log(data.mapSize);
                console.log(data);
                $('.list-adapter ul').html("");
                for(var s in data.map){
                    var user=data.map[s];
                    $('.list-adapter ul').append(
                        "<li><img src="+user.image_url+" class='friend-logo'/>" +"<div class=friend-info-left>"
                        +"<p class=friend-name>"+"<a href=#>"+user.name+"</a>"+"<input type=hidden value="+user.account+">"+"</p>"+
                        "<p class=friend-info>127.0.0.1</p>"
                        +
                        "</div>"+"<span class=last-time>12:32</span>"+
                        "</li>"
                    );
                }
            }
        );
        socket.on("multi talk",function(data){
                $('#multi-area').append(
                    "<li class=info-user><img class=use-img src="+data.image_url+"><p>"+data.name+"</p><span class=span-append>"+showEmoji(data.content)+"</span></li>"+
                    "<div class=clear></div>"
                );
            }
        );
        socket.on("forceoffline",function(){
            alert("您的账号在其它地方登录！");
        });
        socket.on("shake it",function(from){
            if(from==sessionStorage.getItem('talkto')){
                $('.chat-ui').addClass('tada');
                setInterval(function(){
                    $('.chat-ui').removeClass('tada');
                },2000);
            }
        });
        socket.on("register result",function(data){
            if(data.isok==-1){
                $('.register_error').removeClass('hidden');
                $('.register_error').html('该账号已经存在');
            }else {
                $('.register_error').removeClass('hidden');
                $('.register_error').html('注册成功，返回登录吧！');
            }
        });
        //  initEmoji();
        initEmoji2();
        $('.emojiWrap img').addClass("emoji");
        $('.emojiWrap img').bind("click",function(e){
                var number=$(e.currentTarget).attr("title");
                if(step==3){
                    var vals=$('#msg-input').val();
                    vals=vals+"[emoji:"+number+"]";
                    $('#msg-input').val(vals);
                }else if(step==4){
                    var vals=$('#multi-msg-input').val();
                    vals=vals+"[emoji:"+number+"]";
                    $('#multi-msg-input').val(vals);
                }


            }
        );
        $('.emojiWrap li').bind("click",function (e){
                var number=$(e.currentTarget).attr("text");
                var vals=$('#msg-input').val();
                vals=vals+"[emoji:"+number+"]";
                $('#msg-input').val(vals);
            }
        );

        $("#login").click(function(e){
            var account=$('#account').val();
            var password=$('#password').val();
            sessionStorage.setItem('account',account);
            socket.emit('login',{account:account,password:password});
        });
        $(window).unload(function(){
            var account=sessionStorage.getItem("account");
            socket.emit('close',account);
        });
        $('.friend-name a').live("click",
            function(event){
                var temp=  $(event.currentTarget).next();
                var par= $(temp).parents().filter("li");
                talkto_image=par.children().eq(0).attr('src');
                $(par).css("background-image","");
                var cur=$(event.currentTarget).html();
                talkto=temp.val();
                sessionStorage.setItem('talkto',talkto);
                sessionStorage.setItem("talkto_image",talkto_image);
                if(talkto!=sessionStorage.getItem('account')){
                    sessionStorage.setItem('talkto',talkto);
                    $('.user-list').addClass('hidden');
                    $('.chat-ui').removeClass('hidden');
                    $('#single-chat').html("");
                    $('.to-name').html(cur);
                    appendToSingleTalk(sessionStorage.getItem('account'),talkto);
                    step=3;
                }

            }
        );
        $('#send').click(
            function(){
                var epanel = $('#emojiWrap');
                if(!epanel.hasClass('hidden')){
                    epanel.addClass('hidden');
                }
                var content=$('#msg-input').val();
                var result= showEmoji(content);
                var image_url=$('.my-image').attr('src');
                $('#single-chat').append(
                    "<li class=info-user><img class=use-img src="+image_url+"><span>"+result+"</span></li>"+
                    "<div class=clear></div>"
                );
                $('#msg-input').val("");
                var talkto=sessionStorage.getItem('talkto');
                var from=sessionStorage.getItem('account');
                if(talkto!=null){
                    socket.emit("send message",from,talkto,{
                        from:from,
                        to:talkto,
                        content:content,
                        image_url:image_url
                    });
                }
            }
        );
        $('#multi-send').click(
            function(){
                var content=$('#multi-msg-input').val();
                var image_url=$('.my-image').attr('src');
                var myname=$('.myname').html();
                var account=sessionStorage.getItem("account");
                $('#multi-area').append(
                    "<li class=info-user><img class=use-img src="+image_url+"><p>"+myname+"</p><span class=span-append>"+showEmoji(content)+"</span></li>"+
                    "<div class=clear></div>"
                );
                $('#multi-msg-input').val("");
                socket.emit("broadcast",{
                    account:account,
                    name:myname,
                    image_url:image_url,
                    content:content
                });
            }
        );


        $('#singleChatBack').click(
            function(){
                $('.chat-ui').addClass('hidden');
                $('.user-list').removeClass('hidden');
                step=2;
            }
        );
        $('#enter-chatroom').click(
            function (){
                $(".user-list").addClass('hidden');
                $(".chat-ui-multi").removeClass('hidden');
                step=4;
            }
        );
        $('#multiChatBack').click(
            function(){
                $(".chat-ui-multi").addClass('hidden');
                $(".user-list").removeClass('hidden');
                step=2;
            }
        );
        $('.go-register').click(function (){
                $('.login-box').addClass('hidden');
                $('.register-box').removeClass('hidden');
            }
        );
        $('#register-back').click(function(){
                $('.register-box').addClass('hidden');
                $('.login-box').removeClass('hidden');
            }
        );

        $('#enter-register').click(function(){
                var account=$('#reg_account').val();
                var passwd=$('#reg-passwd').val();
                var repasswd=$('#re-passwd').val();
                console.log(account);
                console.log(passwd);
                if(passwd!=repasswd){
                    $('.register_error').removeClass('hidden');
                    $('.register_error').html('两次密码不一致');
                    return;
                }
                if(!account||!passwd){
                    $('.register_error').removeClass('hidden');
                    $('.register_error').html('账号密码不能为空');
                    return;
                }
                socket.emit("register",account,passwd);
            }
        );

        $('.shakeke').click(function(){
                socket.emit("shake",sessionStorage.getItem('account'),sessionStorage.getItem('talkto'));
            }
        );
    });
    $('#Iemoji').click(function(){
        $('#emojiWrap').toggleClass('hidden');
        $('#single-chat').toggleClass('emojiUp');
    });
    $('#Iemoji2').click(function(){
        $('#emojiWrap2').toggleClass('hidden');
    });
    function initEmoji() {
        var emojiContainer =document.getElementById('emojiWrap'),
            emojiContainer2 =document.getElementById('emojiWrap2'),
            docFragment = document.createDocumentFragment();
        for (var i = 1; i <=41; i++) {
            var emojiItem = document.createElement('img');
            emojiItem.src = 'emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
        for (var i = 1; i <=41; i++) {
            var emojiItem = document.createElement('img');
            emojiItem.src = 'emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer2.appendChild(docFragment);
    }

    function initEmoji2(){
        for(var i=0;i<=20;i++){
            $('#emoji1 ul').append('<li text='+i+'></li>');
        }
        for(var i=0;i<=20;i++){
            $('#emoji1 ul').append('<li text='+i+'></li>');
        }

    }
    function showEmoji(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = 170;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="http://7xiwi7.com1.z0.glb.clouddn.com/emoji' + emojiIndex + '.gif" />');
            };
        };
        return result;
    }
})(jQuery);

(function(e){var t,o={className:"autosizejs",id:"autosizejs",append:"\n",callback:!1,resizeDelay:10,placeholder:!0},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],a=e(i).data("autosize",!0)[0];a.style.lineHeight="99px","99px"===e(a).css("lineHeight")&&n.push("lineHeight"),a.style.lineHeight="",e.fn.autosize=function(i){return this.length?(i=e.extend({},o,i||{}),a.parentNode!==document.body&&e(document.body).append(a),this.each(function(){function o(){var t,o=window.getComputedStyle?window.getComputedStyle(u,null):!1;o?(t=u.getBoundingClientRect().width,(0===t||"number"!=typeof t)&&(t=parseInt(o.width,10)),e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,i){t-=parseInt(o[i],10)})):t=Math.max(p.width(),0),a.style.width=t+"px"}function s(){var s={};if(t=u,a.className=i.className,a.id=i.id,d=parseInt(p.css("maxHeight"),10),e.each(n,function(e,t){s[t]=p.css(t)}),e(a).css(s).attr("wrap",p.attr("wrap")),o(),window.chrome){var r=u.style.width;u.style.width="0px",u.offsetWidth,u.style.width=r}}function r(){var e,n;t!==u?s():o(),a.value=!u.value&&i.placeholder?(p.attr("placeholder")||"")+i.append:u.value+i.append,a.style.overflowY=u.style.overflowY,n=parseInt(u.style.height,10),a.scrollTop=0,a.scrollTop=9e4,e=a.scrollTop,d&&e>d?(u.style.overflowY="scroll",e=d):(u.style.overflowY="hidden",c>e&&(e=c)),e+=w,n!==e&&(u.style.height=e+"px",f&&i.callback.call(u,u))}function l(){clearTimeout(h),h=setTimeout(function(){var e=p.width();e!==g&&(g=e,r())},parseInt(i.resizeDelay,10))}var d,c,h,u=this,p=e(u),w=0,f=e.isFunction(i.callback),z={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},g=p.width();p.data("autosize")||(p.data("autosize",!0),("border-box"===p.css("box-sizing")||"border-box"===p.css("-moz-box-sizing")||"border-box"===p.css("-webkit-box-sizing"))&&(w=p.outerHeight()-p.height()),c=Math.max(parseInt(p.css("minHeight"),10)-w||0,p.height()),p.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word",resize:"none"===p.css("resize")||"vertical"===p.css("resize")?"none":"horizontal"}),"onpropertychange"in u?"oninput"in u?p.on("input.autosize keyup.autosize",r):p.on("propertychange.autosize",function(){"value"===event.propertyName&&r()}):p.on("input.autosize",r),i.resizeDelay!==!1&&e(window).on("resize.autosize",l),p.on("autosize.resize",r),p.on("autosize.resizeIncludeStyle",function(){t=null,r()}),p.on("autosize.destroy",function(){t=null,clearTimeout(h),e(window).off("resize",l),p.off("autosize").off(".autosize").css(z).removeData("autosize")}),r())})):this}})(window.jQuery||window.$);