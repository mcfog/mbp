chrome.extension.sendRequest({
	do: "getOptions"
}, function (S) {	
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
	
	var wait_body = function(cb) {
		setTimeout(function() {
			if(document.readyState!='uninitialized' && $(document.body).html()) {
				cb();
			} else {
				setTimeout(arguments.callee, 10);
			}
		});
	};

	//自动跳转
	if(S['domainAutoJump'] && location.origin != S['domain']) location = S['domain'] + location.pathname + location.search + location.hash;
	
	if(S.noCalendar && location.pathname == '/') setTimeout(function() {
		if(document.readyState!='uninitialized' && $('body').html()) {
			$('body').prepend('<style>.calendarMini{display:none}</style>');
			$(function() {
				$('.calendarMini').closest('.SidePanelLow').hide();
				$('#header').append($('&nbsp;<a href="javascript:;">每日放送</a>').one('click', function() {
					$(this).remove();
					$('.calendarMini').show().closest('.SidePanelLow').show();
				}))
			})
		} else {
			setTimeout(arguments.callee, 10);
		}
	});	
	if(S.noProgress && location.pathname == '/') setTimeout(function() {
		if(document.readyState!='uninitialized' && $('body').html()) {
			$('body').prepend('<style>#prgManager{display:none}</style>');
			$(function() {
				$('#header').append($('&nbsp;<a href="javascript:;">进度管理</a>').one('click', function() {
					$(this).remove();
					$('#prgManager').show()
					c_eval(function() {
						$('#prgCatrgoryFilter a:first').trigger('click')
					});
				}))
			})
		} else {
			setTimeout(arguments.callee, 10);
		}
	});
	
	
	if(S['betterNav'] && S['navbar']) setTimeout(function() {
		if(document.readyState!='uninitialized' && $('body').html()) {
			$('body').prepend('<style class="_betterNav">#nav_menu {opacity:0.5;}</style>');
		} else {
			setTimeout(arguments.callee, 10);
		}
	});

	if(S.hideOnline && /\/ep\/\d+$/.test(location.pathname)) setTimeout(function() {
		if(document.readyState!='uninitialized' && $('body').html()) {
			$('body').prepend('<style class="_hideOnline">#online{display:none}</style>');
		} else {
			setTimeout(arguments.callee, 10);
		}
	});


	if(S.ukagakaShell) setTimeout(function() {
		var $ukagaStyle = function(u) {
			var r = '#ukagaka_shell>div:first-child{'
			r += 'background:url('+u.bg+') no-repeat 100% 0;'
			if(u.bpx) r += 'background-position-x:'+u.bpx+';'
			if(u.bpy) r += 'background-position-y:'+u.bpy+';'
			r += 'width:'+u.width+';height:'+u.height+';'
			r += '}';
			return $('<style>').html(r).addClass('_ukagakaShell');
		}
		if(document.readyState!='uninitialized' && $('body').html()) {
			var t = JSON.tryParse(S.ukagakaShell);
			if(t && t.bg) $('body').prepend($ukagaStyle(t));
		} else {
			setTimeout(arguments.callee, 50);
		}
	});
	
			
	if(S.hideRating && /^\/subject/.test(location.pathname)) setTimeout(function(){
		if(document.readyState!='uninitialized' && $('body').html()) {
			$('body').prepend('<style>.global_rating,#ChartWarpper{opacity:0.01}</style>');
			$(function() {
				var $r = $('.global_rating,#ChartWarpper');
				$r.one('dblclick', function() {
					$r.attr('title','').fadeTo('fast', 1);
				}).attr('title', '双击显示');
				if($('#rate-tip').html()) $r.dblclick();
			});
		} else {
			setTimeout(arguments.callee, 50);
		}		
	})

});