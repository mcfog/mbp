checkVer(function(oldV, newV) {
	if(oldV<3) {
		chrome.tabs.create({
			url:U('options.html')
		})
		return;
	}
	if(oldV<4) {
		BG.util.deskPop('<a href="http://bangumi.tv/group/topic/4509">版本升级成功</a>，增加了新特性『优化顶部导航』哦，去设置看看吧');
		S.verno = 4;
	}
	if(oldV<5) {
		BG.util.deskPop('<a href="http://bangumi.tv/group/topic/4509">版本升级成功</a>，增加了新特性『虚化灌水回复』哦，去设置看看吧');
		S['fadeSpam'] = 80;
		S.verno = 5;
	}
	if(oldV<6) {
		BG.util.deskPop('<a href="http://bangumi.tv/group/topic/4509">版本升级成功</a>，增加了<a href="http://bangumi.tv/group/topic/4552">新特性『自定义全站导航』</a>哦，去看看吧');
		S.verno = 6;
	}
	if(oldV<7) {
		BG.util.deskPop('<a href="http://bangumi.tv/group/topic/4509">版本升级成功</a>，增加了<a href="http://bangumi.tv/group/topic/4598">新特性『虚化过高回复』</a>哦，去看看吧');
		S['fadeGiant'] = '1.0';
		S.verno = 7;
	}
	if(oldV<8) {
		BG.util.deskPop('<a href="http://bangumi.tv/group/topic/4509">版本升级成功</a>，增加了<a href="http://bangumi.tv/group/topic/4600">新特性『快速修改签名/昵称』</a>，<a href="chrome-extension://jgndofnpoajhigelckkhljijlmmalkgl/navdrag.html">另外弹出窗口导航也可以自定义</a>了，去看看吧');
		S.removeItem('home_tl_more');	
		var sav = JSON.tryParse(S.navbar_slot)||{};
		sav.nav = JSON.tryParse(S.navbar) || JSON.tryParse(BG.navdrag.data.origin);
		S.navbar_slot = JSON.stringify(sav);
		S.removeItem('navbar');
		S.verno = 8;
	}
	if(oldV<9) {
		var sav = JSON.tryParse(S.navbar_slot)||{};
		S.pop = JSON.tryParse(BG.navdrag.data.originPop);//T_T手滑*2
		S.navbar_slot = JSON.stringify(sav);
		S.verno = 9;
	}
	if(oldV<10) {
		S.removeItem('pop');
		var sav = JSON.tryParse(S.navbar_slot)||{};
		sav.pop = JSON.tryParse(BG.navdrag.data.originPop);
		S.navbar_slot = JSON.stringify(sav);
		S.verno = 10;
	}
	if(oldV<11) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/4608">新特性『批量查看同步率』哦</a>，去看看吧');
		S.xPic = 'y';
		S.verno = 11;
	}
	if(oldV<12) {
		BG.util.deskPop('版本升级成功，一下子增加了两个功能哦，<a href="http://bangumi.tv/group/topic/4780">『自定义春菜』</a>还有<a href="http://bangumi.tv/group/topic/4968">『大光头求交往』</a>，去看看吧');
		S.guangtou = 'y';
		S.verno = 12;
	}
	if(oldV<13) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/5020">未看章节计数</a>，去看看吧');
		S.verno = 13;		
	}
	if(oldV<14) {
		//RC1, XSK
		S.removeItem('progressTweak')
		S.removeItem('hlToday')
		S.removeItem('foldSections')
		S.removeItem('ydTenkai')
		S.removeItem('tpTenkai')
		S.verno = 14;
	}
	if(oldV<15) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/5112">RC1首页调教</a>，去看看吧');
		S.verno = 15;
	}
	if(oldV<16) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/5156">嵌入移动版</a>，去看看吧');
		S.verno = 16;
	}
	if(oldV<17) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/5184">隐藏章节页面的在线播放</a>，去看看吧');
		S.verno = 17;
	}
	if(oldV<18) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/topic/6304">RT功能</a>，去看看吧');
		S.verno = 18;
	}
	if(oldV<19) {
		BG.util.deskPop('版本升级成功，增加了<a href="http://bangumi.tv/group/t	opic/8245">进度管理</a>，去看看吧');
		S.verno = 19;
		
		var NAV = BG.navdrag.slot.read("pop");
		NAV[1].push({
			href:'/progress/index.html',
			text:'进度管理'
		})
		BG.navdrag.slot.write("pop", NAV);
	}
	
	if(oldV<20) {
		S.removeItem('noTL');
		BG.util.deskPop('版本升级成功，增加了<a href="http://bgm.tv/group/topic/9850">谷娘搜索</a>，去看看吧');
		S.verno = 20;
	}
	if(oldV<21) {
		S.csePos = "0"
		S.verno = 21;
	}
});

