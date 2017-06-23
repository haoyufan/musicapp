$(function () {

    audio = $('#audio').get(0);
    //    开始              进度条           远点
    var playPause = $('.play-pause'),durationse = $('.duration'),current = $('.current'),cret = $(".cret");
    var order = $('.order') ,volumes = $('.volumes'),vol = $('.vol'),vouln = $('.vouln'); //sj  音量调   现在   点
    var list = ('.list'),avatar = $('.avatar-title');

    //播放
    var speed =10;
    $(playPause).on('click',function () {
        if(audio.paused){
            audio.play();//开
        }else{
            audio.pause();//关
            $(avatar).css({
                transform:'rotate('+ speed +'deg)',
            })
        }
    })
    var play = function () {
        $(playPause).removeClass('icon-music_play_button').addClass('icon-music_stop_button');
        time= setInterval(function () {
            speed +=10;
           $(avatar).css({
               transform:'rotate('+ speed +'deg)',
           })
       },300)

    }
    var stop  = function () {
        $(playPause).removeClass('icon-music_stop_button').addClass('icon-music_play_button');
        clearInterval(time);
    }
    $(audio).on('play',play);
    $(audio).on('pause',stop);

    //进度条

    width = function () {
        var widths = $(durationse).width() * audio.currentTime/audio.duration;
        $(current).width(widths);
    };

    $(cret).on('mousedown',function (e) {
        $(document).on('mousemove',function (e) {
            ox = e.offsetX;
            if(ox>$(durationse).width()){
                ox = $(durationse).width();
            }
            $(current).css({width:ox});
        })
        $(document).mouseup(function () {
            $(current).css({width:ox});
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
        })
        return false;
    });
    $(audio).on('timeupdate',width);

    times = function (s) {
        s = Math.floor(s);
        sec =Math.floor(s%60);
        min = Math.floor(s/60);
        sec = sec<10 ?'0'+sec : sec;
        min = min<10 ?'0'+min : min;
        return min+':'+sec;
    }
    
    furas = function () {
        $('.dura').html(times(audio.duration))
    }
    uptime = function (){
        $('.curr').html(times(audio.currentTime))
    }

    $(audio).on('timeupdate',uptime);
    $(audio).on('canplay',furas);

    //点击
    durati = function (e) {
        t = audio.duration *e.offsetX /$(this).width();
        audio.currentTime = t;
    };

    $(cret).click(false);
    $(durationse).click(durati);
//声音
    /*音量开关键*/
    volumeclick = function (e) {
        if(audio.volume){
            e.data.prev = audio.volume;
            audio.volume = 0;
        }else{
            audio.volume = e.data.prev;
        };
    };
    $(vouln).click({prev:1},volumeclick);

    musicwidth = function () {
        width = audio.volume * $(volumes).height();
        $(vol).height(width);
        if(audio.volume === 0){
            $(vouln ).removeClass('icon-music_volume_up').addClass('icon-music_mute')
        }else{
            $(vouln).removeClass('icon-music_mute').addClass('icon-music_volume_up')
        }
    }
    $(audio).on('volumechange',musicwidth);

    //点击

    musiclick = function (e) {
        vo =e.offsetY/$(this).height();
        audio.volume = vo;
    }

    $(volumes).click(musiclick);

    $('.vol-sped').on('wheel',function(e){
        if($(vol).height() > 0){
            $(vol).css({height:0})
        }else if($(vol).height() < $(volumes).height()){
            $(vol).css({height:$(volumes).height()})
        }
        if(e.originalEvent.wheelDelta < 0){
            $(vol).css({height:'+=0.2'})
        }else if(e.originalEvent.wheelDelta > 0){
            $(vol).css({height:'-=0.2'})
        }
    })

    $('.vol_cret').on('mousedown',function(){
        $(document).mousemove(function(e){
            oy = e.offsetY;
            if(oy > $(vol).height()){
                oy = $(vol).height();
            }
            $(vol).css({height:-oy});
        })
        $(document).mouseup(function(){
            $(vol).css({height:-oy});
            $(document).unbind('mousemove');
            $(document).unbind('mousemup');
        })
    })


    cuuent=0;
    $.get({
        url:"/index/music",
        dataType:'json',
        success : function (data) {
            console.log(data);
            $.each(data,function(index,element){
                cuuent = data[index];
                $(audio).on('play',function () {
                    $('.text').html(data[index].name);
                });
                read(data[index],index);
                $(list).on('click','li',function () {
                    cuuent = $(this).index();
                    audio.src = data[index].src;
                    read(data[index],index);
                    audio.play();
                    return false;
                }).on('click','.del',function(){
                    index = $(this).closest('li').index();
                    if(index === cuuent){
                        if($(this).parent().siblings()){
                            if(index === index){
                                cuuent = 0;
                            }else{
                                return index;
                            }
                            audio.src = data[index].src;
                            audio.play();
                        }else{
                            audio.src = '';
                            cuuent = null;
                            prev();
                            $('.text').html('----');
                            $('.singer').html('----');
                        }
                    }else{
                        cuuent -= 1;
                    }
                    read(data[index],index);
                    return false;
                })
                lengths = data.length;
                next = function(){
                    cuuent +=1;
                    if(cuuent >= lengths){
                        cuuent=0;
                    }
                    audio.src = data[index].src;
                    audio.play();
                }
                peav = function(){
                    cuuent -=1;
                    if(cuuent <= 0){
                        cuuent=lengths
                    }
                    audio.src = data[index].src;
                    audio.play();
                }
                random = function(){
                    cuuent =Math.floor(Math.random()*lengths);
                    audio.src = data[index].src;
                    audio.play();
                }
                nextclick = function(){
                    if($(order).hasClass('icon-music_repeat_button')){
                        next();
                    }else if($(order).hasClass('icon-music_shuffle_button')){
                        random();
                    }
                    read(data[index],index);
                }
                orders = function(){
                    if($(order).hasClass('icon-music_repeat_button')){
                        $(order).removeClass('icon-music_repeat_button')
                            .addClass('icon-music_shuffle_button')
                    }else{
                        $(order).removeClass('icon-music_shuffle_button')
                            .addClass('icon-music_repeat_button')
                    }
                }
                $('.next').on('click touchend',nextclick);
                $('.prav').on('click touchend',function(){
                    if($(order).hasClass('icon-music_repeat_button')){
                        peav();
                    }else if($(order).hasClass('icon-music_shuffle_button')){
                        random();
                    }
                    read(data[index],index);
                });
                $(order).click(orders);
                $(audio).on('ended',nextclick);
            })
        }
    })
    read = function (value,index) {
        $(list).empty();
        $('<li class="hover"><span>'+value.name+'</span><span class="del">X</span></li>')
            .addClass(function(){
                return (index === cuuent)? 'hover':'';
            }).appendTo(list);
    };
    $('.cole').click(function(){
        if(confirm('确认关闭？')) {
            window.close();
        }
    })


})