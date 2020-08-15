javascript: (function() {
	window.addScriptTag = function(fName, pn) {
		if (!fName) {
			fName = 'log';
		}
		if (!pn) {
			pn = 1;
		}
		var src = 'https://api.bilibili.com/x/v2/reply?callback=' + fName + '&jsonp=jsonp&pn=' + pn + '&type=1&oid=' + window.aid + '&sort=2&_=' + new Date().getTime();
		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("async", "async");
		script.src = src;
		document.body.appendChild(script);
	};
	/*获取data*/
	window.log = function(data) {
		this.data = data;
		console.log(window.data);
		this.allReply = [];
		this.allReply[0] = data.data.replies;
		getPage(data);
	};
	/*获取总页数*/
	window.getPage = function(data) {
		var data2 = data.data;
		this.page = data2.page;
		this.count = page.count;
		this.pageCount = Math.ceil(page.count / page.size);
		console.log(window.pageCount);
		getAllReply();
	};
	/*获取留言*/
	window.getReply = function(data) {
		var data2 = data.data;
		idx = idx + 1;
		this.allReply[idx] = data2.replies;
	};
	/*获取全部留言*/
	window.getAllReply = function() {
		this.idx = 0;
		for (i = 1; i < pageCount; i++) {
			addScriptTag('getReply', (i));
		}
	};
	/*分离出性别*/
	window.parseSex = function(data) {
		return data.member.sex;
	};
	/*性别统计*/
	window.sexCount = function() {
		sexData = [];
		sexData['男'] = 0;
		sexData['女'] = 0;
		sexData['保密'] = 0;
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				/*console.info(parseSex(allReply[idx1][idx2]));*/
				sexData[parseSex(allReply[idx1][idx2])]++;
			}
		}
		console.info(sexData);
		return sexData;
	};
	/*分离出用户等级*/
	window.parseLevel = function(data) {
		return data.member.level_info.current_level;
	};
	/*等级统计*/
	window.levelCount = function() {
		leveData = [];
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				var level=parseLevel(allReply[idx1][idx2]);
				if(!!leveData[level]){
					leveData[level]++;
				}else{
					leveData[level]=1;
				}
				/*console.info(parseLevel(allReply[idx1][idx2]));*/
			}
		}
		window.leveData=leveData;
		console.info(leveData);
		return leveData;
	};
	
	/*分离出评论时间*/
	window.parseReplyTime = function(data) {
		var nowdate=new Date(data.ctime*1000);
		return nowdate;
	};
	
	/*评论时间统计(年月)*/
	window.replyTimeCountByYearAndMonth = function() {
		replyTimeByYearAndMonthData = [];
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				var date=parseReplyTime(allReply[idx1][idx2]);
				var year=date.getYear()+1900;
				var month=date.getMonth()+1;
				var formateDate=year+"年"+month+"月";
				if(!!replyTimeByYearAndMonthData[formateDate]){
					replyTimeByYearAndMonthData[formateDate]++;
				}else{
					replyTimeByYearAndMonthData[formateDate]=1;
				}
				/*console.info(parseReplyTime(allReply[idx1][idx2]));*/
			}
		}
		window.replyTimeByYearAndMonthData=replyTimeByYearAndMonthData;
		console.info(replyTimeByYearAndMonthData);
		return replyTimeByYearAndMonthData;
	};
	
	/*评论时间统计(年月日)*/
	window.replyTimeCountByYearMonthAndDay = function() {
		replyTimeByYearAndMonthData = [];
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				var date=parseReplyTime(allReply[idx1][idx2]);
				var year=date.getYear()+1900;
				var month=date.getMonth()+1;
				var day=date.getDate();
				var formateDate=year+"年"+month+"月"+day+"日";
				if(!!replyTimeByYearAndMonthData[formateDate]){
					replyTimeByYearAndMonthData[formateDate]++;
				}else{
					replyTimeByYearAndMonthData[formateDate]=1;
				}
				/*console.info(parseReplyTime(allReply[idx1][idx2]));*/
			}
		}
		window.replyTimeByYearAndMonthData=replyTimeByYearAndMonthData;
		console.info(replyTimeByYearAndMonthData);
		return replyTimeByYearAndMonthData;
	};
	
	/**分离出评论内容和用户信息*/
	window.parseReplyContent = function(data) {
		var msgData={};
		msgData.message=data.content.message;
		msgData.userInfo=data.member;
		msgData.allInfo=data;
		return msgData;
	};
	/*评论关键词检索,content:检索的内容;numbers:匹配的字数;allMatch:是否全词匹配*/
	window.searchReplyContent = function(content,numbers,allMatch) {
		contents = [];
		var contentReg=new RegExp("([\\w\\W]*?)"+"(["+content+"]+)"+"([\\w\\W]?)");
		if(!!numbers){
			contentReg=new RegExp("([\\w\\W]*?)"+"(["+content+"]{"+numbers+"}+)"+"([\\w\\W]?)");
		}
		if(!!allMatch&&allMatch==true){
			contentReg=new RegExp("([\\w\\W]*?)"+"(["+content+"]{"+content.length+"}+)"+"([\\w\\W]?)");
		}
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				var msgData=parseReplyContent(allReply[idx1][idx2]);
				var message=msgData.message;
				if(contentReg.test(message)){
					msgData.message=message.replace(contentReg,"$1<span class='fRed'>$2</span>$3");
					contents.push(msgData);
					/*console.info(parseReplyContent(allReply[idx1][idx2]));*/
				}
			}
		}
		window.contents=contents;
		console.info(contents);
		return contents;
	};
	
	/*过滤粉丝用户信息*/
	window.filterFansReply = function (){
		fansData = [];
		for (idx1 in allReply) {
			for (idx2 in allReply[idx1]) {
				if(!!allReply[idx1][idx2].member.fans_detail){
					var userData=parseReplyContent(allReply[idx1][idx2]);
					fansData.push(userData);
				}
			}
		}
		window.fansData=fansData;
		console.info(fansData);
		return fansData;
	};
	
	/*初始化*/
	addScriptTag();
	
	/*创建子窗口*/
	window.createSubWin=function(){
		var subWin=window.open('','子窗口','width=900,height=600,left=450,top=200');
		var src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js";
		var subDoc=subWin.document;
		var subBody=subWin.document.body;
		window.iniJQ=function(){
			var script = subDoc.createElement('script');
			script.setAttribute("type", "text/javascript");
			script.setAttribute("async", "async");
			script.src = src;
			subDoc.head.appendChild(script);
		};
		iniJQ();
		var htmlContent=`<div id='tDiv'>tDiv用来替换内容</div>`;
		subDoc.write(htmlContent);
		subWin.data=window.data;
	};
	createSubWin();
})();
