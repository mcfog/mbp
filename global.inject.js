(function() {	
	var CONN = EXT.connect({name:'global.inject'});
	var is_undefined = function(v) {return typeof v == 'undefined'};
	var is_extension = true;
	var c_eval = function(source) {
	  if ('function' == typeof source) {
	    source = '(' + source + ')();'
	  }
	  var script = document.createElement('script');
	  script.setAttribute("type", "application/javascript");
	  script.textContent = source;
	  document.body.appendChild(script);
	  document.body.removeChild(script);
	}
	var main = function() {
		//var is_extension = false;

		$('body').one('ext_init', function(ev, S) {try{
			var ext_opt = function(k, d) {
				if(arguments.length < 2) d = true;//default is true
				if(!is_extension) return d;
				return S[k];
			}

			/********************************************************
			 *Main Code here
			 ********************************************************/			 
			c_eval(function() {
				window.mbp = {};
			});

			//禁用电波
			if(ext_opt('disableNotify')) c_eval(function() {
				window.pushNotify = function() {};
				setTimeout(function() {
					$('#robot_speech').show();
					$('#robot_speech_js').hide();
				}, 500);				
			});
			
			//光头
			if(ext_opt('guangtou')) (function() {
				//if(location.href.match(/\/user\/[^\/]+$/)) return;
				var sel = 'a[href^="/user/"],a[href^="http://bangumi.tv/user/"],a[href^="http://bgm.tv/user/"],a[href^="http://chii.in/user/"]'

			 	$(document).delegate(sel, 'mouseenter', function() {
			 		if($('._daguangtou').size()>0) return;
			 		var $a = $(this);
			 		if(!/\/user\/[^\/]+(\/timeline\?type=say)?$/.test($a.attr('href'))) return;
			 		if($a.closest('#idBadger,.user_box').size()>0) return;
			 		if($a.children().size()>1 || ($a.children().size()==1 && !$a.children().is('img'))) return;

					var id = /\/user\/([^\/]+)/.exec($a.attr('href'))[1];
					if(id==/\/user\/([^\/]+)/.exec($('#idBadger a.avatar').attr('href'))[1]) return;
			 		var fn_close = function() {
			 			$('._guangtou').trigger('close');
			 		};
			 		$a.attr('_position', $a.css('position'));
			 		$a.css({
			 			position:$a.css('position')=='static'?'relative':$a.css('position'),
			 			zIndex:50,
			 		});
			 		if($a.children().size()==0||$a.outerHeight()<$a.children().height()&&$a.children('.ll').size()==0) $a.css('display','inline-block');
			 		//uglyfix:有时候$a里面有个float:right导致杯具
			 		if($a.children().css('float')=="right") {
			 			$a.css('float', 'right');
			 		}
			 		
			 		var o = $a.offset();
			 		var w = Math.max($a.outerWidth(), $a.children().outerWidth())+20;
			 		var h = Math.max($a.outerHeight(), $a.children().outerHeight());
			 		var $gtou = $('<div>').css({
			 			width: w,height: h,
			 			top:o.top-5,left:o.left-5,
			 		}).addClass('_guangtou'/*Wa~*/).append($('<span class="loading">▼</span>').css('lineHeight', h+'px')).one('click', function() {
			 			$gtou.height(h+200).addClass('_daguangtou').find('.loading').text('>_<');
			 			$gtou.append($a.clone().css({display:'block',float:'left'}).append("&nbsp;&nbsp;@"+id));
			 			$gtou.unbind('mouseleave', fn_close);
			 			$a.fadeTo(0,0.01).addClass('_guangtou_handle');
			 			$.get("/user/"+id, function(htm) {
				 			$gtou.find('.loading').text('[Ｘ]').click(fn_close);
				 			var $h = $(htm);
				 			var $info = $('<div>').addClass("cb");
				 			var idn = /\/(\d+)\.chii/.exec($h.find('a[href^="/pm/compose"]').attr('href'))[1]
				 			
				 			//收藏
				 			var $fav = $('<div>').addClass("cb");
				 			var t = {'anime':'动画','game':'游戏','book':'图书','music':'音乐'}
				 			for(var k in t) {
				 				var $t = $h.find('#'+k);
				 				var doing = parseInt($t.find('li a[href$="/do"]').text()) || 0;
				 				var done =  parseInt($t.find('li a[href$="/collect"]').text()) || 0;
				 				$fav.append($('<a>')
				 					.text(t[k]+"("+doing+"/"+done+")")
				 					.attr({
				 						'href':"/"+k+"/list/"+id,
				 						'title':"正在哔/哔过"
				 					})
				 					.css({padding:'2px',display:'inline-block'})
				 				).append("  ");
				 			}
				 			$info.append($fav);
				 			
				 			//同步
				 			var $syn = $('<div>').addClass("cb");
				 			
				 			var perc = $h.find('.userSynchronize .percent_text').text()
				 			$syn.append($('<span>')
				 				.text($h.find('.userSynchronize .hot').text().substr(2)+'('+perc+')')
								.css({background:"rgba(255,0,0,"+parseFloat(perc)/100+")",padding:'4px'})
				 			);
				 			if($h.find('a[href^="/connect/"]').size()>0) {
				 				$syn.append($('<a>').html('<span>尾行</span>').css({float:"right"}).addClass('chiiBtn').attr({href:'/connect/'+idn}))
				 			} else {
				 				$syn.append($('<a>').html($('<span>已尾行</span>').css({backgroundPosition:"100% -22px",color:'orange',fontWeight:'bold'})).css({float:"right",background:"url(/img/btn_bg.png) 0 -22px no-repeat"}).addClass('chiiBtn').attr({target:'_blank'}))
				 			}
				 			$syn.append($('<a>').html('<span>送信</span>').css({float:"right"}).addClass('chiiBtn').attr({href:'/pm/compose/'+idn+'.chii', target:'bgm_pm_compose'}))
				 			
				 			$info.append($syn)
				 			
				 			
				 			//时间线
				 			var $tl = $h.find('ul.timeline').clone();
				 			$tl.find('li:gt(2)').remove();
				 			$tl.find('li').css({maxHeight:'2.4em'})
				 			$tl.append('<li><a href="/user/'+id+'/timeline">more...</a></li>')
				 			$info.append($tl);
				 			
				 			
				 			$info.appendTo($gtou).css({overflow:"hidden"});
			 			}, 'html')
			 		});

		 			$('._guangtou').remove();
			 		$(document.body).append($gtou);
			 		$gtou.one('mouseleave', fn_close);
			 		$gtou.one('close', function() {
			 			$a.css({position: $a.attr('_position'), zIndex:30});
			 			$('._guangtou').remove();
			 			$a.fadeTo(1,1);
			 		})
			 	});
			 	$(document).click(function(ev) {
			 		if($(ev.target).closest('._guangtou').size()==0) {
			 			$('._guangtou').trigger('close')
						//$('._guangtou_handle').removeClass('_guangtou_handle').fadeTo(1,1);
			 		}
			 	});
			})();
			
			//自定导航
			if(ext_opt('betterNav')) $(function() {
				$('style._betterNav').remove();
				var NAV = ext_opt('navbar_slot');
				if(!NAV) return $('#nav_menu>li:first').remove();

				var userid = $('#menu a.nav[href^="/anime/list/"]:first').attr('href');
				if(!userid) return;
				userid = userid.match(/\/anime\/list\/(.+?)\/./);

				if(!userid) {
					return setTimeout(arguments.callee, 1000);
				} else {
					userid = userid[1];
				}
				
				NAV = NAV.replace(/%USERID%/g, userid);
				NAV = JSON.parse(NAV).nav;
				if(!NAV) return $('#nav_menu>li:first').remove();
				$('#nav_menu').empty();
				$(NAV).each(function() {
					var $li = $('<li>');
					var menu = this;
					var head = menu.shift();
					var mkHref = function(href) {
						return function() {return href||undefined}
					}
					
					var $a = $('<a class="top">').attr('href', mkHref(head.href)).append($('<span>').html(head.text)).append('<span class="right">');
					if(/^[\w-]+:\/\/.+/.test(head.href)) $a.attr('target', '_blank' );
					$li.append($a);
					$li.append('<div class="clear">');
					if(this.length > 0) {
						$li.append('<ul class="clearit">');
						var $ul = $li.find('ul.clearit');
						for(var i in menu) {
							var item = menu[i];
							if(item.href=='###') {
								$ul.append($('<li>').append($('<div class="sep">').text(item.text)));
							} else {
								var $a = $('<a class="nav">').html(item.text).attr('href', mkHref(item.href));
								if(/^[\w-]+:\/\/.+/.test(item.href)) $a.attr('target', '_blank' );
								$ul.append($('<li>').append($a));
							}
						}
					}
					$('#nav_menu').append($li);
				});
			});
	
				
			if(ext_opt('xPic')) $('img').bind('error', function() {
				var src = $(this).attr('src');
				$t = $(this).attr('src', '/img/no_img.gif').attr('title', '载入失败(中键新窗)：'+src).width(32).mousedown(function(ev) {
					if(ev.button == 1) window.open(src);
				});
			});
			
			
			//人物页出演等条数过多
			if($('ul.browserList').size()>0) $('ul.browserList').each(function() {
				var $items = $(this).children('li');
				var count = $items.size();
				if(count < 5) return;
				$items.filter(':gt(4)').hide().last().after($('<li>/')
					.text('显示全部(共'+count+'项)').addClass('_more').click(function() {
						$(this).siblings('li').show();
						$(this).remove();
					})
				);
			})
			
			
			//同步率表
			var $synButton = function($ele) {
				return ($ele||$('<button>').text('查看同步率')).one('click', function() {
					if(!confirm('确认进行此操作?\n爱护B娘人人有责，请勿过多使用本功能对小粉红造成压力')) return;
					$(this).attr('disabled', true);
					/*
					$(window).bind('beforeunload',function() {
						return '您查看了很多的同步率，确认离开么？\n爱护B娘人人有责，请勿过多使用本功能对小粉红造成压力';
					});
					*/
					$('.userContainer').each(function() {
						var $ctn = $(this);
						$(document).queue('synchronous', function() {
							var next = function() {
								$(document).dequeue('synchronous');
							}
							var href = $ctn.find('a[href^="/user"]').attr('href');
							$ctn.append('<span class="loading">少女祈祷中…</span>');
							$.get(href, function(html) {
								$ctn.find('span.loading').remove();
								var $html = $(html);
								var $connect = $html.find('#connectFrd');
								var $us = $html.find('.userSynchronize');
								if($us.size()==0) return next();
								var $div = $('<div>');
								var perc = Number($us.find('.percent_text').text().match(/^([\d.]+)%$/)[1]);
								$div.append(
									$('<div class="clearfix">').append($us.find('.hot').text(function(){return $(this).text().replace('喜好','')})).append($us.find('.percent_text'))
								);
								if($connect.size()>0) {
									$connect.click(function(ev) {
										ev.preventDefault();
										$connect.remove();
										$.get($(this).attr('href'), function() {
											$div.append('/是我的好友');
										});
									})
									$div.append($connect);	
								} else {
									$div.append($html.find('#friend_flag').addClass('clearfix'));
								}
								if(perc > 75) {
									$div.css({color:'red',fontWeight:'bold'});
								} else if(perc > 45) {
									$div.css({color:'orange',fontWeight:'bold'});
								} else if(perc < 5) {
									$div.css({color:'gray'});
								}
								$ctn.append($div);
								next();
							}, 'html');
						})
					});
					$(document).dequeue('synchronous');
				})
			}//$synButton()
			if(/^\/user\/.+\/(rev_)?friends/.test(location.pathname)) {//好友列表
				$('#header h1').after($synButton());
			}
			if(/^\/(character|person)\/.+\/collections/.test(location.pathname)) {//收藏
				$('#columnCrtB h2.subtitle').after($synButton());
			}
			if(/^\/subject\/\d+\/(wishes|doing|collections|on_hold|dropped)/.test(location.pathname)//条目搁置/在看等
				|| /^\/group\/.+\/members/.test(location.pathname)) {//小组成员
				$('#SecTab>ul').append($synButton($('<a><span>查看同步率</span></a>')).wrap('<li>').closest('li'));
			}
			
			//电波检测
			CONN.onMessage.addListener(function(MSG, CONN) {
				if(MSG.ac == 'answer:checkNotify') {
					if(MSG.notify_id) {
						var erase = function() {
							$.get('/erase/notify/'+MSG.notify_id, {ajax:1}, function() {
								bili('野生的电波逃走了～');
								CONN.postMessage({ac:'bg:refreshNotify'});
							});	
						}
						var bili = function($msg) {
							setTimeout(function() {
								if($('#robot').is(':hidden')) $('#showrobot').click();
								$('#robot_speech_js').hide();
								$('#robot_speech').show().append($msg);
							});
						}
						$speech = $('<div>');
						$speech.append('野生的电波出现了！');
						
						if(MSG.hash) {
							$speech.append($("<a>点此查看</a>").attr('href', MSG.hash).click(function() {
								setTimeout(function() {
									$('.reply_highlight').removeClass('reply_highlight');
									$(location.hash).addClass('reply_highlight');
								})
								$(this).remove();
								erase();
							}));
						}
						bili($speech)
					}
				}
			})
			if(/\/topic\/\d+$/.test(location.pathname)) {
				CONN.postMessage({ac:'bg:checkNotify', pathname:location.pathname});
			}

			//shout
			$(function() {
				EXT.sendRequest({do:'evalBG',what:'function(){return cacheGet.isListening("'+location.href+'")}'}, function(res)
				{
					if(!res) return;
					CONN.postMessage({ac:'bg:shout', url:location.href, html:document.documentElement.outerHTML});
				});
			});
			
			//RT button
			if($('#SayInput').size()>0) c_eval(function() {
				var rtButton = function() {
					if($('.tml_item').not('.tml_rt').size()>0) $('.tml_item').not('.tml_rt').each(function() {
						var ti = this
						$(this).addClass('tml_rt');
						$('<a class="tml_rt" title="RT">转发</a>').click(function() {
							var $c = $(ti).clone();
							$c.find('img.rr').parent().remove();
							$c.find('.date,.tml_rt,.tml_reply,.tml_del,.avatar,img').remove();
							$c.find('a:first')[0].outerHTML=$c.find('a:first').attr('href').replace(/^.*\/user\/(\w+)$/, '@$1');
							$c.find('a').each(function() {
								var $t = $(this);
								if(/^\s*$/.test($t.text())) return $t.remove();
								if($t.attr('href').substr(0,4)!='http') return;
								var link = $t.attr('href');
								if(/\/user\/\w+/.test(link)) {
									var id = link.replace(/^.*\/user\/(\w+).*?$/, '@$1');
									this.outerHTML = id;
									return;
								}
								this.outerHTML = $t.text() + ' ' + link;
							});
							
							var result = $c.text();
							result=result.replace(/\s+/g, ' ');
							$('#SayInput').val(' RT'+result).focus();
						}).appendTo($(ti).find('.date'));
					});
				}
				$(document).ajaxComplete(function() {
					setTimeout(rtButton, 100);
				});
				rtButton();
			});

			//cse search
			$(function() {
				$('<script src="'+chrome.extension.getURL('include/jquery.sjtp.min.js')+'" />').appendTo(document.head)

				var $s0 = $('#siteSearchSelect');
				if(ext_opt('csePos')==0) {
					$s0.prepend('<option value="google">谷娘</option>').val('google');
				} else if(ext_opt('csePos') == -1) {
					$s0.append('<option value="google">谷娘</option>');
				} else {
					$s0.find('option:first').after('<option value="google">谷娘</option>');
				}
				$s0.closest('form').submit(function() {
					if($s0.val()=='google') {
						var q = $('#search_text').val();
						if(location.pathname != '/group/cse_search') {
							location = '/group/cse_search#'+JSON.stringify({q:q});
							return false;
						};
						c_eval('('+(''+function() {
							window.mbp.cse.search('__Q__');
						}).replace('__Q__', q.replace(/'/g, "\\'"))+')()');
						return false;
					}
				})
				//get tpl, set callback
				EXT.sendRequest({do:'evalBG',what:function() {
					//inside bg
					if(BG.tmpl_cse_result) return BG.tmpl_cse_result;
					$.ajax({
						url:EXT.getURL('include/google_cse_result.tpl.html'),
						async:false,//!!sync request
						dataType:'text',
						success:function(t) {
							BG.tmpl_cse_result = t;
						}
					});
					return BG.tmpl_cse_result;
				}+''}, function(tpl)
				{
					$('<script type="text/x-sjtp" id="tmpl_cse_search_result">').text(tpl).appendTo(document.body);
					c_eval(function() {
						var _inited = false, _hash = null;
						window.mbp.cse = {
 							result: function(o) {
								$('#header').fadeTo(400,0.05).find('h1').html('<del>我是你爸，去卖火柴</del>');
								$('.columns:first').render($("#tmpl_cse_search_result").html(), o.responseData);
							},
							tag: null,
							search: function(q, start) {
								if(!_inited) {
									var $n = $('#nav');
									$n.siblings(':not(#footer)').remove()
									$n.after('<div class="columns clearit">')
										.after('<div id="header"><h1>少女祈祷中...</h1></div>')
										;
									$(document.head).find('title').html('MBP CSE Search');
									$('#search_text').val(q);
									_inited=true;
								};

								hash = {q:q, start:start||0};
								if(window.mbp.cse.tag) {
									q += ' more:'+window.mbp.cse.tag;
									hash.tag=window.mbp.cse.tag;
								}
								location.hash = _hash = JSON.stringify(hash);

								$('<script src="http://www.google.com/uds/GwebSearch?callback=mbp.cse.result&rsz=filtered_cse&hl=zh_CN&cx=008561732579436191137:pumvqkbpt6w&v=1.0&'+$.param({q:q,_:Date.now(), start:start||0})+'" />')
									.appendTo(document.head).remove();
								$('#header').fadeTo(400,1).find('h1').html('少女祈祷中...');
							},
							hashchange: function() {
								var hash = window.location.hash.substr(1);
								if(hash != _hash) {
									_hash = hash;
									var o = JSON.parse(hash);
									if(!o) return;
									if(o.tag) window.mbp.cse.tag = o.tag;
									if('string' == typeof o.q) window.mbp.cse.search(o.q, o.start);
								}
							},
							switch_tag: function(tag) {
								window.mbp.cse.tag = $(tag).attr('data-tag');
								window.mbp.cse.search($('#search_text').val());
							}
						};
					});
				});

				//adjust header search box
				var $s = $s0.clone();
				$s.addClass('_header_search_select')
					.appendTo(document.body).hide()
					.change(function() {
						$s0.val($s.val());
					})
					.bind('click mouseleave', function() {
						$s.fadeOut();
					})
					.prop('id', null);
				$s[0].size = $s[0].length;
				$s0.mouseenter(function() {
					$s.css($s0.offset()).show();
				}).change(function(){
					$s.mouseleave();
				});
				
				if(location.pathname == '/group/cse_search' && location.hash.length > 1) {
					c_eval('('+(function() {
						setTimeout(function() {
							var me = arguments.callee;
							if(!window.mbp || !window.mbp.cse) return setTimeout(function() {me.call()}, 500);
							$(window).bind('hashchange', function() {
								return window.mbp.cse.hashchange();
							});
							window.mbp.cse.hashchange();
						});
					}+')()').replace('__HASH__', location.hash.substr(1)));
				}
			});//end of cse search

			/********************************************************
			 *Main Code End
			 ********************************************************/
		} catch(e) {
			console.log(e.stack ? e.stack : e);
		}});//bind ext_init
	}//end of main
	main();
})();