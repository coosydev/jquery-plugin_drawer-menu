/* Drawer-menu
 * varsion : v1.0.0
 * date    : 2014-01-23
 * http://www.coosy.co.jp/
 * Copyright (c) 2014 COOSY inc.inc */
(function($){
	var defalut_name = 'panels';
	var $opened = null;		// $opened drawer menu
	var moving  = false;	// Moving drawer menu
	var resizeTimer = false;
	
	var privateMethods = {
		scroll : function(expr){
			var box = $(expr)[0];
			var touchStartPositionX;
			var touchStartPositionY;
			var touchMovePositionX;
			var touchMovePositionY;
			var moveFarX;
			var moveFarY;
			var startScrollX;
			var startScrollY;
			var moveScrollX;
			var moveScrollY;

			box.addEventListener("touchstart",touchHandler,false);
			box.addEventListener("touchmove",touchHandler,false);

			function touchHandler(e){
				var touch = e.touches[0];
				if(e.type == "touchstart"){
					touchStartPositionX = touch.pageX;
					touchStartPositionY = touch.pageY;
					//タッチ前スクロールをとる
					startScrollX = $(expr).scrollLeft();
					startScrollY = $(expr).scrollTop();
				}
				if(e.type == "touchmove"){
					e.preventDefault();
					//現在の座標を取得
					touchMovePositionX = touch.pageX;
					touchMovePositionY = touch.pageY;
					//差をとる
					moveFarX = touchStartPositionX - touchMovePositionX;
					moveFarY = touchStartPositionY - touchMovePositionY;
					//スクロールを動かす
					moveScrollX = startScrollX +moveFarX;
					moveScrollY = startScrollY +moveFarY;
					$(expr).scrollLeft(moveScrollX);
					$(expr).scrollTop(moveScrollY);
				}
			}
		},
		resize : function(expr, name, value){
			return (0 < value.lastIndexOf('%')) ?
					(parseInt($(expr)['outer' + name.charAt(0).toUpperCase() + name.slice(1)]()) * parseInt(value) * 0.01) + 'px' : value;
		},
		tapToClose : function(){
			if($opened){ $opened.drawer_menu("close"); return false; }
		},
		resizeToClose : function() {
			if (resizeTimer !== false) {
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout(function() {
				if($opened){ $opened.drawer_menu("close"); }
			}, 200);
		},
		execute_child : function(action, callback){
			if(moving) return false;
			var $children, $child, $that, $ather, $menu, child_settings, closeTo,settings,childCss = {},result,$html = $('html');
			if(this.length == 1){
				$child = this;
				child_settings = $child.data('drawer_menu');
				if( !child_settings || !Object.keys(child_settings).length) return false;
				$menu = $(child_settings.parent);
			}else if ($opened){
				$menu = $opened;
				$child = $menu.find(this.selector);
				if($child.length == 1) child_settings = $child.data('drawer_menu');
				else $child = null;
			}else{
				return false;
			}
			settings = $menu.data('drawer_menu');
			$children = $menu.find(settings.children);
			$that = $children.filter(':visible');
			$ather = $children.not(this);
			if(!$child){
				$child = $that;
				child_settings = $child.data('drawer_menu');
			}
			closeTo = $child.data('drawer_menuCloseto');
			if( action == 'open' || (action == 'toggle' && $child.is(':hidden'))){
				if(!$child.is(':hidden')){ return false;}
				childCss[settings.child_side] = '0px';
				// open menu
				if($menu.is(':hidden')){
					$ather.hide().css(settings.child_side, '-100%');
					$child.css(childCss).show();
					return privateMethods.execute.apply($menu, ["open", callback]);
				}
				// close to had opened child
				child_settings['closeTo'] = closeTo || $that;
				// change state to animating
				$html.attr('data-drawer_menu-state','animating');
				// reset scrolling
				$menu.animate({ scrollTop : 0}, 'fast');
				// animate
				$child
					.data('drawer_menu', child_settings)
					.show()
					.css('z-index', '1')
					.animate(childCss, settings.speed, function(){
							$ather.hide().css(settings.child_side, '-100%');
							$html.attr('data-drawer_menu-state','open');
							if(typeof callback === 'function') { callback($child); }
						});
				result = 'child_open';
			}
			else{
				childCss[settings.child_side] = '-100%';
				// change state to animating
				$html.attr('data-drawer_menu-state','animating');
				// show child after closed visible child
				( ($child.get(0) !=  $that.get(0)) ? 
						$child	:
						$menu.find( child_settings.closeTo ||  $children.filter(':first') ) 
					)
					.css(settings.child_side, '0px')
					.css('z-index', '1')
					.show();
				$that
					.css('z-index', '1')
					.animate(childCss, settings.speed, function(){
							$that.hide();
							$html.attr('data-drawer_menu-state','open');
							if(typeof callback === 'function') { callback($child); }
						});
				result = 'child_close'
			}
			return result;
		},
		execute: function(action, callback) {
			if(moving) return false;
			var $menu = (1 == this.length) ? this : ( 
					(1 == $opened.find(this).length) ?
							$opened.find(this) :
							$opened
				),
				settings = $menu.data('drawer_menu');
			if( !settings || !Object.keys(settings).length) return;
			if(settings.parent){
				return privateMethods.execute_child.apply(this, arguments);
			}
			var $body = $(settings.body),
				$page = $(settings.body).children().not(this),
				$html = $('html'),
				width = settings.width, //privateMethods.resize($menu.data('body') , 'width', $menu.data('width'));
				position = $menu.css('position'),
				fnAnimeEnd,
				bodyCss = {},
				menuCss = {},
				result;
			// Open
			if( action == 'open' || (action == 'toggle' && $menu.is(':hidden')) ){
				if(!$menu.is(':hidden')){ return false;}
				if($opened){
					return privateMethods.execute.apply($opened, ["close", function(){
							privateMethods.execute.apply($menu, ["open", callback]);
						}]);
				}
				moving = true;
				settings.beforeOpen();
				$menu.scrollTop(0);
				if(settings.tapToClose){
					( (typeof settings.tapToClose == 'string') ? 
							$(settings.tapToClose) : 
							$(settings.body).children().not(this) 
					).on('click touchstart', privateMethods.tapToClose);
				}
				if(settings.resizeToClose){
					$(window).on('resize', privateMethods.resizeToClose);
				}
				fnAnimeEnd = function(){
					moving = false;
					$opened = $menu;
					$html.attr('data-drawer_menu-state','open');
					settings.afterOpenAnimation();
					if(typeof callback === 'function') { callback($menu); }
				}
				bodyCss[settings.side] = width;
				menuCss[settings.side] = '0px';
				$menu.show();
				$html.attr('data-drawer_menu-state','animating');
				if(settings.displace){
					//$page.css('z-index', '2');
					//$menu.css('z-index', '1');
					if(position == 'fixed'){
						$menu.animate(menuCss, settings.speed);
					}
					$body.animate(bodyCss, settings.speed, fnAnimeEnd);
				}else{
					//$page.css('z-index', '1');
					//$menu.css('z-index', '2');
					$menu.animate(menuCss, settings.speed, fnAnimeEnd);
				}
				settings.afterOpen();
				result = 'open';
			}
			// Close
			else{
				moving = true;
				settings.beforeClose();
				fnAnimeEnd = function(){
					moving = false; $opened = null;
					$menu.hide();
					$html.attr('data-drawer_menu-state','close');
					$menu
						.find(settings.children)
							.not(':first')
								.hide()
								.css(settings.child_side, '-100%')
							.end()
							.filter(':first')
								.css(settings.child_side, '0px')
								.show()
							.end();
					$(window).off('click touchstart', privateMethods.tapToClose);
					$(window).off('resize', privateMethods.resizeToClose);
					settings.afterCloseAnimation();
					if(typeof callback === 'function') { callback($menu); }
				}
				bodyCss[settings.side] = '0px';
				menuCss[settings.side] = '-' + width;
				$html.attr('data-drawer_menu-state','animating');
				if(settings.displace){
					if(position == 'fixed'){
						$menu.animate(menuCss, settings.speed);
					}
					$body.animate(bodyCss, settings.speed, fnAnimeEnd);
				}else{
					$menu.animate(menuCss, settings.speed, fnAnimeEnd);
				}
				settings.afterClose();
				result = 'close';
			}
			return result;
		},
	}
			
	var methods = {
		init : function (options){
			var defaults = {
					body  : '.drawer-menu-body:first',
					speed : 500,
					side  : 'left',
					children : '.drawer-menu-panel',
					child_speed : 500,
					child_side : 'left',
					width : '80%',
					displace : true,
					tapToClose : '.drawer-menu-page',
					resizeToClose : false,
					beforeOpen : function () {},
					afterOpen : function () {},
					afterOpenAnimation : function(){},
					beforeClose : function () {},
					afterClose : function () {},
					afterCloseAnimation : function(){},
				}
			var settings = $.extend(defaults, options),
				$menu = this,
				thisCss;
			if(settings.side != 'left' && settings.side != 'right' ){
				settings.side = 'left';
			}
			if(settings.children){
				this
					.find(settings.children).each(function(){
							var $this = $(this);
							$this.data('drawer_menu', { 'parent' : $menu })
						})
						.not(':first').hide().css(settings.child_side, '-100%')
						.end()
						.filter(':first').css(settings.child_side, '0px').show();
			}
			this.css({ 'width' : settings.width })
				.css('height', this.height)
				.css(settings.side, '-' + settings.width)
				.data('drawer_menu', settings);
			privateMethods.scroll(this);
			return this;
		},
		open : function (callback){
			privateMethods.execute.apply(this, ['open', callback ]);
			return this;
		},
		close : function(callback){
			privateMethods.execute.apply(this, ['close', callback ]);
			return this;
		},
		toggle : function(callback){
			privateMethods.execute.apply(this, ['toggle', callback ]);
			return this;
		},
		child : function (callback){
			privateMethods.execute_child.apply(this, ['toggle', callback ]);
			return this;
		},
	}
	
	$.fn.drawer_menu = function( method ) {
		// メソッド呼び出し部分
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};
	
	$.drawer_menu = {
			open : function(expr, callback){
				return privateMethods.execute.apply($(expr), ['open', callback ]);
			},
			close : function(expr, callback){
				return privateMethods.execute.apply($(expr), ['close', callback ]);
			},
			toggle : function(expr, callback){
				return privateMethods.execute.apply($(expr), ['toggle', callback ]);
			},
			child : function(expr, callback){
				return privateMethods.execute_child.apply($(expr), ['toggle', callback ]);
			},
	};
	
	$(document).on('click', "[data-drawer_menu-open], [data-drawer_menu-close], [data-drawer_menu-toggle], [data-drawer_menu-child]" ,function(){
		var $this = $(this),
			settings = $this.data(),
			key = Object.keys(settings).filter(function(key){ return key.match(/^drawer_menu/);})[0];
			action = key.replace('drawer_menu', '').toLowerCase();
		$(settings[key]).drawer_menu(action);
	});
	
	$('html').attr('data-drawer_menu-state','close');
	
})(jQuery);