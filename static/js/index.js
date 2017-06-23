$(function () {
    var flag = true;
    var page = 1;
    var timerId;
    var database = [];
    num = 0
    var handelScroll = function () {
        var ws = $(this).scrollTop();
        var wl = $(this).height();
        var cs = $('.container').innerHeight();
        if (ws >= cs - wl) {
            flag = false;
            clearTimeout(timerId);
            timerId = setTimeout(function () {
                page += 1;
                if (page > $('#page').val()) {
                    $(window).off('scroll', handelScroll);
                    return;
                }
                $.get({url: '/index.php/index/page', data: {page: page}})
                    .done(function (data) {
                        flag = true;
                        $(data).each(function (i, v) {
                            console.log(v)
                            $(`<div class="album" data-id="${v.id}">
                                        <div class="pic" style="background-image:url('${v.sale}') "></div>
                                        <div class="name">${v.album_name}</div>
                                    <div class="audio"></div>
                                  </div>`).appendTo('.container')
                        })
                    })
            })
        }
    }

    $(window).on('scroll', handelScroll);
    var music = $('.music')
    $('.buttom').on('click', function () {
        $('body').addClass('bodys');
        $(music).addClass('active');
        $(this).hide();
    })

    $('.container').on('click', '.album', function (e) {
        e.preventDefault();
        $('body').addClass('bodys');
        $(music).addClass('active');
        $('.buttom').hide();
        
        var id = $(this).attr('data-id');
        $.get('/index.php/index/get_music', {albumId: id})
            .done(function (data) {
                database = data;
                console.log(database)
                audio.src = database[0].src;
                read();
                audio.play();
            })
    })
    
    $('.album').hover(function () {
        $(this).find('.audio').addClass('mouse');
        },function () {
            $(this).find('.audio').removeClass('mouse');
    });
    //-------------------------------------------------------------------

    audio = $('#audio').get(0);
    //    开始              进度条           远点
    var playPause = $('.play-pause'), durationse = $('.duration'), current = $('.current'), cret = $(".cret");
    var order = $('.order'), volumes = $('.volumes'), vol = $('.vol'), vouln = $('.vouln'); //sj  音量调   现在   点
    var list = ('.list'), avatar = $('.avatar-title');
    //-------------------------------------------------------------------
    //播放
    var speed = 10;
    $(playPause).on('click', function () {
        if (audio.paused) {
            audio.play();//开
        } else {
            audio.pause();//关
            $(avatar).css({
                transform: 'rotate(' + speed + 'deg)',
            })
        }
    })
    var play = function () {
        $(playPause).removeClass('icon-music_play_button').addClass('icon-music_stop_button');
        time = setInterval(function () {
            speed += 10;
            $(avatar).css({
                transform: 'rotate(' + speed + 'deg)',
            })
        }, 300)

    }
    var stop = function () {
        $(playPause).removeClass('icon-music_stop_button').addClass('icon-music_play_button');
        clearInterval(time);
    }
    $(audio).on('play', play);
    $(audio).on('pause', stop);
//-------------------------------------------------------------------
    //进度条
    width = function () {
        var widths = $(durationse).width() * audio.currentTime / audio.duration;
        $(current).width(widths);
    };

    $(audio).on('timeupdate', width);

    $(cret).on('mousedown', function (e) {
        $(document).on('mousemove', function (e) {
            ox = e.offsetX;
            if (ox > $(durationse).width()) {
                ox = $(durationse).width();
            }
            $(current).css({width: ox});
        })
        $(document).on('mousemup',function () {
            $(current).css({width: ox});
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
        })
        return false;
    });

    times = function (s) {
        s = Math.floor(s);
        sec = Math.floor(s % 60);
        min = Math.floor(s / 60);
        sec = sec < 10 ? '0' + sec : sec;
        min = min < 10 ? '0' + min : min;
        return min + ':' + sec;
    }

    furas = function () {
        $('.dura').html(times(audio.duration))
    }

    uptime = function () {
        $('.curr').html(times(audio.currentTime))
    }

    $(audio).on('timeupdate', uptime);
    $(audio).on('canplay', furas);

    //点击
    durati = function (e) {
        t = audio.duration * e.offsetX / $(this).width();
        audio.currentTime = t;
    };

    $(cret).click(false);
    $(durationse).click(durati);
//-------------------------------------------------------------------
//声音
    //音量开关键
    volumeclick = function (e) {
        if (audio.volume) {
            e.data.prev = audio.volume;
            audio.volume = 0;
        } else {
            audio.volume = e.data.prev;
        }
        ;
    };
    $(vouln).click({prev: 1}, volumeclick);

    musicwidth = function () {
        width = audio.volume * $(volumes).height();
        $(vol).height(width);
        if (audio.volume === 0) {
            $(vouln).removeClass('icon-music_volume_up').addClass('icon-music_mute')
        } else {
            $(vouln).removeClass('icon-music_mute').addClass('icon-music_volume_up')
        }
    }
    $(audio).on('volumechange', musicwidth);

    //点击

    musiclick = function (e) {
        vo = e.offsetY / $(this).height();
        audio.volume = vo;
    }

    $(volumes).on('click',musiclick);

/*    $('.vol-sped').on('wheel', function (e) {
        if ($(vol).height() > 0) {
            $(vol).css({height: 0})
        } else if ($(vol).height() < $(volumes).height()) {
            $(vol).css({height: $(volumes).height()})
        }
        if (e.originalEvent.wheelDelta < 0) {
            $(vol).css({height: '+=0.2'})
        } else if (e.originalEvent.wheelDelta > 0) {
            $(vol).css({height: '-=0.2'})
        }
    })*/

    $('.vol_cret').on('mousedown', function () {
        $(document).on('mousemove',function (e) {
            oy = e.offsetY;
            if (oy > $(vol).height()) {
                oy = $(vol).height();
            }
            $(vol).css({height: -oy});
        })
        $(document).on('mousemup',function () {
            $(vol).css({height: -oy});
            $(document).unbind('mousemove');
            $(document).unbind('mousemup');
        })
    })
    //-------------------------------------------------------------------
    //播放时信息
    musicinner = function () {
        if (database.length) {
            $('.text').html(database[num].m_name);
            $('.singer').html(database[num].a_name);
            $(list, 'li').removeClass('hover').eq(num).addClass('hover');
            // $('.avatar').css({backgroundImage:})
        } else {
            $('.text').html('----');
            $('.singer').html('----');
        }
    }
    $(audio).on("play", musicinner);

    read = function () {
        $(list).empty();
        $(database).each(function (i, v) {
            $(`<li><span>${v.m_name}----${v.a_name}</span><span class="del">X</span></li>`).addClass(function () {
                return (i === num) ? 'hover' : '';
            }).appendTo(list);
        })
    }
    read();

    //列表
    $(list).on('dblclick', 'li', function () {
        num = $(this).index();
        audio.src = database[num].src;
        read();
        audio.play();
    }).on('click', '.del', function () {
        var index = $(this).closest('li').index();
        database.splice(index, 1);
        if (index > num) {
            ///////
        } else if (index === num) {
            if (database.length) {
                if (index === database.length) {
                    num = 0;
                } else {
                    return index;
                }
                audio.src = database[num].src;
                audio.play();
            } else {
                audio.src = '';
                num = null;
                prev();
                $('.text').html('----');
                $('.singer').html('----');
            }
        } else {
            num -= 1;
        }
        read();
        return false;
    })

    next = function () {
        num += 1;
        if (num >= database.length) {
            num = 0;
        }else if(database.length === num){
            num = 0;
        }
        audio.src = database[num].src;
        audio.play();
        read();
    }
    peav = function () {
        num -=1;
        if (num < 0) {
            num = database.length;
        }
        audio.src = database[num].src;
        audio.play();
        read();
    }
    random = function () {
        num = Math.floor(Math.random() * database.length);
        audio.src = database[num].src;
        audio.play();
        read();
    }
    nextclick = function () {
        if ($(order).hasClass('icon-music_repeat_button')) {
            next();
        } else if ($(order).hasClass('icon-music_shuffle_button')) {
            random();
        }
    }
    peavclick = function () {
        if ($(order).hasClass('icon-music_repeat_button')) {
            peav();
        } else if ($(order).hasClass('icon-music_shuffle_button')) {
            random();
        }
    }

    orders = function () {
        if ($(order).hasClass('icon-music_repeat_button')) {
            $(order).removeClass('icon-music_repeat_button')
                .addClass('icon-music_shuffle_button')
        } else {
            $(order).removeClass('icon-music_shuffle_button')
                .addClass('icon-music_repeat_button')
        }
    }

    $('.next').on('click', nextclick);
    $('.prav').on('click', peavclick);
    $(order).on('click', orders);
    $(audio).on('ended', nextclick);//歌曲结束
    $('.cole').on('click',function () {
        $('body').removeClass('bodys');
        $(music).removeClass('active');
        $('.buttom').show();
    })
})