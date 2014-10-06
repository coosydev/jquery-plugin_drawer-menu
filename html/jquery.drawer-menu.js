/* Drawer-menu
 * varsion : v2.0.0
 * date    : 2014-05-30
 * http://www.coosy.co.jp/
 * Copyright (c) 2014 COOSY inc.inc */
(function($){
	var $opened = null;		// $opened drawer menu
	var moving  = false;	// Moving drawer menu
	var windowSize = 0;
	var resizeTimer = false;
	var prefix = [ 'webkit', 'moz', 'ms', 'o' , ''];
	var event_transition_end = [
		"oTransitionEnd",
		"oTransitionend",
		"mozTransitionEnd",
		"webkitTransitionEnd",
		"transitionend"
	];
	var ua = navigator.userAgent.toLowerCase();
	var android_version = ua.substr(ua.indexOf('android')+8, 3);
	var bo = false;
	if(ua.indexOf("android")) if(parseFloat(android_version) <= 2.3) bo = true;
	
	var privateMethods = {
		scroll : function(expr){
			if(!bo) return;
			var $this = $(expr);
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
			
			$this.on("touchstart touchmove", function(e){
				var touch = e.originalEvent.touches[0];
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
			});
			
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
				if($opened && windowSize != $(window).width()){ $opened.drawer_menu("close"); }
			}, 200);
		},
		getTransitionEnd : function(event_name){
			event_name = (event_name == undefined || event_name == null) ? '' : '.' + event_name;
			return event_transition_end.join(event_name + ' ') + event_name;
		},
		setCssTransition : function($expr, speed, easing){
			if(!easing) easing = '';
			if(!speed) speed = '';
			if(speed) speed += 'ms';
			var animation = (easing != '' || speed != '') ? 'transform ' + speed + ' ' + easing : '';
			var len = prefix.length - 1;
			$.each(prefix, function(key, val){
				var pf = (key < len) ? '-' + val + '-' : '';
				$expr.css(pf + 'transition', (animation != '') ? pf + animation : '');
			});
		},
		setCssAnimate : function($expr, side, width, fncEnd){
			if(fncEnd) $expr.on(privateMethods.getTransitionEnd('dm_te'), fncEnd);
			$expr.css(side);
			var _width = ((side == 'left') ? '-' : '') + width;
			var len = prefix.length - 1;
			$.each(prefix, function(key, val){
				var pf = (key < len) ? '-' + val + '-' : '';
				$expr.css(pf + 'transform', 'translateX(' + _width + ')');
			});
		},
		execute_child : function(action, callback){
			if(moving) return false;
			// $child is action DOM
			// $that is active DOM
			// $ather is no active DOM
			var $children, $child, $that, $ather, $menu, $body, child_settings, closeTo, $closeTo, settings,childCss = {},result,$html = $('html'), fnAnimeEnd, fnSetAnimate;
			if(this.length == 1){
				$child = this;
				child_settings = $child.data('drawer_menu');
				if( !child_settings || !$.map(child_settings, function(value, key){ return key;}).length) return false;
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
			$body = $(settings.body),
			$children = $menu.find(settings.children);
			$that = $children.filter(':visible');
			if(!$child){
				$child = $that;
				child_settings = $child.data('drawer_menu');
			}
			$ather = $children.not($child);
			closeTo = $child.data('drawer_menuCloseto');
			
			if( action == 'open' || (action == 'toggle' && $child.is(':hidden'))){
				if(!$child.is(':hidden')){ return false;}
				// open menu
				if($menu.is(':hidden')){
					if(settings.cssAnimation){
						$ather.hide().each(function(){ privateMethods.setCssAnimate($(this), settings.child_side, '100%'); });
						$child.each(function(){ privateMethods.setCssAnimate($(this), settings.child_side, '0%'); }).show();
					}else{
						$ather.hide().css(settings.child_side, '-100%');
						$child.css(settings.child_side, '0px').show();
					}
					return privateMethods.execute.apply($menu, ["open", callback]);
				}
				// close to had opened child
				child_settings['closeTo'] = closeTo || $that;
				// change state to animating
				$html.attr('data-drawer_menu-state','animating');
				// animate end function
				fnAnimeEnd = function(){
					$html.attr('data-drawer_menu-state','open');
					$ather.hide();
					if(settings.cssAnimation){
						$child.off(privateMethods.getTransitionEnd('dm_te'));
						$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this)); });
					}else{
						$ather.css(settings.child_side, '-100%');
					}
					if(typeof callback === 'function') { callback($child); }
				};
				// animate
				if(settings.cssAnimation){
					privateMethods.setCssAnimate($child, settings.child_side, '100%');
				}
				$ather
					.css('z-index', '1');
				$child
					.data('drawer_menu', child_settings)
					.show()
					.css('z-index', '2');
				if(settings.cssAnimation){
					$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this), settings.child_speed, settings.child_easing); });
					setTimeout(function(){
						privateMethods.setCssAnimate($child, settings.child_side, '0%', fnAnimeEnd);
					});
				}else{
					childCss[settings.child_side] = '0px';
					$child.animate(childCss, settings.child_speed, settings.child_easing, fnAnimeEnd);
				}
				result = 'child_open';
			}
			else{
				// change state to animating
				$html.attr('data-drawer_menu-state','animating');
				// show child after closed visible child
				$closeTo = ( ($child.get(0) !=  $that.get(0)) ? 
						$child	:
						$menu.find( child_settings.closeTo ||  $children.filter(':first') ) 
					);
				if(settings.cssAnimation){
					$closeTo.each(function(){ privateMethods.setCssAnimate($(this), settings.child_side, '0%'); });
				}else{
					$closeTo.css(settings.child_side, '0px');
				}
				$closeTo.css('z-index', '1').show();
				// animate end function
				fnAnimeEnd = function(){
					$that.hide();
					$html.attr('data-drawer_menu-state','open');
					if(settings.cssAnimation){
						$that.off(privateMethods.getTransitionEnd('dm_te'));
						$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this)); });
					}
					if(typeof callback === 'function') { callback($child); }
				};
				$that.css('z-index', '2');
				if(settings.cssAnimation){
					$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this), settings.child_speed, settings.child_easing); });
					privateMethods.setCssAnimate($that, settings.child_side, '100%', fnAnimeEnd);
				}else{
					childCss[settings.child_side] = '-100%';
					$that.animate(childCss, settings.child_speed, settings.child_easing, fnAnimeEnd);
				}
				result = 'child_close'
			}
			return result;
		},
		execute: function(action, callback) {
			if(moving) return false;
			var $menu = (1 == this.length) ? this : ( 
					($opened) ? (
						(1 == $opened.find(this).length) ?
								$opened.find(this) :
								$opened
						)
					: null
				);
			if(!$menu) return;
			var settings = $menu.data('drawer_menu');
			if( !settings || !$.map(settings, function(value, key){ return key;}).length) return;
			if(settings.parent){
				return privateMethods.execute_child.apply(this, arguments);
			}
			var $body = $(settings.body),
				$page = $(settings.body).children().not($menu),
				$html = $('html'),
				width = (settings.resizePer) ? privateMethods.resize(settings.body , 'width', settings.width) : settings.width,
				position = $menu.css('position'),
				fnAnimeEnd,
				bodyCss = {},
				menuCss = {},
				result;
			// Open
			if( action == 'open' || (action == 'toggle' && $menu.is(':hidden')) ){
				if(!$menu.is(':hidden')){
					if(typeof callback === 'function') { callback.apply($menu); }
					return false;
				}
				if($opened){
					return privateMethods.execute.apply($opened, ["close", function(){
							privateMethods.execute.apply($menu, ["open", callback]);
						}]);
				}
				moving = true;
				windowSize = $(window).width();
				settings.beforeOpen();
				if(settings.tapToClose){
					( (typeof settings.tapToClose == 'string') ? 
							$(settings.tapToClose) : 
							$(settings.body).children().not(this) 
					).on('click.dm_tpc' + ((!bo) ? ' touchstart.dm_tpc' : ''), privateMethods.tapToClose);
				}
				if(settings.resizeToClose){
					$(window).on('resize.dm_resize', privateMethods.resizeToClose);
				}
				fnAnimeEnd = function(e){
					moving = false;
					$opened = $menu;
					$html.attr('data-drawer_menu-state','open');
					if(settings.cssAnimation){
						$menu.off(privateMethods.getTransitionEnd('dm_te'));
						privateMethods.setCssTransition($menu);
						$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this)); });
					}
					settings.afterOpenAnimation();
					if(typeof callback === 'function') { callback.apply($menu, e); }
				}
				bodyCss[settings.side] = width;
				menuCss[settings.side] = '0px';
				$menu.width(width);
				if(!settings.resizeToClose && settings.resizePer){
					var resizePerTimer = null;
					$(window).on('resize.dm_rePer', function(){
						if (resizePerTimer !== false) {
							clearTimeout(resizePerTimer);
						}
						resizeTimer = setTimeout(function() {
							if($opened && windowSize != $(window).width()){ 
								var width = '', _width = '';
								width = privateMethods.resize(settings.body , 'width', settings.width);
								width100 = privateMethods.resize(settings.body , 'width', '100%');
								$menu.width(width);
								if(settings.displace){
									if(position == 'fixed'){
										if(!settings.cssAnimation){
											$menu.css(menuCss);
										}
									}
									if(settings.cssAnimation){
										privateMethods.setCssAnimate($page, settings.side == 'left' ? 'right' : 'left', width); 
									}else{
										$page.css(bodyCss);
									}
								}else{
									if(!settings.cssAnimation){
										$menu.css(menuCss);
									}
								}
								windowSize = $(window).width();
							}
						}, 200);
					});
				}
				$html.attr('data-drawer_menu-state','animating');
				$page.css((settings.side != 'right') ? 'right' : 'left', 'auto');
				$menu.css((settings.side != 'right') ? 'right' : 'left', 'auto');
				if(settings.cssAnimation){
					$menu.css(settings.side, '0px');　 // 別メニューがオープンしていた場合の対処
					privateMethods.setCssAnimate(this, settings.side, '100%');
					privateMethods.setCssTransition($menu, settings.speed, settings.easing);
					privateMethods.setCssTransition($page, settings.speed, settings.easing);
					$menu.find(settings.children).each(function(){ 
							privateMethods.setCssTransition($(this), settings.child_speed, settings.child_easing);
						});
				}else{
					$menu.css(settings.side, '-' + width); // 別メニューがオープンしていた場合の対処
				}
				$menu.show();
				if(settings.displace){
					if(position == 'fixed'){
						if(settings.cssAnimation){
							setTimeout(function(){
								privateMethods.setCssAnimate($menu, settings.side, '0px', fnAnimeEnd);
							});
						}else{
							$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
						}
					}
					if(settings.cssAnimation){
						setTimeout(function(){
							privateMethods.setCssAnimate($page, settings.side == 'left' ? 'right' : 'left', width, function(){
									$page.off(privateMethods.getTransitionEnd('dm_te'));
									privateMethods.setCssTransition($page);
								});
							privateMethods.setCssAnimate($menu, settings.side, '0px', fnAnimeEnd);
						});
					}else{
						$page.animate(bodyCss, settings.speed, settings.easing);
						$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
					}
				}else{
					if(settings.cssAnimation){
						$page.off(privateMethods.getTransitionEnd('dm_te'));
						privateMethods.setCssTransition($page);
						setTimeout(function(){
							privateMethods.setCssAnimate($menu, settings.side, '0px', fnAnimeEnd);
						});
					}else{
						$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
					}
				}
				settings.afterOpen();
				result = 'open';
			}
			// Close
			else{
				if($menu.is(':hidden')){
					if(typeof callback === 'function') { callback.apply($menu); }
					return false;
				}
				moving = true;
				settings.beforeClose();
				fnAnimeEnd = function(){
					moving = false; $opened = null;
					$menu.hide();
					$html.attr('data-drawer_menu-state','close');
					var $children = $menu.find(settings.children);
					if(settings.cssAnimation){
						$menu.off(privateMethods.getTransitionEnd('dm_te'));
						privateMethods.setCssTransition($menu);
						$menu.find(settings.children).each(function(){ privateMethods.setCssTransition($(this)); });
						$children
							.not(':first').hide().each(function(){
									privateMethods.setCssAnimate($(this), settings.child_side, '100%');
								})
							.end()
							.filter(':first').each(function(){
									privateMethods.setCssAnimate($(this), settings.child_side, '0%');
								}).show();
					}else{
						$children
								.not(':first').hide().css(settings.child_side, '-100%')
								.end()
								.filter(':first').css(settings.child_side, '0px').show();
					}
					$(window).off('click.dm_tpc touchstart.dm_tpc');
					$(window).off('resize.dm_resize resize.dm_rePer');
					settings.afterCloseAnimation();
					if(typeof callback === 'function') { callback.apply($menu); }
				}
				bodyCss[settings.side] = '0px';
				menuCss[settings.side] = '-' + width;
				$html.attr('data-drawer_menu-state','animating');
				$page.css((settings.side != 'right') ? 'right' : 'left', 'auto');
				$menu.css((settings.side != 'right') ? 'right' : 'left', 'auto');
				if(settings.cssAnimation){
					privateMethods.setCssTransition($menu, settings.speed, settings.easing);
					privateMethods.setCssTransition($page, settings.speed, settings.easing);
					$menu.find(settings.children).each(function(){ 
						privateMethods.setCssTransition($(this), settings.child_speed, settings.child_easing);
					});
				}
				if(settings.displace){
					if(position == 'fixed'){
						if(settings.cssAnimation){
							privateMethods.setCssAnimate($menu, settings.side, (settings.resizePer) ?  width : '100%', fnAnimeEnd);
						}else{
							$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
						}
					}
					if(settings.cssAnimation){
						privateMethods.setCssAnimate($page, settings.side, '0px',function(){
								$page.off(privateMethods.getTransitionEnd('dm_te'));
								privateMethods.setCssTransition($page);
							});
						privateMethods.setCssAnimate($menu, settings.side, (settings.resizePer) ?  width : '100%', fnAnimeEnd);
					}else{
						$page.animate(bodyCss, settings.speed, settings.easing);
						$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
					}
				}else{
					if(settings.cssAnimation){
						$page.off(privateMethods.getTransitionEnd('dm_te'));
						privateMethods.setCssTransition($page);
						privateMethods.setCssAnimate($menu, settings.side, (settings.resizePer) ?  width : '100%', fnAnimeEnd);
					}else{
						$menu.animate(menuCss, settings.speed, settings.easing, fnAnimeEnd);
					}
				}
				settings.afterClose();
				result = 'close';
			}
			return result;
		}
	};
			
	var methods = {
		init : function (options){
			var defaults = {
					body  : '.drawer-menu-body:first',
					speed : 500,
					easing : 'linear',
					side  : 'left',
					children : '.drawer-menu-panel',
					child_speed : 500,
					child_easing : 'linear',
					child_side : 'left',
					width : '80%',
					displace : true,
					tapToClose : '.drawer-menu-page',
					resizeToClose : false,
					resizePer : false,
					cssAnimation : true,
					beforeOpen : function () {},
					afterOpen : function () {},
					afterOpenAnimation : function(){},
					beforeClose : function () {},
					afterClose : function () {},
					afterCloseAnimation : function(){},
				}
			var settings = $.extend(defaults, options), $menu = this, thisCss, $page = $(settings.body).children().not($menu);
			if(settings.side       != 'right') settings.side = 'left';
			if(settings.child_side != 'right') settings.child_side = 'left';
			if(settings.children){
				var $children = this.find(settings.children).each(function(){
							var $this = $(this);
							$this.data('drawer_menu', { 'parent' : $menu });
						});
				if(settings.cssAnimation){
					privateMethods.setCssAnimate(this, settings.side, '100%');
					this.css(settings.side,'0px');
					$children
						.css(settings.child_side, '0px')
						.not(':first').hide().each(function(){
								privateMethods.setCssAnimate($(this), settings.child_side, '100%');
							})
						.end()
						.filter(':first').each(function(){
								privateMethods.setCssAnimate($(this), settings.child_side, '0%');
							}).show();
				}else{
					this.css(settings.side, '-' + settings.width)
					$children
							.not(':first').hide().css(settings.child_side, '-100%')
							.end()
							.filter(':first').css(settings.child_side, '0px').show();
				}
			}
			this.css({ 'width' : settings.width})
				.css('height', this.height)
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.drawer_menu' );
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
			key = $.map(settings, function(value, key){ return /^drawer_menu/.test(key) ? key : null;})[0];
			action = String(key).replace('drawer_menu', '').toLowerCase();
		$(settings[key]).drawer_menu(action);
	});
	
	$('html').attr('data-drawer_menu-state','close');
	
})(jQuery);
