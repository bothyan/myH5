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
		var percent=parseInt(count/imglength*100)+"%";
		// 显示百分比
	 	this.button.html(percent);
		if(count==imglength){
			// loading结束
			$("#loading-img").html("");	
			this.button.html("");		
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

	/*  音乐转动
	** dom   音乐转动dom
    ** bgm   音乐资源dom
	*/
	var musicRotate = {
		dom:$("#music-icon"),
		bgm:$("#bgm"),
		musicTnter:null,
		angle:0,
		rotateTag:true,
		init:function(){
			var that = this;
			that.bgm[0].play();
			that.dom.bind(startevent,function(){
				if(that.rotateTag){
					window.clearInterval(that.musicTnter);
					that.bgm[0].pause();
					that.rotateTag = false;
				}else{
					that.animate();
					that.bgm[0].play();
					that.rotateTag = true;
				}
			});
			that.animate();
		},
		animate:function(){
			var that = this;
			that.musicTnter = setInterval(function(){
			    that.angle +=3;
			    that.dom.rotate(that.angle);
			}, 50);
		}
	}

	/*  
		翻书page
	*/
	var Page = {		
	    index:0,	
		config : {
			$bookBlock : $( '#bb-bookblock' ),
			$navNext : $( '#next' ),
			$navPrev : $( '#prev' ),
			$nav : $("#nav-bookblock").find("p")
		},
		init : function() {
			this.config.$bookBlock.bookblock( {
				speed : 1000,
				shadowSides : 0.1,
				shadowFlip : 0.7
			} );
			//$( '#prev' ).css({"opacity": 0});
			this.initEvents();
		},
		initEvents : function() {
			var config = this.config;
			var $slides = config.$bookBlock.children();
			var that = this;
			// add navigation events
			config.$navNext.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'next' );
				if(that.index == 1){
						var scrollTop = $(".content1 .bb-item .layye1>div").scrollTop();
						$(".content1 .bb-page .layye1>div").scrollTop(scrollTop);
					}
				if(that.index == 2){
					var scrollTop = $(".content1 .bb-item .layye2>div").scrollTop();
					$(".content1 .bb-page .layye2>div").scrollTop(scrollTop);
				}
				that.index++;
				window.setTimeout(function(){
						$(".content1 .bb-item .layye1>div").scrollTop(0);
						$(".content1 .bb-item .layye2>div").scrollTop(0);
					},1010)
				that.animates();
			} );

			config.$navPrev.on( 'click touchstart', function() {
				if(that.index>0){
					config.$bookBlock.bookblock( 'prev' );
					if(that.index == 1){
						var scrollTop = $(".content1 .bb-item .layye1>div").scrollTop();
						$(".content1 .bb-page .layye1>div").scrollTop(scrollTop);
					}
					if(that.index == 2){
						var scrollTop = $(".content1 .bb-item .layye2>div").scrollTop();
						$(".content1 .bb-page .layye2>div").scrollTop(scrollTop);
					}
					that.index--;
					if(that.index<4){
						$( '#next' ).css({"opacity": 1});
					}
					if(that.index<1){
						//$( '#prev' ).css({"opacity": 0});
						that.index = 0;
					}
					window.setTimeout(function(){
						$(".content1 .bb-item .layye1>div").scrollTop(0);
						$(".content1 .bb-item .layye2>div").scrollTop(0);
					},1010)
				}else{
					$("#cover1").show();
					$("#cover2").show();
					$("#go-index").hide();
					$("#cover1").animate({
						left:"0",
					},200,function(){
						$(".fenge").show();
						//$(".netease").show();
						$(".content1").hide();
					});
					$("#cover2").animate({
						left:"0",
					},200);	
				}	
			} );

			config.$nav.each( function( i ) {
				$( this ).on( 'click touchstart', function( event ) {
					var indexNow = that.index;
					that.index = i+1;
					var $dot = $( this );
					config.$bookBlock.bookblock( 'jump', i + 2 );
					that.animates();
					if(indexNow == 1){
						var scrollTop = $(".content1 .bb-item .layye1>div").scrollTop();
						$(".content1 .bb-page .layye1>div").scrollTop(scrollTop);
					}
					if(indexNow == 2){
						var scrollTop = $(".content1 .bb-item .layye2>div").scrollTop();
						$(".content1 .bb-page .layye2>div").scrollTop(scrollTop);
					}
					window.setTimeout(function(){					
						$(".content1 .bb-item .layye1>div").scrollTop(0);
						$(".content1 .bb-item .layye2>div").scrollTop(0);
					},1010)
					return false;
				} );
			} );
		},
		animates:function(){
			var that = this;
			var $item = $(".bb-item").eq(that.index);
			var tag = $item.attr("_tag");
			if(tag == 0){
				var $pageback = $(".bb-back").eq(1),$pagefront = $(".bb-front").eq(1);
				$pageback.find(".item-kuang").hide();
				$pageback.find(".ye").hide();
				$pageback.find(".kuang7").hide();
				$pageback.find(".topano").hide();
				$pageback.find(".share").hide();
				$pagefront.find(".item-kuang").hide();
				$pagefront.find(".ye").hide();
				$pagefront.find(".kuang7").hide();
				$pagefront.find(".topano").hide();
				$pagefront.find(".share").hide();
			}
			if(that.index>0){
				//$( '#prev' ).css({"opacity": 1});
			}
			if(that.index>3){
				$( '#next' ).css({"opacity": 0});
				that.index = 4;
			}	
			window.setTimeout(function(){
				if(tag == 0){
					$item.attr("_tag",1);
					if(that.index == 1){
						$('ul.ye1').find("li").each(function(i){
							var id = $(this).attr("id");
							var classStr = id+"-anim";
							$(this).addClass(classStr);
						    });
						    $(".kuang4").addClass("kuang4-anim");
					};
					if(that.index == 2){
						$('ul.ye2').find("li").each(function(i){
							var id = $(this).attr("id");
							var classStr = id+"-anim";
							$(this).addClass(classStr);
						    });
						    $(".kuang5").addClass("kuang5-anim");
					};
					if(that.index == 3){
						$('ul.ye3').find("li").each(function(i){
							var id = $(this).attr("id");
							var classStr = id+"-anim";
							$(this).addClass(classStr);
						    });
						    $(".kuang6").addClass("kuang6-anim");
					};
					if(that.index == 4){	
						$(".kuang7").addClass("kuang7-anim");
						$(".p71").addClass("p71-anim");  						    
						    $(".p72").addClass("p72-anim");
						    $(".topano").addClass("topano-anim");
						    $(".share").addClass("share-anim");
					};
				}					
			},1010)
		}
	};

	/*
		古风主函数
	*/
	var mainfun1 = {
		width:750,
		coverH1:700,
		coverH2:780,
		music:true,
		load:false,
		init:function(){		
			h5Share.init({
                title: "全景临沂如此惊艳！",
                desc: "万古沂河川流不息，今日临沂亦被称为“水城”。720度全景，纵观古今临沂美景",
                url: window.location.href,
                img: "http://nos.netease.com/house-public/534b9ac2555ad8a5af5628c0d4a252d9.png"
            });
			Page.init();
			this.handle();	
			this.loadfirst();	
			if($(window).height()<1000){
				simpScroller($(".content1")[0],{
					    verticalScroll: true,         
					    horizontalScroll: false,      
					    hideScrollBar: true
					}
				);	
			}
		},
		handle:function(){
			var that = this;
			$('body').on('touchmove', function (event) {
			    event.preventDefault();
			});
			document.addEventListener("WeixinJSBridgeReady", function () { 
				$("#bgm")[0].play();
			}, false); 
			if (window.addEventListener) {
				simpScroller($(".layye1")[0],{
					    verticalScroll: true,         
					    horizontalScroll: false,      
					    hideScrollBar: true
					}
				);		
				simpScroller($(".layye2")[0],{
					    verticalScroll: true,         
					    horizontalScroll: false,      
					    hideScrollBar: true
					}
				);				
			}
			$("#go-index").bind(startevent,function(){
				$("#cover1").show();
				$("#cover2").show();
				$("#go-index").hide();
				$("#cover1").animate({
					left:"0",
				},200,function(){
					$(".fenge").show();
					//$(".netease").show();
					$(".content1").hide();
				});
				$("#cover2").animate({
					left:"0",
				},200);	
			});
			$(".bb-item .ye").find('li').bind(startevent,function(){
				var $lipop = $(this).find('.lipop');
				var pop = $(this).attr("_pop");
				$lipop.show();;
				var top = $lipop.offset().top,
					left = $lipop.offset().left,
					width = $lipop.width(),
					height = $lipop.height();
				var $div = $("<div></div>");	
				$("body").append($div);	
				$div.css({"position":"fixed","top":top+"px","left":left+"px","width":width+"px","height":height+"px","z-index":"200","background":"#f6e4d3","box-shadow":"inset 0px 0px 50px #CCC"});
				$div.animate({
					top: 0,
					left:0,
					width:"100%",
					height:"100%"
				},500,function(){
					$("#"+pop).fadeIn(200,function(){
						$div.remove();
					});000
				})
			});
			$("#share").bind(startevent,function(){
				h5Share.share();
				if(isWeiXin()){
					$("#shareBoxImgLoading").remove();
					//$("#sharetips").show();
				}         
			});
			$("#sharetips").bind(startevent,function(){
				$("#sharetips").hide();
			});
			$(".pop .close").bind(startevent,function(){
				var $pop = $(this).closest(".pop");
				var num = $(this).attr("_num");
				var $li  = $("#li"+num);
				var $lipop = $li.find('.lipop');
				var $div = $("<div></div>");
				var liWidth = $li.width(),liHeight = $li.height(),liTop = $li.offset().top,liLeft = $li.offset().left;
				$div.css({"position":"fixed","top":0,"left":0,"width":"100%","height":"100%","z-index":"200","background":"#f6e4d3","box-shadow":"inset 0px 0px 50px #CCC"});
				$pop.hide();
				$("body").append($div);	
				$div.animate({
					top: liTop,
					left:liLeft,
					width:liWidth,
					height:liHeight
				},500,function(){
					$lipop.hide();
					$div.remove();
				})		
			});	
			$("#go1").bind(startevent,function(){
				if(!that.load){
					$("#guan").hide();
					var options = {
						preLoadingImgData:[
							'b1250acc3860c7b78f782e8427ee00a1.png',//arrow
							'8d7b5577362885806f18917970924f19.png',//bg2 
							'a2c6a1b1609d46c6c669cfd04da17843.png',//bgtop
							'dcaa8fae37b00f4e66cd9d3d5b760e94.png',//bgbottom	
							'5b255b918681b87dd5ebb0c7aed055c9.png',//zengzi1	
							'857deb240020b4faa32e50bf46558bd0.png',//zengzi2
							'1a1e5c0fa215ce3738f83faf3bafec7b.png',//kuang
							'c512f5bc37cfb2baa546572973507f44.png',//word1
							'640a6e17b8327575fce1980e73bfa08f.png',//jindu1
							'6ca566f75b1f6d484cd534d7a1fb2cae.png',//jindu2
							'745a30840e24fc000320d00ee3c61879.png',//jindu3
							'7bc21007e23fd58b35c1cfd6fc49a0e6.png',//kuang4
							'bf5e1bb6f0ed79d30ed55295f26a5067.png',//p4
							'64a5bf17c5b560ccc5e0ffd03c2c3bf8.png',//kuang5
							'8e744f5e85ae37b74cbc82b103d498f1.png',//p5
							'95d6d587a7b901011394b9d1dcdd5bab.png',//kuang6
							'f3d7aa865730e872c1414d14cdd3b4c1.png',//p6
							'79d53d08010273ffadaed0a14e52b06a.png',//ye1
							'79d53d08010273ffadaed0a14e52b06a.png',//ye2
							'6a2dd412475bfb09b3a7818d94b0fbc9.png',//ye3
							'a977ecd8d9308f898184bc71e63adffd.png',//layyan
							'ba36766844507819753f9a621ed8b2cc.png',//bg7
							'8849760f0c8f0d721fe2f68a1089abce.png',//kuang7
							'9b1bcb53792f4c2c32816566e1c24ae2.png',//word7
							'68156d492751cfe08cae972f6782b299.png',//topano
							'd7c375abfa53bd299146de915d87ab51.png',//toshare
							'78b33d43ad96eab215ee744a4eac9792.png',//bg41
							'f44e20ac43c0cfeb1d9ac4225b4a4d64.png',//img41
							'430d09e83ce9cad18c92bbccf58f8c95.png',//close
							'50f527a0efb3ab21cd4a43907d23f41f.png',//name1
							'4d3c225b097858115bc74144f72de9e5.png',//word41
							'21cc14b03d83d90bb437fbf7d6fd602e.png',//bg42
							'd715b660599b426e53814f285dbeeeb5.png',//img42
							'c5a1a9824f39f2e65bfd4150f1041eec.png',//word42
							'f005ee83eefde8868e70a0e9cc201971.png',//bg43
							'9ebc4ff0503d063556cd0e97139e066c.png',//img43
							'8bbc06784bb810a45802d332d7865375.png',//word43
							'2ce129228ba28025439b88c12b88994c.png',//bg44
							'57551757494433fb0276769314c2dba0.png',//img44
							'6908362e30c3dc876b8e35d702decb1d.png',//word44
							'e04893f19ec4dfac4fa1cf1b593abcb0.png',//bg45
							'b812d667fb35669e31624621d42eabb4.png',//img45
							'5d5a2f8b1813a802360f1d6d6168e296.png',//word45
							'e04893f19ec4dfac4fa1cf1b593abcb0.png',//bg46
							'b812d667fb35669e31624621d42eabb4.png',//img46
							'43cb4659cb15d0b3ee7fd28c99cf9db6.png',//word46
							'bbead0f31dc561526b390fa7778d6dc7.png',//bg51
							'1925838d52824014c3bad8718a26b671.png',//word51
							'eb96105530492a2f4d091872e29b544b.png',//bg52
							'd210dcd090396078d4fc0820f72b45e4.png',//word52
							'd4144d9046079d7634ba577e85bf3a64.png',//bg53
							'fbfddef292956c7e51cfaefa1539f84e.png',//word53
							'aad7a415b9953275a37a0f994970c025.png',//bg54
							'0750cf7b25aa9dcb3aad24af63fac6bb.png',//word54
							'3034eb3e7e09a451c3dee0dd00c82e83.png',//bg55
							'51757b2bfcce9211578a35d89a5a05b2.png',//word55
							'd39dd8bcfe9f70477b5e8e4b4ed9274b.png',//bg56
							'95c0e7e5d6190cc1ab8bf2db4132fd66.png',//word56
							'a001d0aa48a0ae22b4e715fc40cd8010.png',//bg57
							'0fb895943d1307be569097832dda495b.png',//word57
							'380edff34bb814c9cfaaed48caade964.png',//word61
							'b6cbaf36bcb5641e3e5f3a5565085117.png',//word62
							'b7e878dcb0aea71f065cd4cadd92018a.png',//word63
							'4734e77dde2ab98f41bdee2fbe384fc3.png',//img611
							'a7778ac4633e4b3d5a7b485391cabc3a.png',//img612
							'3e6492ba496f9f6a46377276809447e3.png',//img621
							'0491a4cd3a1c630931c54315e182e945.png',//img622
							'205cc30e4a97e22b6c75c0b25adaaaa8.png',//img631
							'78eebf2141dbba6390272f4787553dd4.png'//img632
						],
						button:$("#go1"),
						callback:function(){
							that.start();
						}
					};
					new preLoadimg(options).init();
					that.load = true;
				}else{
					that.start();
				}
			});		
			$("#music").bind(startevent,function(){
				if(that.music){
					that.music = false;
					$("#bgm")[0].pause();	
					$(this).removeClass("musicon").addClass("musicoff");
				}else{
					that.music = true;
					$("#bgm")[0].play();	
					$(this).removeClass("musicoff").addClass("musicon");
				}			
			});		
			$("#topano").bind(startevent,function(){	
				$(".content1").hide();	
				$(".fenge").show();
				//$(".netease").show();	
				$("#cover1").show();
				$("#cover2").show();	
				$("#go-index").hide();		
				$("#cover1").animate({
					left:"0",
				},200);
				$("#cover2").animate({
					left:"0",
				},200,function(){
					$("#go2").trigger(startevent);				
				})
			});
		},
		start:function(){
			$(".fenge").hide();
			//$(".netease").hide();
			$(".content1").show();
			$("#guan").show();
			$("#cover1").animate({
				left:"-750px",
			},200,function(){
				$("#cover1").hide();
				$("#cover2").hide();
				$("#go-index").show();
			});
			$("#cover2").animate({
				left:"750px",
			},200);		
		},
		calpage:function(){
			var that = this;
			var wHeight = $(window).height();
			var	coverH = that.coverH1+that.coverH2-1200;
			if(wHeight<=1200){			
				var coverh1 = 700*wHeight/1200;							
				var coverh2 = wHeight-coverh1+coverH;
				var fengT = 465-700+coverh1;
				$(".cover1").css({"height":coverh1+"px"});
				$(".cover2").css({"height":coverh2+"px"});
				$(".fenge").css({"top":fengT+"px"});
			}
			if(wHeight>1200){
				var coverh1 = 700+wHeight-1200;	
				var fengT = 465-700+coverh1;
				$(".cover1").css({"height":coverh1+"px"});
				$(".fenge").css({"top":fengT+"px"});	
			}
			window.setTimeout(function(){
				$("#bloading").remove();
			},300)	
		},
		loadfirst:function(){
			var that = this;
			var options = {
				preLoadingImgData:[
					'bd5dfd8c7498c0e60cc02f72848399cd.png',//netease
					'28d6a6a99e9242ff8eb2dbf12e1c2882.png',//cover1
					//'ddfc8a66866a1b73f402ae49694fd310.png',//load1
					'7c95f1c6ca9e589579b28bc9b470b683.png',//fenge
					'54d9c14d49729da7b0ed1c8abf2c5d4a.png',//cover2
					//'cf3f26c2aa2c99e27ecbefa6637bbc17.png',//load2
					'2847eced4165651a579d33500cd824dd.png',//musicon
					'474b5b7fd8744d198ea864de33058e10.png',//musicoff
					'5372877b2ffc252acc5de155c8ec8e5d.png',//wifi
					'c82c0c180a644780e9ab7bad33b32746.png',//guan
					'589552574d88435392d3761219165e68.png'//shang
				],
				button:$(".loading"),
				callback:function(){
					that.calpage();
				}
			};
			new preLoadimg(options).init();
		}
	}

	/*
		现代全景主函数
	*/
	var mainfun2 = {
		width:750,
		music:true,
		altasTag:false,
		ceng:0,
		load:false,
		init:function(){		
			this.handle();
		},
		handle:function(){
			var that = this;
			if (window.addEventListener) {
				simpScroller($("#lyareas")[0],{
					    verticalScroll: true,         
					    horizontalScroll: false,      
					    hideScrollBar: true
					}
				);		
				$(".thumbs").each(function(){
					simpScroller($(this)[0],{
					    verticalScroll: false,         
					    horizontalScroll: true,      
					    hideScrollBar: false
					});

				})							
			}
			$("#go2").bind(startevent,function(){	
				if(!that.load){	
					$("#shang").hide();
					var options = {
						preLoadingImgData:[
							'0fc8c23799ab3fd68c54393853f73561.jpg',//电视塔
							'6af82dd06c9ef0b593dc7d7757bb3baa.jpg',//凤凰广场 
							'b58601e00eef9334afdb1f4d8473b84c.jpg',//华东革命烈士陵园
							'fa33d1328c5155f2a29d473f66755ce4.jpg',//滨河风景区	
							'fb478b47082110c2f6baef35605fa211.jpg',//梦幻彩桥	
							'94d00f775abf6a43cf68e8205966eca2.jpg',//三河口
							'4fe9a6bf36b8ea7b10ee43c32d786b35.jpg',//书法广场
							'385c79a929c752cb631030b22803ce68.jpg',//书圣阁
							'd94969eb3cbbff3b0f1c5f479bcfae07.jpg',//万家灯火
							'19bc4a652d6702b8cf4586c8872815fd.jpg',//王羲之故居洗砚池
							'2204c164b7d737bc647d170ebc8404fb.jpg',//文化广场
							'1c38ac2f1a0dc7cf312f34075330bc29.jpg',//五洲湖
							'4ee08692ee3bbd9610561a8f833b9568.jpg',//沂河两岸
							'40dcf4afdde16e7021764ffcbd2bc253.jpg',//沂河新桥
							'ae7c3e7bccaa0e19e8ea33fcd9f38096.jpg',//园博园
							'4a0d1b587097aaae27ec61587e3909c1.png',//logo
							'0e2c870c1415e3b9c37f380872995faf.png',//jianjie
							'74e43acdbbbfb058fdafa95808b80b5c.png',//atlas_icon
							'd80e6ecb8d7a2d6da97a18d4e774fd9d.png',//meitubg
							'13e5ab061305729c68f1db8973a261d0.png',//theme
							'6aec0d06be8b6cb266b3b22b3866486e.png',//buttons
							'3a1c477e59906504fe31d46129c1f6f7.png',//close2
							'a2a1bb8fd1da6762f1051f35d61fb197.png',//meitu
							'eca647b6c96f3d9863801e6ca9c82015.png',//poptitle
							'b23447ddefdebf8daacfef65edebb391.png',//zhidaole
							'e72b2ef65921fc2bd637cb67e9242ed3.png',//wordbg
							'b0737366b94c19bccf12df639274fa41.png',//closeword
							'4a6557fe8c4a996baecb85640dee39a9.png',//fanhui
							'8e38797d3825fc3829d61fe997425a34.png',//altclose
							'75bd4a2850bffa52fd0b01c9a951c8d6.png',//thumbs_botton
							'81e9fa76e91fb6ef146d3f73e894f6e3.png'//updown
						],
						button:$("#go2"),
						callback:function(){
							that.start();
						}
					};
					new preLoadimg(options).init();
					that.load = true;
				}else{
					that.start();
				}	
			});	
			$("#jianjie").bind(startevent,function(){
				$("#pop-jianjie").show();
			});
			$("#pop-jianjie .zhidaole").bind(startevent,function(){
				$("#pop-jianjie").hide();
			});
			var wHeight = $(window).height();
			var lyareasH = wHeight-540;
				lyareasH = parseInt(lyareasH/95)*95+20;
			var meituclick = false;
			$("#lyareas").css({"height":lyareasH+"px"});
			$("#thumbs_botton").bind(startevent,function(){
				var der = $(this).attr("_der");
				if(der == "up"){
					$(this).find("div").addClass("down").removeClass("up");
					$(this).attr("_der","down");
					$(".thumbs").animate({
						bottom:"-220px",
					},200);
					$(this).animate({
						bottom:0,
					},200);
				}else{
					$(this).find("div").addClass("up").removeClass("down");
					$(this).attr("_der","up");
					$(".thumbs").animate({
						bottom:0,
					},200);
					$(this).animate({
						bottom:"220px",
					},200);
				}
			});
			$("#logo").bind(startevent,function(){
				$(".panolay").show(); 
				$("#music").hide();
				$(".panolay").animate({
					left:0,
				},200);
			});
			$("#right-close").bind(startevent,function(){
				$(".panolay").animate({
					left:"-750px",
				},200,function(){
					$(".panolay").hide();
					$("#music").show();
					meituclick = false;
				})
				
			});
			$("#meitu").bind(startevent,function(){
				$(".swiper-wrapper").show();
				meituclick = true;
				if(!that.altasTag){
					that.swiper();
					that.altasTag = true
				}
			});
			$("#altas").bind(startevent,function(){
				$(".swiper-wrapper").show();
				$("#music").hide();
				if(!that.altasTag){
					that.swiper();
					that.altasTag = true
				}
			});
			$(".popword .wordclose").bind(startevent,function(){
				$(this).closest(".popword").hide();
				$("#music").show();
			});
			$(".popword .know").bind(startevent,function(){
				$(this).closest(".popword").hide();
				$("#music").show();
			});
			$(".altclose").bind(startevent,function(){
				$(".swiper-wrapper").hide();
				if(!meituclick){
					$("#music").show();
				}	
			});
			$("#fenxiang").bind(startevent,function(){
				h5Share.share();
				if(isWeiXin()){
					$("#shareBoxImgLoading").hide();
					//$("#sharetips").show();
				}			
			});
			$("#lyareas li").bind(startevent,function(){
				var scene = $(this).attr("_scene");
				window.getScene(scene);
				if($(".thumbs_"+scene).length){
					$(".thumbs").hide();
					$(".thumbs_"+scene).show();
					$("#thumbs_botton").find("div").addClass("up").removeClass("down");
					$("#thumbs_botton").attr("_der","up");
					$("#thumbs_botton").show();
					$(".thumbs").css({"bottom":0})
				}
				that.ceng = 1;
				$("#logo").hide();
				$("#jianjie").hide();
				$("#fanhui").show();
				$(".panolay").animate({
					left:"-750px",
				},200,function(){
					$(".panolay").hide();
					$("#music").show();
				})
			});
			$(".thumbs ul").each(function(){
				var length = $(this).find("li").length;
				var width = length*210+10;
				$(this).css({"width":width+"px"});
				var thumbs = $(this).closest(".thumbs")[0];
				var $li = $(this).find("li");
				$li.each(function(){
					var title = $(this).find("img").attr("_title");
					var $p = $("<p>"+title+"</p>");
					$(this).append($p);
				})	
			});
			$("#fanhui").bind(startevent,function(){
				if(that.ceng == 1){
					window.getScene("scene_ly0");		
					$("#fanhui").hide();
					$("#logo").show();
					$("#jianjie").show();
				}else{
					window.getScene("scene_ly01");	
					that.ceng = 1;	
				}
				$("#thumbs_botton").hide();
				$(".thumbs_botton").css({"bottom":"220px"});
				$(".thumbs").hide();
				$(".thumbs li").removeClass("select");
				$(".thumbs ul").each(function(){
					$(this).find("li").eq(0).addClass("select");
				})
			});
			$(".thumbs li").bind(startevent,function(){
				var scene = $(this).find("img").attr("_scene");
				var title = $(this).find("img").attr("_title");
				window.getScene(scene);
				//$(this).closest(".thumbs").find('p').html(title);
				$(this).closest(".thumbs").find('li').removeClass("select");
				$(this).addClass("select");
				
			});
			/*$("#music").bind(startevent,function(){
				if(that.music){
					that.music = false;
					$("#bgm")[0].pause();	
					$(this).removeClass("musicon").addClass("musicoff");
				}else{
					that.music = true;
					$("#bgm")[0].play();	
					$(this).removeClass("musicoff").addClass("musicon");
				}			
			});	*/	
			$("#togudai").bind(startevent,function(){	
				$(".content2").hide();	
				$(".fenge").show();
				//$(".netease").show();
				$(".panolay").css({"left":"-750px"});	
				$("#music").show();
				$("#cover1").show();
				$("#cover2").show();	
				$("#go-index").hide();		
				$("#cover1").animate({
					left:"0",
				},200);
				$("#cover2").animate({
					left:"0",
				},200,function(){
					$("#go1").trigger(startevent);	
				})
			});
		},
		swiper:function(){
			var mySwiper = new Swiper ('.swiper-container', {
	        	direction : 'vertical',
			    speed:600,
				onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
				  	$(".swiper-slide").eq(0).addClass("se_animted");		
				},
				onSlideChangeStart: function(swiper){ 
					var activeIndex = swiper.activeIndex;	
					$(".swiper-slide").removeClass("se_animted");
					var $section = $(".swiper-slide").eq(activeIndex);
					var tag = $section.attr("_tag");
					$section.addClass("se_animted");			
		        }
			});
		},
		start:function(){
			$(".fenge").hide();
			//$(".netease").hide();
			$(".content2").show();
			$("#shang").show();
			this.swiper();	
			$("#cover1").animate({
				left:"-750px",
			},200,function(){
				$("#cover1").hide();
				$("#cover2").hide();
				$("#go-index").hide();
			});
			$("#cover2").animate({
				left:"750px",
			},200)		
			embedpano({swf:"tour.swf", xml:"tour.xml", target:"pano", html5:"auto", mobilescale:1.0, passQueryParameters:true});
		}
	}	

	mainfun1.init();
	mainfun2.init();

	window.showmsg = function(str){
		$("#"+str).show();
		$("#music").hide();
	}

/*	var currentScene = ["scene_ly0"];

	function prevScene(){
		var el = currentScene[currentScene.length-1];
		getScene(el);	
		if(currentScene.length>1){
			currentScene.pop();
		}	
	}*/

	window.changeScene = function(n){	
		if($(".thumbs_"+n).length){
			$("#thumbs_botton").find("div").addClass("up").removeClass("down");
			$("#thumbs_botton").attr("_der","up");
			$("#thumbs_botton").show();
			$(".thumbs").css({"bottom":0});
			$(".thumbs").hide();
			$(".thumbs_"+n).show();
		}
		if(n == "scene_10" || n == "scene_20" || n == "scene_30" || n == "scene_40" || n == "scene_50" || n == "scene_60"){
			mainfun2.ceng = 2;
		}else{
			mainfun2.ceng = 1;
		}
		
		window.setTimeout(function(){
			$("#logo").hide();
			$("#jianjie").hide();
			$("#fanhui").show();
		},1000)	
	}

	window.getScene = function(n){
		var krpano = document.getElementById("krpanoSWFObject");
		var sc="loadscene("+n+")"
		krpano.call(sc);
	}

})(jQuery)
