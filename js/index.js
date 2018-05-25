let scrollPro =0,movie=0;
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

$(function(){
    window.onorientationchange = hw;
    init();
    music()//设置音乐
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {passive: false});

})
var loadedCount = 0;
var len
function init() {
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp=AdobeAn.getComposition("A6884732E68D459480F25FAFF18F0553");
    var lib=comp.getLibrary();
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
    loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
    var lib=comp.getLibrary();
    len =lib.properties.manifest.length;
    loader.loadManifest(lib.properties.manifest);

}

function hw(){
    var _hw = orient()
    if(_hw){
        $('.heng').hide();
    }else{
        $('.heng').show();
    }
}

//判断横竖屏切换
function orient() {
    if (window.orientation == 0 || window.orientation == 180) {
        return true;
    }
    else if (window.orientation == 90 || window.orientation == -90) {
        return false;
    }
}


function handleFileLoad(evt, comp) {
    var images=comp.getImages();
    loadedCount++;
    $('.netease-loader .load_data div').css('width',loadedCount/len*300);
    $('.netease-loader .load_data2').html(Math.floor(loadedCount / len * 100) + "%").attr('title', Math.floor(
        loadedCount / len * 100));
    if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
}
function handleComplete(evt,comp) {
    $('.netease-loader').fadeOut(600,function(){
        $(this).remove();
    });
    talk(0);

    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    var lib=comp.getLibrary();
    var ss=comp.getSpriteSheet();
    var queue = evt.target;
    var ssMetadata = lib.ssMetadata;
    for(i=0; i<ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
    }
    exportRoot = new lib.main();
    stage = new lib.Stage(canvas);
    //Registers the "tick" event listener.
    fnStartAnimation = function() {
        stage.addChild(exportRoot);
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
    }
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
    scrollInit();

}
function playSound(id, loop) {
    return createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
}

//设置滚动
function scrollInit(){
    var _totalF = (exportRoot.main.totalFrames-1)*12;
    scroller = new Scroller(function(left,top,zoom){
        console.log(scrollPro);
        scrollPro = (top/12);//减慢滑动
        // scrollPro = exportRoot.main.totalFrames-1-(top/12);//倒播
        if(scrollPro!=0){
            exportRoot.main.gotoAndStop(scrollPro);
        }


        if(60 < scrollPro && scrollPro < 62){
            talk(1)
        }
        if(260 < scrollPro && scrollPro < 262){
            talk(2)
        }
        if(400 < scrollPro && scrollPro < 402){
            talk(3)
        }
        if(570 < scrollPro && scrollPro < 572){
            talk(4)
        }
        if(650 < scrollPro && scrollPro < 652){
            talk(5)
        }
        if(860 < scrollPro && scrollPro < 862){
            talk(8)
        }
        if(980 < scrollPro && scrollPro < 982){
            talk(3)
        }
        if(1120 < scrollPro && scrollPro < 1122){
            talk(6)
        }
        if(1280 < scrollPro && scrollPro < 1282){
            talk(9)
        }
        if(1360 < scrollPro && scrollPro < 1362){
            talk(7)
        }


    },{
        zooming: true,
        bouncing: false
    })
    scroller.setDimensions(stage.width, stage.height, stage.width, _totalF);
    // scroller.scrollTo(0,_totalF,false);	//倒播
    //添加触屏事件
    var mousedown = false;
    document.addEventListener("touchstart", function(e) {
        scroller.doTouchStart(e.touches, e.timeStamp);
        mousedown = true;
    }, false);

    document.addEventListener("touchmove", function(e) {
        e.preventDefault();
        if (!mousedown) {
            return;
        }
        scroller.doTouchMove(e.touches, e.timeStamp);
        mousedown = true;
    }, false);

    document.addEventListener("touchend", function(e) {
        if (!mousedown) {
            return;
        }
        scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
    }, false);
}
// 音乐播放
function music(){
    netease.autoPlay("bgm");//<audio>与<video>标签的id
    var flag = false;

    $('.music').click(function(){
        console.log('musicClick')
        if(!$('#bgm')[0].paused){
            $('#bgm')[0].pause();
            $('.music').removeClass("play");
        }else{
            $('#bgm')[0].play();
            $('.music').addClass("play");
        }
    });
}

function stopMusic(){
    $('#bgm')[0].pause();
    $('.music').removeClass("play");
}
var ml=['sounds/01.mp3','sounds/02.mp3','sounds/03.mp3','sounds/04.mp3','sounds/05.mp3','sounds/06.mp3','sounds/07.mp3','sounds/08.mp3','sounds/09.mp3','sounds/10.mp3']
function talk(url){
    console.log('talk')
    $('#talk').attr('src',ml[url]);
    $('#talk')[0].play();
}
//根据客户端弹出分享
// sshare(pop($('.end')))
function sshare(endFunction){
    var client = /newsapp/i.test(navigator.userAgent);
    var f = endFunction || function(){};
    if(client=="neteasenewsapp"){
        NeteaseShare();
    }else{
        f();
    }
}
// pop($('.end'))
function pop(n,clos){
    var cl = clos||true;
    var div="<div id='pop' pop  class='hide' "
    if(cl){
        div +=  "onclick='closePop()'";
    }
    div +="><div class='popcont' pop>"
    div +=$(n).prop("outerHTML");
    div+="</div><div class='bg'></div>"
    div+="</div>"
    $("body").prepend(div);
    $("#pop").show();
    //console.log(div);
}
//关闭弹层
function closePop(){
    $("#pop").remove();
}
function loadImg(imgs,callback){
    if(!imgs){return false};
    var img=[];
    var len=imgs.length;
    var loadedCount = 0;
    for(var i=0;i<len;i++){
        img[i]=new Image();
        img[i].src=imgs[i];
        img[i].onload = function(){
            loadedCount++;
            // $('.netease-loader .load_data').html(Math.floor(loadedCount/len*100)+"%").attr('title',Math.floor(loadedCount/len*100));
            $('.netease-loader .load_data div').css('width',loadedCount/len*300)
            if (loadedCount>=len){
                $('.netease-loader').fadeOut(600,function(){
                    $(this).remove();
                });
                callback ? callback() : null;
            }
        };
    }
};