(function($){

	var startevent = 'touchstart' in document.documentElement ? "touchstart" : "mousedown";
	var endevent = 'touchend' in document.documentElement ? "touchend" : "mouseup";

	function isWeiXin(){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
	}

	function isIos(){
		var u = navigator.userAgent;  
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端  
		return isiOS
	}

	var pngArr;
	if(isIos()){
		pngArr = [
			'2a4ec62b0f25141090a26d574ff0cd97.png',//popogif1
			'4efee46fc7b78ab0ac57d4716b7d27ed.png',//popogif2
			'5005557c919a5715d91ba4fe98f4ffb8.png',//njgif
			'ce14366366ccc82ea09902cf8c3c32ce.png',//bjgif
			'4499133b8def483dba027600b63c083e.png',//hzgif
			'515565a8a294728bc44de93e7255bc0e.png',//shgif
			'429394518c296bf32d0bd775407c2069.png',//cdgif
			'518610633978316d1460a4a14c3978d2.png',//gzgif
			'10ca75fde0177ab9fce66a7700d57375.png',//szgif
		];
	}else{
		pngArr = [
			'a31df7e4f28614f9b5329772759df617.png',//njgif
			'ddc724e9a97e2cd58b71123632f2fe8a.png',//bjgif
			'c3a139e39a558c3710e5cab1030f3ff5.png',//hzgif
			'd9fe18ad21069ac4e15b1dc8fbb830a4.png',//shgif
			'79a8e348e8dd28ec547fb5dd9a1e2b27.png',//cdgif
			'aa18ca45629d72f140b90f340ba5f443.png',//gzgif
			'4c1b150caf11aa4d115a9d4b4fb2087f.png',//szgif
			'37f86a8db1416aa76262a345d3f18b4d.png'//yuns
		];
	}

	//获取URL参数
	var GLOBLE_PARAMS = (function () {
	    var args = new Object();
	    var query = location.search.substring(1);
	 
	    var pairs = query.split("&"); // Break at ampersand
	    for(var i = 0; i < pairs.length; i++) {
	        var pos = pairs[i].indexOf('=');
	        if (pos == -1) continue;
	        var argname = pairs[i].substring(0,pos);
	        var value = pairs[i].substring(pos+1);
	        value = decodeURIComponent(value);
	        args[argname] = value;
	    }
	    return args;
	})();

	var cityId = GLOBLE_PARAMS["city"];
	/*  动画帧函数
	** num   帧数量
    ** time  切换时间
    ** row 行数
    ** col 列数  
	*/

	function frameAni(dom,num,time,row,col,width,height){
		this.$dom = dom;
		this.num = num;
		this.time = time;
		this.row = row;
		this.col = col;
		this.timer = null;
		this.defaults = 0;
		this.width = width;
		this.height = height;
	}
	frameAni.prototype.animates = function(){
		var that = this;
		that.timer = window.setInterval(function(){
			var r = Math.floor(that.defaults/that.col),l = that.defaults%that.col;
			var x = - r*that.height,y = - l*that.width;
			that.$dom.css('background-position', y+'px '+x+'px');
			if(that.defaults == (that.num-1)){
				that.defaults = 0;
			}else{
				that.defaults++;
			}
		},that.time)
	}
	frameAni.prototype.cancelAni = function(){
		window.clearInterval(this.timer);

	}

	/*  预加载资源
	** initTag   是否已加载
    ** imgDomin  加载资源域名
    ** loadCount 初始加载资源数0  
	*/

	function preLoadimg(options){
		this.initTag = true;
		this.loadCount = 0;
		this.imgDomin = "http://nos.netease.com/house-public/";
		this.preLoadingImgData = options.preLoadingImgData;
		this.button = options.button;
		this.callback = options.callback || function(){};
	}
	preLoadimg.prototype.init = function(){
		var that = this;
		that.initTag = false;
		that.preLoadingImgData = that.preLoadingImgData.map(function(item,index){
			return that.imgDomin + item;
		});
		this.preLoading(0);
	}
	preLoadimg.prototype.preLoading = function(i){
		var that = this;
		var _img = new Image();
		var isloaded=false;
		_img.src=this.preLoadingImgData[i];
		this.loadCount++;
		var count = this.loadCount,imglength = this.preLoadingImgData.length;
		var percent=parseInt(count/imglength*100);
		// 显示百分比
	 	this.button.html(percent);
		if(count==imglength){
			// loading结束
			$("#loading-img").remove();	
			//this.button.html("");		
			window.setTimeout(function(){
				that.callback();
			},100)				
		}
		$("#loading-img").append($(_img));
		var timer=null;
		timer=setInterval(function(){
			if($(_img).height()){
				$("#loading-img").html("");	

				clearInterval(timer);
				if(count<imglength){
					that.preLoading(count);
				}
			}
		},10);	
	}

	/*
		主函数
	*/
	var mainfun = {
		music:true,
		init:function(){	
			if(!isIos()){
				$(".popo1").removeClass("popo1").addClass("popo3");
				$(".popo2").removeClass("popo2").addClass("popo3");
				$(".swiper-container .city").each(function(){
					var citys = $(this).attr("_city");
					$(this).removeClass(citys).addClass(citys+"an");
					$(this).find(".yuns").show();
				});
			}
			this.handle();	
			this.load();
			var wHeight = $(window).height();
			var top = wHeight/2-450+441;
			var layHeight = wHeight-top;
			$(".laybox3").css({"height":layHeight+"px","top":top+"px"});	
		},
		handle:function(){
			this.audioAutoPlay('bgm');
			this.audioAutoPlay1('rightm');
			this.audioAutoPlay1('errorm');
			h5Share.init({
                title: "这次小粽子不是拿来吃的，而是拿来……",
                desc: "去3D水下世界帮小粽子回家！",
                url: window.location.host+window.location.pathname,
                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
            });	
			var that = this;		
			$("#share").bind(startevent,function(){
				if($(".index").css("display") == "block" || $(".home").css("display") == "block"){
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.href,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });	
				}else{
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.host+window.location.pathname+"?city="+cityModel.index,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });	
				}
				if(isWeiXin()){
                    $(".overlay2").show();
                    var timer = window.setInterval(function(){
                        if($("#shareBoxImgLoading").length || $("#shareBoxLayout").length){
                            $("#shareBoxImgLoading").remove();
                            $("#shareBoxLayout").remove();
                            window.clearInterval(timer);
                        }
                    },10);  
                }else{
                	h5Share.share();
                }      
			});
			$(".overlay2").bind(startevent,function(){
				$(".overlay2").hide();
			});	
			$("#music").bind(startevent,function(){
				if(that.music){
					$(this).addClass("musicoff").removeClass("musicon");
					$("#bgm")[0].pause();         
				}else{
					$(this).addClass("musicon").removeClass("musicoff");
					$("#bgm")[0].play();         
				}
				that.music = !that.music;
			});	
			$("#triright").bind(startevent,function(){
				$("#rightm")[0].play();      
			});
			$("#trierror").bind(startevent,function(){
				$("#errorm")[0].play();      
			});		
			$("#go").bind(startevent,function(){
				$(".index").hide();
				$(".home").show();
				pano.orientInit();
				if(isIos()){
					$.each(cityModel.gifpopo,function(index,value){
						value.animates();
					});
				}
				//$(".model").css({"opacity":1});
			});
			$('.index,.loading').on('touchmove', function (event) {
			    event.preventDefault();
			});
			$('.model').on('touchmove', function (event) {
				if($(event.originalEvent.target).hasClass("drag")){
				}else{
					event.preventDefault();
				}
			});
		},
		load:function(){
			var that = this;
			var zongziGif = new frameAni($("#zongzi"),41,100,5,10,150,150);
			zongziGif.animates();
			var imgArrr = [
				    '05140d167131da8004eb7698e15e4f35.jpg',//loadingbg 
				    'b3a181df7f57a482b316086b0f0505c9.png',//zongzi frame
					'0fc3855483aa6fc5127641840d3c9228.jpg',//0001
					'8cd8e1a1723a574cf89938e4d35e4166.jpg',//0002 
					'd2bf83c1750046d76b8e93afce1d5140.jpg',//0003 
					'5e3a3a719cb8f9940a63306a2ffaffa8.jpg',//0004 
					'7aedfb6dbbe636bc5619f4762047c774.jpg',//0005 
					'232eb3269244f09bdf6e101f933cd07f.jpg',//0006 
					'a79d67b1c213d42027c0f38c237a1970.png',//bendilogo 
					'e2db466d1c542cdfab08c5ef32d80755.png',//gogo 
					'7eba8e244eaeebf66f84b23ed486abd5.jpg',//indexbg 
					'2889587769d45071551164b12867ff10.png',//music 
					'173fa8265d516cf93fb8dc9cba3b7970.png',//po1 
					'9fa159d1394c8b3c175d0a95c9fe1c9f.png',//po2 
					'9e57d5e5d90135daaca2d4d2e2cc50eb.png',//shuiwen 
					'edfa40c8741278fa24282a9c9492f292.png',//theme
					'cb786128fc5e4a0fd1ab7d08eedc1b05.png',//yuer
					'8b97ae985b49e36b1a1e9a54d9c4332f.png',//arrow
					'1d2d41d6ab2d89556461ad60dc44d258.png',//errortips
					'213f7c439179798e5ea42a8d759fe8eb.png',//help
					'29963406b475b4215b791117a53b6d7c.png',//helptips
					'c9f0aaf1c38de652dd1190a41dbbe101.png',//icon1
					'84e7f8850ed8d2124dc820c0743dc486.png',//icon2
					'c64384e68452acc4bf07765bb5479daa.png',//icon3
					'be9e981af07de48f42731cf429a63214.png',//icon4
					'62f31ce33e91c5e9f166f8680b6c9530.png',//locat
					'8df1febebf39c01b11748b15c39250b1.png',//borders
					'c7b8ca842b60d6455398c57f8fc5f9ec.png',//overtips
					'eab19accb83496d8edab35051ea77970.png',//pointer
					'183864047542bebf8b65ca3eb95544a0.png',//sharetips
					'84889b5d5cf353c90c5b0b331eb2d118.png',//switch
					'b16d4921e3f44f9a6034d8e0f6d7053c.jpg',//homebg
					'2451ad92b030d153b984233102e9dea8.png',//share
					'f79a117449a22d024107e29d92a82030.png',//zongzibg
					'6e142533f8ac81f9f759a43ff70558da.png',//1bj
					'0b2117529a8f4a337cb6a264ab8bf269.png',//1bjh
					'371a09ffdaaa0f97be6f90a0855ff398.png',//2sh
					'5bb0cae872ee0ca9be9a0e6d79187bc5.png',//2shh
					'277585a9216af67a4d753505a74a667d.png',//3cd
					'515575e83e090410b87b7ca09daa5973.png',//3cdh
					'847748a86ed72a1deb77498ede1488a1.png',//4gz
					'896c5ec267e601499648edc5f5d2f168.png',//4gzh
					'70278111f1b371237a476d200aeaa1b4.png',//5sz
					'5a16b2675c32f6bfdbe8b1773a2830e7.png',//5szh
					'186a9645e50a27e1beccd1b4d6bcadd8.png',//6nj
					'2d8dae4aa4c6afe911e3534f63d71916.png',//6njh
					'c684cc37294a674c084b1e760fb3a212.png',//7hz
					'38f111aee5932d3a35357a1d63865474.png',//7hzh
					'a2a5247bede7ff8bca526ca164cc3083.png',//ele1
					'bc2ae44daf64ebf0d29b692cb0dc98bc.png',//ele2
					'ce6aaaa5aa4a68691b5b5eb40ae0a101.png',//yu
					'40a275c066e6f956e6a39ddfcf3e0e47.png',//zongzibg
					'd0eda52048075eec1b8c68f559c733f0.png',//poppng
					'e7908896ced000932269b0e2e8a6ba1b.png',//njpng
					'8857ea42e4001ac7368ee48d1b322ae1.png',//bjpng
					'5be9eaf11f9b9228c9390674025ea109.png',//hzpng
					'db7c4448b34b08275a9430dc0bd803c5.png',//shpng
					'7f8b7d73e83f05efb67a9b8b1ef095ea.png',//cdpng
					'e73142354f867ddfc94aa498bbc860f3.png',//gzpng
					'ddba15964c9a2a942e3efa77c2cf1f04.png',//szpng
					'fefada2cb71836af8457c555295f5dad.png', //righticon
					'79606a99158bdaa5c8e6155f520caf77.png',//ceng1
					'19c36d0d47f031be3edc88b12bf8a60f.png'//ceng2
				];
				imgArrr = $.merge(imgArrr,pngArr);

			//alert(imgArrr.length);	
			var options = {
				preLoadingImgData:imgArrr,
				button:$("#percent em"),
				callback:function(){			
					that.start();
				}
			};
			new preLoadimg(options).init();
		},
		start:function(){
			pano.init();
			cityModel.init();
			$(".loading").css({"z-index":10});
			$("#errorm")[0].muted=false;
			$("#rightm")[0].muted=false;
			if(cityId){
				pano.orientInit();
				window.setTimeout(function(){
					$(".model").css({"opacity":1});
					$("#zongzi").remove();
					$("#music,#share").show();
					if(cityModel.firstFlag){
						/*window.setTimeout(function(){
							$(".overlay3").hide();
							cityModel.firstFlag = false;
						},1500);*/
					}
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.host+window.location.pathname+"?city="+cityId,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });	
				},1000)			
			}else{
				$(".index").fadeIn(1000,function(){
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.href,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });	
					$("#zongzi").remove();
					$("#music,#share").show();
					window.setTimeout(function(){
						$(".theme").addClass("themeani");
						$(".shuiwen").addClass("shuiwenani");
						$(".go").addClass("goani");
						$(".yuer").addClass("yuerani");
						$(".po1").addClass("po1ani");
						$(".po2").addClass("po2ani");
					},2000)				
				});
			}		
		},
		audioAutoPlay:function(id){
			var audio = document.getElementById(id),
		        play = function(){
		        	audio.play();
		        	document.removeEventListener("touchstart",play, false);
		    	};
		    audio.play();
		    document.addEventListener("WeixinJSBridgeReady", function () {
		        play();
		    }, false);
		    document.addEventListener("touchstart",play, false);
		},
		audioAutoPlay1:function(id){
			var audio = document.getElementById(id);
			audio.muted=true;
		    var play = function(){
		        	audio.play();
		        	//document.removeEventListener("touchstart",play, false);
		    	};
		    audio.play();
		    document.addEventListener("WeixinJSBridgeReady", function () {
		        play();
		    }, false);
		   // document.addEventListener("touchstart",play, false);
		}	
	}	
	/*
	   THREEJS封装立方体全景
	*/
	var pano = {
		camera:new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 ),
		scene: new THREE.Scene(),
		renderer:new THREE.CSS3DRenderer(),
		target3D:new THREE.Vector3(),
		orienters:{
			lon:0,
			lat:0
		},
		param:{
			lon:90,
			lat:0,
			phi:0,
			theta:0
		},
		oritag:true,
		home:document.getElementById("main"),
		touch:{x:"",y:""},
		init:function(){
			var that = this;
			var width = 1136,r = width/2;
			var sides = [
		        {
		            position: [ -r, 0, 0 ],//位置
		            rotation: [ 0, Math.PI / 2, 0 ]//角度
		        },
		        {
		            position: [ r, 0, 0 ],
		            rotation: [ 0, -Math.PI / 2, 0 ]
		        },     
		        {
		            position: [ 0, 0,  r ],
		            rotation: [ 0, Math.PI, 0 ]
		        },
		        {
		            position: [ 0, 0, -r ],
		            rotation: [ 0, 0, 0 ]
		        },
		        {
		            position: [ 0,  r, 0 ],
		            rotation: [ Math.PI / 2, 0, Math.PI ]
		        },
		        {
		            position: [ 0, -r, 0 ],
		            rotation: [ - Math.PI / 2, 0, Math.PI ]
		        },
		    ];
		    for ( var i = 0; i < sides.length; i ++ ) {
		        var side = sides[ i ];
		        var element = document.getElementById("surface_"+i);
		        element.width = width+2; 
		        var object = new THREE.CSS3DObject( element );
		        object.position.fromArray( side.position );
		        object.rotation.fromArray( side.rotation );
		        that.scene.add( object );
		    }

		    that.renderer.setSize( window.innerWidth, window.innerHeight );
		    pano.home.appendChild( that.renderer.domElement );
		    pano.home.addEventListener( 'mousedown', that.onDocumentMouseDown, false );
		    pano.home.addEventListener( 'wheel', that.onDocumentMouseWheel, false );
		    pano.home.addEventListener( 'touchstart', that.onDocumentTouchStart, false );
		    pano.home.addEventListener( 'touchmove', that.onDocumentTouchMove, false );
		    window.addEventListener( 'resize', that.onWindowResize, false );
		   	pano.animate();
		},
		orientInit:function(){
			//var tip = document.getElementById('hhh');
		    var o = new Orienter();
		    o.onOrient = function (obj) {
		    	if(obj.lon>=180){
		            obj.lon = obj.lon-360
		        }
		        if(pano.oritag){
		        	pano.orienters.lon = obj.lon;
		    		pano.orienters.lat = obj.lat; 
		    		pano.oritag = false;
		        } else{
		        	pano.param.lon =  pano.param.lon- obj.lon+pano.orienters.lon;
			   	    pano.param.lat = pano.param.lat+obj.lat-pano.orienters.lat;  
			        pano.orienters.lon = obj.lon;
			    	pano.orienters.lat = obj.lat;  
		        }
		   	   /* tip.innerHTML =
                '<br>' + 'longitude:' + obj.lon +
                '<br>' + 'latitude:' + obj.lat*/
		    };
		    o.init();
		},
		onWindowResize:function(){
			pano.camera.aspect = window.innerWidth / window.innerHeight;
    		pano.camera.updateProjectionMatrix();
    		pano.renderer.setSize( window.innerWidth, window.innerHeight );
		},
		onDocumentMouseDown:function(event){
			//event.preventDefault();
    		pano.home.addEventListener( 'mousemove', pano.onDocumentMouseMove, false );
    		pano.home.addEventListener( 'mouseup', pano.onDocumentMouseUp, false );
		},
		onDocumentMouseMove:function(event){
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		    pano.param.lon -= movementX * 0.1;
		    pano.param.lat += movementY * 0.1;
		},
		onDocumentMouseUp:function(event){
			pano.home.removeEventListener( 'mousemove', pano.onDocumentMouseMove );
    		pano.home.removeEventListener( 'mouseup', pano.onDocumentMouseUp );
		},
		onDocumentMouseWheel:function( event ) {
		    pano.camera.fov += event.deltaY * 0.05;
		    pano.camera.updateProjectionMatrix();
		},
		onDocumentTouchStart:function(event){
			//event.preventDefault();
		    var touch = event.touches[ 0 ];
		    pano.touch.x = touch.screenX;
		    pano.touch.y = touch.screenY;
		},
		onDocumentTouchMove:function ( event ) {
		    event.preventDefault();
		    var touch = event.touches[ 0 ];
		    pano.param.lon -= ( touch.screenX - pano.touch.x ) * 0.1;
		    pano.param.lat += ( touch.screenY - pano.touch.y ) * 0.1;
		    pano.touch.x = touch.screenX;
		    pano.touch.y = touch.screenY;
		},
		animate:function() {
			var thisparam = pano.param;
		    requestAnimationFrame( pano.animate );
		    thisparam.lat = Math.max( - 85, Math.min( 85, thisparam.lat ) );
		    thisparam.phi = THREE.Math.degToRad( 90 - thisparam.lat );
		    thisparam.theta = THREE.Math.degToRad( thisparam.lon );
		   // console.log(thisparam.lon,thisparam.lat)
		    if(thisparam.lon>0){
			    var directionVal = Math.floor(thisparam.lon) % 360;
			}else{
				var directionVal = 360+Math.floor(thisparam.lon) % 360;
			}
			var depthVal = Math.floor(1800 - thisparam.lat *10);
		    $("#direction em").html(directionVal);
		    $("#depth em").html(depthVal);
		    pano.target3D.x = Math.sin( thisparam.phi ) * Math.cos( thisparam.theta );
		    pano.target3D.y = Math.cos( thisparam.phi );
		    pano.target3D.z = Math.sin( thisparam.phi ) * Math.sin( thisparam.theta );
		    pano.camera.lookAt( pano.target3D );
		    pano.renderer.render( pano.scene, pano.camera );
		}
	}

	/*
	   城市页
	*/
	var cityModel = {
		oW:"",
		oH:"",
		center:[567,455],
		index:1,
		errortips:{
			'bj':{
				bottom:"180px",
				left:"39px"
			},
			'sh':{
				bottom:"180px",
				left:"162px"
			},
			'cd':{
				bottom:"180px",
				left:"286px"
			},
			'gz':{
				bottom:"59px",
				left:"1px"
			},
			'sz':{
				bottom:"59px",
				left:"103px"
			},
			'nj':{
				bottom:"59px",
				left:"227px"
			},
			'hz':{
				bottom:"59px",
				left:"345px"
			},
		},
		rightNum:7,
		firstFlag:true,
		gif:[],
		gifpopo:[],
		init:function(){
			var that = this;
			var swiperFirst = true;
			if(isIos()){
				var bjpopogif = new frameAni($("#bjpopo"),30,100,5,5,640,640),
				shpopogif = new frameAni($("#shpopo"),30,100,5,5,640,640),
				gzpopogif = new frameAni($("#gzpopo"),20,100,5,5,640,640);
				that.gifpopo = [bjpopogif,shpopogif,gzpopogif];
			}
			var mySwiper = new Swiper ('.swiper-container', {
			    mousewheelControl : false,
			    allowSwipeToNext : false,
			    allowSwipeToPrev : false,
			    watchSlidesProgress : true,
			    speed:600,
			    preventClicks:false,
			    loop:true,
			    watchSlidesProgress: true,
				onInit: function(swiper){ 	
					
				},
				onSlideChangeEnd: function(swiper){ 
					var activeIndex = swiper.activeIndex;
					if(isIos()){
						if(swiperFirst){
							var bjgif = new frameAni($(".city.bj"),50,100,5,10,640,700),
								njgif = new frameAni($(".city.nj"),49,100,5,10,640,700),
								hzgif = new frameAni($(".city.hz"),49,100,5,10,640,700),
								shgif = new frameAni($(".city.sh"),51,100,5,10,640,700),
								szgif = new frameAni($(".city.sz"),48,100,5,10,640,700),
								cdgif = new frameAni($(".city.cd"),49,100,5,10,640,700),
								gzgif = new frameAni($(".city.gz"),50,100,5,10,640,700);
							that.gif = [gzgif,bjgif,njgif,hzgif,shgif,szgif,cdgif,gzgif,bjgif];
							swiperFirst = !swiperFirst;
						}
						$.each(that.gif,function(index,value){
							value.cancelAni();
						});
						that.gif[activeIndex].animates();
					}
					that.index = activeIndex;
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.host+window.location.pathname+"?city="+activeIndex,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });	
				}	
			});
			$("span.prev").bind(startevent,function(){
				mySwiper.slidePrev();
			});
			$("span.next").bind(startevent,function(){
				mySwiper.slideNext();
			});
			$("span.tohome").bind(startevent,function(){
				$(".home").show();	
				$(".model").css({"opacity":0});
				if(isIos()){	
					$.each(that.gifpopo,function(index,value){
						value.animates();
					});
					$.each(that.gif,function(index,value){
						value.cancelAni();
					});
				}
				h5Share.init({
	                title: "这次小粽子不是拿来吃的，而是拿来……",
	                desc: "去3D水下世界帮小粽子回家！",
	                url: window.location.host+window.location.pathname,
	                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
	            });	
			});
			$.each($(".canvas1"),function(key,value){
				that.ellipseOne(value.getContext('2d'),310,130,310,130);
			});

			$.each($(".canvas2"),function(key,value){
				that.ellipseTwo(value.getContext('2d'),310,130,310,130);
			});
			window.setTimeout(function(){
				$.each($("img.drag"),function(key,value){
					$(this).attr("_top",$(this).offset().top);
					$(this).attr("_left",$(this).offset().left);
					//var x1 = parseInt($(this).css("width"))/2+parseInt($(this).css("left")), y1 = parseInt($(this).css("height"))/2+parseInt($(this).css("top"));
					//var x2 = parseInt($(this).attr("_width"))/2+parseInt($(this).attr("_offetLeft")),y2 = parseInt($(this).attr("_height"))/2+parseInt($(this).attr("_offetTop"));
					//var distance =  Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
					//var ratio = (parseInt($(this).css("width"))-parseInt($(this).attr("_width")))/distance;
					//$(this).attr("_ratio",ratio);
				});	
			},100)	    
			$("img.drag").bind('touchstart', that.onTouchStart);
			$("img.drag").bind("touchmove", that.onTouchMove);
			$("img.drag").bind("touchend",that.onTouchEnd);
			$(".overlay1").bind(startevent,function(){
				$(this).hide();
			});
			$(".popo img").bind(startevent,function(){
				$(".model").css({"opacity":1});
				var index = $(this).attr("_index");
				$(".home").hide();	
				if(isIos()){
					$.each(that.gifpopo,function(index,value){
						value.cancelAni();
					});
				}
				if(index == 1){
					h5Share.init({
		                title: "这次小粽子不是拿来吃的，而是拿来……",
		                desc: "去3D水下世界帮小粽子回家！",
		                url: window.location.host+window.location.pathname+"?city="+index,
		                img: "http://nos.netease.com/house-public/88a77a22b7aa0054b66aa459a0158680.jpg"
		            });
				}
				mySwiper.slideTo(index,100);
			});
			$(".overlay3").bind(startevent,function(){
				$(this).hide();
				that.firstFlag = false;
			});
			if(cityId){
				mySwiper.slideTo(cityId);
			}

		},
		ellipseOne:function(context, x, y, a, b){
			var r = (a > b) ? a : b;
		    var ratioX = a / r;
		    var ratioY = b / r;
		    context.scale(ratioX, ratioY);
		    context.beginPath();
		    context.arc(x / ratioX, y / ratioY, r, 0,  Math.PI, false);  
		    context.strokeStyle = '#82c7db';
	        context.lineWidth = 1;
	        context.stroke();
	        context.closePath();
		},
		ellipseTwo:function(context, x, y, a, b){
			var r = (a > b) ? a : b;
		    var ratioX = a / r;
		    var ratioY = b / r;
		    context.scale(ratioX, ratioY);
		    context.beginPath();
		    context.arc(x / ratioX, y / ratioY, r, Math.PI, 2 * Math.PI, false);
		    context.strokeStyle = '#82c7db';
	        context.lineWidth = 1;
	        context.stroke();
	        context.closePath();
		},
		onTouchStart:function(e){
		    var touches = e.originalEvent.changedTouches[0];
		    cityModel.oW = touches.clientX - $(this).offset().left;
		    cityModel.oH = touches.clientY - $(this).offset().top;
		    //阻止页面的滑动默认事件
		    document.addEventListener("touchmove",cityModel.defaultEvent,false);
		},
		onTouchMove:function(e){
			var touches = e.originalEvent.changedTouches[0];
		    var oLeft = touches.clientX - cityModel.oW;
		    var oTop = touches.clientY - cityModel.oH;
		    if(oLeft < 0) {
		    	oLeft = 0;
		    }else if(oLeft > document.documentElement.clientWidth - $(this)[0].offsetWidth) {
		   	 	oLeft = (document.documentElement.clientWidth - $(this)[0].offsetWidth);
		    }
		    $(this).css({"top":oTop + "px"});
		    $(this).css({"left":oLeft + "px"});
		   // cityModel.scales($(this));
		},
		onTouchEnd:function(e){
			var eleTop = parseInt($(this).css("top"));
			var eleLeft = parseInt($(this).css("left"));
			var x = parseInt($(this).css("width"))/2+parseInt($(this).css("left")), y = parseInt($(this).css("height"))/2+parseInt($(this).css("top"));
			var top = parseInt($(".laybox3").css("top")),y11 = top-50,y12 = top+120;
			if(y>=y11&&y<=y12&&x>=405&&x<=575){
				var city = $(this).attr("_city");
				var cityImg = $("li.swiper-slide").eq(cityModel.index).attr("_city");
				if(city == cityImg){
					$(this).animate({
						"width": $(this).attr('_width') + "px",
						"left": $(this).attr('_offetLeft') + "px",
						"top": $(this).attr('_offetTop') + "px"
					},200,function(){	
						var $img = $("li.swiper-slide[_city="+city+"]").find(".locat img");
						$img.attr("src",$(this).attr("src"));
						$img.css({"width":$(this).attr("_width")+"px","margin-top":$(this).attr("_marginTop")+"px"})
						$(this).remove();
					});
					$(".right"+city).show();
					cityModel.rightNum--;
					$("#tips em").html(cityModel.rightNum);
					if(cityModel.rightNum == 0){
						$(".overlay1").show();
					}
					$("#rightm")[0].play();
					//mainfun.audioAutoPlay2('rightm');
					//$("#triright").trigger(startevent);
				}else{
					$(this).css({"top":$(this).attr('_top') + "px"});
			   	 	$(this).css({"left":$(this).attr('_left') + "px"});
			    	$(this).css({"width":$(this).attr('_widthOrgin') + "px"});
			    	$("#errortips").css({"bottom":cityModel.errortips[city].bottom,"left":cityModel.errortips[city].left}).show();
					window.setTimeout(function(){
						$("#errortips").hide();	
					},1000);
					$("#errorm")[0].play();
					//mainfun.audioAutoPlay2('errorm');
					//$("#trierror").trigger(startevent);
				}
			}else{
				$(this).css({"top":$(this).attr('_top') + "px"});
			    $(this).css({"left":$(this).attr('_left') + "px"});
			    $(this).css({"width":$(this).attr('_widthOrgin') + "px"});
			    $("#errorm")[0].play();
			}    
			document.removeEventListener("touchmove",cityModel.defaultEvent,false);
		},
		defaultEvent: function(e) {
		   e.preventDefault();
		},
		scales:function(obj){
			var $obj = obj;
			var x1 = parseInt($obj.css("width"))/2+parseInt($obj.css("left")), y1 = parseInt($obj.css("height"))/2+parseInt($obj.css("top"));
			var x2 = parseInt($obj.attr("_width"))/2+parseInt($obj.attr("_offetLeft")),y2 = parseInt($obj.attr("_height"))/2+parseInt($obj.attr("_offetTop"));
			var distance =  Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
			//console.log(distance);
			var width = parseInt($obj.attr("_ratio")*distance) +parseInt($obj.attr("_width"));
			$obj.css({"width":width + "px"});
		}
	}
	mainfun.init();
	//pano.init();
	//cityModel.init();

})(jQuery)
