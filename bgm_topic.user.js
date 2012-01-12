// ==UserScript==
// @name           BGM topic tweak
// @description    the newer one reply is, the darker it's dateline will be
// @author         McFog wxyuan90#gmail.com
// @include        http://bangumi.tv/*
// @include        http://bgm.tv/*
// @include        http://chii.in/*
// @version        1.0.0201
// ==/UserScript==
(function() {	
	var is_undefined = function(v) {return typeof v == 'undefined'};
	var is_extension = true;
	//is_extension = false;
	var fn_nop = function(){};
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
			
			
			
		
var judgeSpam = function($msg, $context) {
	if($msg.find('img:not([src^="/"])').size()>0) return 0;//外链图片，しろ!
	
	var trim = function(s) {return s.replace(/(^[\s]*)|([\s]*$)/g, "")}
	var countSub = function(needle, haystack) {return haystack.split(needle).length-1};
	var matchCount = function(re, str) {var m = str.match(re);return m ? m.length : 0;};
	
	var msg = $msg.clone().find('.quote').remove().end().text().replace(/^\s*|\s*$/g,"");
	//console.log(msg);
	var point = 0;//SPAM指数，100以上一定是SPAM

	var zh_count, en_count, etc_count;
	zh_count = matchCount(/[\u0800-\u9fa5]/g, msg);//中文和日文
	en_count = matchCount(/\w/g, msg)//英文包括数字之类
	etc_count = msg.length - zh_count - en_count;
	
	//简单长度罚分
	var text_len = zh_count * 3 + en_count;
	if(text_len<5) point+=100.1; else if(text_len<15) point += 30.1 + (15-text_len)*5;
	text_len = zh_count + en_count
		
	//标点过度罚分
	var sym_pts = etc_count / text_len;
	if(sym_pts > .8) point += 100.2; else if(sym_pts > .5) point += 20.2 + (sym_pts - .5)*15;
	
	//重复罚分
	var context = typeof $context == 'string' ? $context : $context.clone().find('.quote').remove().end().text();
	var re = countSub(trim(msg), context) - 1;
	if(re > 5) {
	 	point += 100.4;
	} else if(re > 1) {
	 	point += 30.4 + re * 10;
	} else {
		//简单探测部分重复(分别探测前后半部分)
		re = countSub(trim(msg.substr(0, msg.length/2)), context) - 1;
		re = Math.max(re, countSub(trim(msg.substr(msg.length/2)), context) - 1);
		if(re > 6) {
			point += 100.01;
		} else if(re > 1) {
			point += 20.01 + re * 8;
		}
	}
	return point;
}

var fn_fade = function($r) {
	var $msg = $r.find('.message');
	if($msg.size()==0) {//inner
		$msg = $r.find('.cmt_sub_content').css('display', 'block');				
		var msg = $msg.clone();
		msg.find('.quote').remove();
		msg.find('img:not([src^="/img/"])').after('[图]').remove();
		var title = msg.text();
		if(title.length > 20) title = "(共"+title.length+"字)"+title.substr(0, 10)+"...";
		
		var $d = $('<div>').append(
			$r.find('a[href^="/user/"]:not(.avatar):first').clone()
		).append(
			$('<span>').html(msg.html()).prepend($r.find('strong.userName').clone())
		).append(
			$r.find('.re_info').clone()
		).addClass('_summary cb').fadeTo(0,.7);

		$r.find('*').hide();
		$r.append($d).one('click', function(ev) {
			if($(ev.target).is('a[href]')) return;
			$(this).find(':visible').remove();
			$(this).find('*').show();
			$(this).removeClass('_folded').attr('title', '');
		}).mousedown(function(ev) {
			if(ev.button != 1) return;
			if(!$(this).is('._folded')) return;
			ev.preventDefault();
			$('._folded').click();
			var o = $(this).offset();
			$('body').scrollTop(o.top - 30);
		}).addClass('_folded').hover(function() {
			$(this).toggleClass('_hover');
		}).attr('title', title);
	} else {//outer reply
		var msg = $msg.clone();
		msg.find('.quote').remove();
		msg.find('img:not([src^="/img/"])').after('[图]').remove();
		var title = msg.text().replace(/^\s*|\s*$/g,"");
		if(title.length > 20) title = "(共"+title.length+"字)"+title.substr(0, 10)+"...";

		$msg = $msg.wrap('<div>').parent();
		$r.find('.reply_content').prevAll().hide();
		$r.css({paddingTop:0,paddingBottom:0});
		var $d = $('<div>').append($r.find('.inner a:first').clone())
			.append($('<span>').html(msg.html())).append('<div class="cb"></div>')
			.fadeTo(0,.8).addClass('_summary _folded message').width(500);
		
		$d.prependTo($r.find('.reply_content')).attr('title', title).one('click', function(ev) {
			if($(ev.target).is('a[href]')) return;
			$(this).parent().prevAll().show();
			$(this).parent().find('.message').show();
			$(this).closest('*[id^=post_]').css({paddingTop:10,paddingBottom:10});
			$(this).remove();
		}).mousedown(function(ev) {
			if(ev.button != 1) return;
			if(!$(this).is('._folded')) return;
			ev.preventDefault();
			var $ri = $(this).parent();
			$('._folded').click();
			var o = $ri.offset();
			$('body').scrollTop(o.top - 30);
		}).hover(function() {
			$(this).toggleClass('_hover');
		});
		$msg.find('.message').hide();
	}
}

			/********************************************************
			 *Main Code here
			 ********************************************************/

			//editor增强
			c_eval(function() {
				if(typeof mySettings != "undefined" && mySettings.markupSet) mySettings.markupSet.push({
					openWith:"[color=[![#RGB 或 #RRGGBB 或 web颜色名\n如red,green,blue,orange等]!]]",
					closeWith:"[/color]",
					key:"Y",
					name:"颜色",
					placeHolder:"我有颜色"
				});
			})//c_eval
			
			//回复的textarea也有editor
			c_eval(function() {
				$(document).click(function(ev) {
					var t = ev.target;
					if(t.nodeName != 'TEXTAREA') return;
					if($(t).is('.markItUpEditor')) return;
					if($(t).attr('id').substr(0, 8) != 'content_') return;
					$(t).markItUp(mySettings);
				});
			});//c_eval

			//添加回复后的edit和del链接
			c_eval(function() {
				$(document).bind('ajaxSuccess', function(e, xhr, setting) {
					if(!setting) return;
					if(!setting.url || setting.url.indexOf('new_reply') == -1) return;
					if(setting.dataType != 'json') return;
					var o = JSON.parse(xhr.responseText);
					var rid = o.reply_id;
					var $div = $('#post_'+rid);
					if($div.size()==0) return;

					var erase,edit;
					var u = setting.url.split('/');
					if(u[1] == 'group' ) {//小组
						erase = '/erase/group/reply/{ID}';
						edit = '/group/reply/{ID}/edit';
					} else if(u[1] == 'character' || u[1] == 'person') {//人物
						erase = '/erase/reply/'+u[1]+'/{ID}';
						edit = '/'+u[1]+'/edit_reply/{ID}';
					} else if(u[1] == 'subject') {
						if(u[2] == 'ep') {//章节讨论
							erase = '/erase/reply/ep/{ID}';
							edit = '/subject/ep/edit_reply/{ID}';
						} else if(u[2] == 'topic') {//条目讨论
							erase = '/erase/subject/reply/{ID}';
							edit = '/subject/reply/{ID}/edit';
						}
					}

					$div.find('.re_info').append(' / ').append(
						$('<a class="erase_post">del</a>').attr('id', 'erase_'+rid)
						.attr('href', erase.replace('{ID}', rid))
						.one('click', function (){if(confirm(AJAXtip['eraseReplyConfirm'])){var post_id=$(this).attr('id').split('_')[1];$("#robot").fadeIn(500);$("#robot_balloon").html(AJAXtip['wait']+AJAXtip['eraseingReply']);$.ajax({type:"GET",url:(this)+'?ajax=1',success:function(html){$('#post_'+post_id).fadeOut(500);$("#robot_balloon").html(AJAXtip['eraseReply']);$("#robot").animate({opacity:1},1000).fadeOut(500);},error:function(html){$("#robot_balloon").html(AJAXtip['error']);$("#robot").animate({opacity:1},1000).fadeOut(500);}});}return false;})
					).append(' / ').append(
						$('<a>edit</a>').attr('href', edit.replace('{ID}', rid))
					);
				});//ajaxSuccess
			})//c_eval

			var $replies = $('#comment_list *[id^=post_]');
			if($replies.size()<1) return;			

			var fn_focus = function(hash) {
				$('.reply_highlight').removeClass("reply_highlight");
				$(hash).addClass("reply_highlight");
				setTimeout(function() {
					$('body').scrollTop($('body').scrollTop()-30);
				});
			}
			
			var $list = [];
			$replies.each(function() {//DOM顺序遍历
				var $t = $(this);
				var id = $t.attr('id');
				if(id.substr(0, 5)!='post_') return;
				var pid = parseInt(id.substr(5));
				$t[0].pid = pid;
				$list.push($t);
				
				if(ext_opt('dispHref')) {
					$t.find('.re_info').one('click', function(ev) {
						if($(ev.target).is('a[href]')) return;
						var $div = $(this);
						var $t = $div.closest('*[id^=post_]');
						var hash = "#post_"+$t[0].pid;
						var link = location.origin+location.pathname+hash;
						
						$div.before(
							$('<a></a>').text("本楼链接").attr('href', link).css({
								position:'absolute',
								right:'-60px',top:'3px',
								padding:'5px',
								border:'1px silver dotted'
							}).click(function() {
								fn_focus(hash);
							}).addClass('link_post').hide()
						);
						$div.parent().css('position', 'relative');

						var click = function() {
							location.hash = hash;
							fn_focus(hash);
							var $t = $(this).prevAll('.link_post');
							$('.link_post').not($t).fadeOut('slow');
							$t.fadeIn('normal');
						};
						click.call(this);
						$div.click(click);
					}).css('cursor', 'pointer').attr('title', '点击查看此楼链接');
				}//S[dispHref]
			});//end of $replies.each

			$list = $list.sort(function($a, $b) {return $b[0].pid - $a[0].pid});
		
			var hash = "#post_"+$list[0][0].pid;
			if(ext_opt('jump2latest') && location.hash != hash) {
				var o = $('#comment_list').offset();
				var $tip = $('<div></div>').css({
					position:'fixed',
					top:30, left:o.left+600,
					padding:'5px',
					border:"1px solid gray",
					background:"white"
				}).append($('<a>最新回复</a>').attr('href', hash).click(function() {
					fn_focus(hash);
					$tip.remove();
				})).append($('<a href="javascript:;">[x]</a>').click(function() {
					$tip.remove();
				}));
			
				$('body').append($tip);
			}
			
			//fix
			$('#sliderContainer').css('z-index', 10);
		
		
			if($replies.size()<10) return;
			var context = $('#comment_list').clone().find('.quote').remove().end().text();
			var need_fade = function($r) {
				var $msg = $r.find('.message');
				if($msg.size() == 0) $msg = $r.find('.cmt_sub_content');
				
				if(ext_opt('fadeSpam')) {
					var pts = judgeSpam($msg, context);
					if(pts > parseInt(ext_opt('fadeSpam'))) return true;
				}
				
				var n = Number(ext_opt('fadeGiant'));
				if(n > 0) {
					var r = $msg.height() / Math.max(600, $(window).height());
					if(r>n) return true;
				}
				
				var m = ext_opt('fadeOld');
				var l = $list.length;
				if(!m) return false	
				if(m=='d3') return k > l/3;
				if(m=='2sq') return k > 2*Math.sqrt(l);
				
				var dt = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec($list[k].find('.re_info').text())
				if(!dt) return false;
				dt = new Date(dt[1], dt[2]-1, dt[3]);
				var dayDiff = (Date.now() - dt.getTime()) / 1000 / 86400;
				if(m=='30d') return dayDiff > 30;
				if(m=='7d') return dayDiff > 7;
				if(m=='3d') return dayDiff > 3;
				console.error('fadeOld error');
				return false;
			}

			for(var k in $list) {//回复时间顺序遍历（新的在前
				if(need_fade($list[k])) {
					fn_fade($list[k]);
				}//fade
				
				
				if(ext_opt('emphasisNew')) {
					var $t = $list[k].find('.re_info:first');
					var now = Math.floor(k * 255 / $list.length);
					var color = now.toString('16').toUpperCase();
					var sofa = ["#F66", "#F96", "#FF6"];
					if(color.length==1) color = "0"+color;
					color = "#"+color+color+color;
					if(now < 180) {//dark
						$t.css({background:color, color:sofa[k]?sofa[k]:"#EEE"});
						if(k==0) $t.css('font-weight', 'bold');
					} else {//light
						$t.css({background:color, color:"#111"});
					}
					$t.find('a').css('background', '#EEE');
				}
			}

			/********************************************************
			 *Main Code End
			 ********************************************************/
		} catch(e) {
			console.log(e.stack);			
		}});//bind ext_init
		if(!is_extension) $('body').trigger('ext_init');
	}//end of main
	if(!is_extension) c_eval(main); else main();
})();