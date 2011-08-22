$(function() {
	var PRG = {};
	window.epClass = function(ep) {
		var cls = [];
		if(ep.done) cls.push('done');
		cls.push(ep.onair ? 'air' : 'unair');
		return cls.join(' ');
	}
	window.renderAll = function() {
		$('#container').render($('#tmpl_loading'), {});
		BG.cacheGet(S.domain, function(o)
		{
			var $hp = BG.$(o);
			$('#container').empty();
			$hp.find('#prgSubjectList li').each(function()
			{
				var $a = $(this).find('a[subject_id]:last');
				var id = $a.attr('subject_id');
				var prg = PRG[id] = {
					ep:{},
					id:id,
					title:$a.attr('title'),
					count:{all:0,done:0,air:0},
					cover:$(this).find('img.grid').attr('src').replace(/((.+)\/cover\/g)/, '')
				};
				$hp.find('.prg_list a[subject_id='+id+']').each(function()
				{
					var $this = $(this), epid = parseInt($this.attr('id').split('_')[1]),
						onair = true,done = false, 
						$prg=$hp.find('#prginfo_'+epid);

					prg.count.all++;
					if($this.is('.epBtnWatched')) {
						prg.count.done++;
						done = true;
					}
					if(!$this.is('.epBtnNA,.epBtnToday')) {//如果没上映的就被抛弃/想看了会出Bug，暂时不解决
						prg.count.air++;
					} else {
						onair = false;
					}

					var airDate = /首播:([\d-]+)/.exec($prg.find('.tip').html());
					if(airDate) airDate = airDate[1];
					//else console.log($prg.find('.tip').html());

					prg.ep[parseInt($this.text(),10)] = {
						id:epid,
						title:$this.attr('title'),
						onair:onair,
						done:done,
						$tip:$prg.find('.tip'),
						airDate:airDate ? new Date(airDate) : false
					};
				});
				var $div = $('<div>');
				$div.appendTo('#container');
				$div.render($('#tmpl_bgm'), prg);
			});//prgli.each1
		}, {
			fail:function() {
				location.reload();
			},
			expire:900//i hate wating!
		});
	};
	renderAll();

	var renderOne = function(subject_id, num) {
		if('undefined' == typeof num) num=1;
		location.hash = subject_id+'#'+num;
		$('#container').render($('#tmpl_one'), $.extend({}, PRG[subject_id], {
			nowNum:num
		}));
	}
	
	
	$(document.body).delegate('.bgm .panel .past', 'mouseenter', function()
	{
		var $this = $(this);
		var $prg = $this.parent();
		$prg.find('.now .epinfo').stop(true, true).fadeTo('fast', 0);
		$prg.find('.now').stop(true, true).delay(200).animate({
			width:24,
			left:111,
		});
		$this.stop(true, true).animate({
			width:130,
		}, function() {
			$this.find('.hide').show();
		})
	}).delegate('.bgm .panel .past', 'mouseleave', function()
	{
		var $this = $(this);
		var $prg = $this.parent();
		$prg.find('.now .epinfo').stop(true, true).delay(200).fadeTo('fast', 1);
		$prg.find('.now').stop(true, true).animate({
			width:120,
			left:15,
		})
		$this.find('.hide').hide();
		$this.stop(true, true).animate({
			width:38,
		})
	});

	$(document.body).delegate('.bgm .panel .future', 'mouseenter', function()
	{
		var $this = $(this);
		var $prg = $this.parent();
		$prg.find('.now .epinfo').fadeOut('fast');
		$prg.find('.now').delay(200).animate({
			width:34,
		});
		$this.animate({
			width:110,
		}, function() {
			$this.find('.hide').show();
		})
	}).delegate('.bgm .panel .future', 'mouseleave', function()
	{
		var $this = $(this);
		var $prg = $this.parent();
		$prg.find('.now .epinfo').delay(200).fadeIn('fast');
		$prg.find('.now').animate({
			width:120,
		});
		$this.find('.hide').hide();
		$this.stop(true, true).animate({
			width:38,
		})
	}).delegate('.epbox li, .epinfo a.title', 'click', function()
	{
		var $this = $(this), id = $this.closest('*[subject_id]').attr('subject_id'),
			num = $this.closest('*[_num]').attr('_num'), epid = PRG[id].ep[num].id;
		//window.open(S.domain+'/ep/'+epid);
		renderOne(id, num);
	}).delegate('.panel .air-button', 'click', function()
	{
		var $this = $(this), id = $this.closest('*[subject_id]').attr('subject_id'),
			num = $this.closest('*[_num]').attr('_num'), epid = PRG[id].ep[num].id;

		var retry = function() {
			return retry.arguments.callee.apply(retry.this, retry.arguments);
		};
		retry.arguments = arguments
		retry.this = this;
		
		$this.removeClass('air-button');
		EXT.sendRequest({
			do:'injectAjax',
			options:{
				url:'/subject/ep/'+epid+'/status/watched?ajax=1',
				type:'POST',
				headers:{'Content-Type':'application/xml'}
			}
		}, function(res) {
			if('success' == res.status) {
				PRG[id].ep[num].done = true;
				PRG[id].count.done += 1;
				console.log(PRG[id]);
				BG.cacheGet.reset(S.domain);
				BG.cacheGet(S.domain, false, {force:true});
				renderAll();
				$(document.body).trigger('mbp-done', [epid]);
			} else {
				setTimeout(retry, 2000);
			}
		});
	}).delegate('.epinfo .discuss', 'click', function()
	{
		var $this = $(this), id = $this.closest('*[subject_id]').attr('subject_id'),
			num = $this.closest('*[_num]').attr('_num'), epid = PRG[id].ep[num].id;
		$(document.body).bind('mbp-done.'+epid, function(event, _epid) {
			if(epid!=_epid) return;
			$(document.body).unbind('mbp-done.'+epid);
			window.open(S.domain+'/ep/'+epid);
		})
	}).delegate('.one .epframe .prev, .one .epframe .next', 'mouseenter', function()
	{
		var $this = $(this), isPrev = $this.is('.prev'), $epbox=$('.one .epbox'),
		left = -$epbox.position().left,
		$lastli = $('.one .epbox li:last'),
		right = $lastli.offset().left + 29 - $('.one .epframe .next').offset().left;

		if(isPrev && 0 >= left) return;
		if(!isPrev && 0 >= right) return;

		var spd = 100;
		$this.addClass('hover');
		$this.bind('mousedown.ep-scroll', function() {
			spd = 20;
		}).bind('.mouseup.ep-scroll', function() {
			spd = 100;
		})
		setTimeout(function() {
			var left = -$epbox.position().left,
			$lastli = $('.one .epbox li:last'),
			right = $lastli.offset().left + 29 - $('.one .epframe .next').offset().left;

			if(!$this.is('.hover')) return;
			if(isPrev && 0 >= left) return;
			if(!isPrev && 0 >= right) return;
			
			$epbox.animate({
				left:isPrev?'+=29':'-=29'
			}, spd, 'linear', arguments.callee);
		});
	}).delegate('.one .epframe .prev, .one .epframe .next', 'mouseleave', function()
	{
		var $this = $(this), isPrev = $this.is('.prev'), $epbox=$('.one .epbox');
		$this.removeClass('hover');
	});
	
	$('head').append('<base target="_blank" />')
});
