// ==UserScript==
// @name           BGM home
// @description    Bangumi首页优化
// @author         McFog wxyuan90#gmail.com
// @include        http://bangumi.tv/
// @include        http://bgm.tv/
// @include        http://chii.in/
// @version        0.1.0130
// ==/UserScript==

(function() {	

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
		var is_extension = true;
		$.fn.last = function() {
			return $(this).filter(":last");	
		}
		$('body').one('ext_init', function(ev, S) {try{
			var ext_opt = function(k, d) {
				if(arguments.length < 2) d = true;//default is true
				if(!is_extension) return d;
				return S[k];
			}
			var s = 'if(!window.MBP) window.MBP = {S:JSON.parse("'+JSON.stringify(S).replace(/["\\]/g, function(m) {return "\\"+m})+'")}';
			c_eval(s);
			/********************************************************
			 *Main Code here
			 ********************************************************/
			var style = {//settings?!
				fold_handler:{'text-align':'center',background:'#EEE',width:32,height:32,'line-height':'32px'}
			}
			var $home = $('#columnHomeA');
			if($home.size()==0) return;//不是首页T_T
			
			//utils
			var sto = function(fn) {
				return function() {
					setTimeout(fn);
				}
			};
			

			//看过后自动进入讨论
			if(ext_opt('watchedAndGo')) c_eval(function() {
				$(document).bind('ajaxSuccess', function(e, xhr, setting) {
					if(!setting) return;
					var m = /\/subject\/ep\/(\d+?)\/status\/watched/.exec(setting.url);
					if(!m) return;
					if(setting.data) return;
					var id = m[1];
					var u = "/subject/ep/" + id;
					location = u;
				});
				$('#subject_prg_content a.ep_status[id^=Watched_]').attr("title", "标记后自动跳转至讨论");
			})
			
			//右侧TL单个消息高度限制
			$('.timeline_img li').css('max-height', 80).click(function() {//点击还原
				$(this).css('max-height', null)
			});
			
			//减少Sumomo Board条数
			$('.SidePanel:last').css('margin-top', -25).click(function() {//点击还原
				$(this).find('li').show('fast');
			}).find('li:gt(1)').hide();
						
			/********************************************************
			 *Main Code End
			 ********************************************************/
		} catch(e) {
			console.log(e.stack);
		}});//bind ext_init
	}//end of main

	if(!is_extension) c_eval(main); else main();		
	//c_eval(main)
})();