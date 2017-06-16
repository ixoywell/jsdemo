/* 设置变量 */
loopbase = Math.round(Math.random() * 100);
paperid  = Math.random() * 100000000 * 100000000;
/* 显示/隐藏题目 */
function displayQuestion(qid,flag)
{	
	var display = 'none';
	if(flag == 1) display = '';

	var obj;
	if(obj = document.getElementById("dl_q_" + qid))
	{	
		if(obj.style.display != display) //
		{
			obj.style.display = display;
			enableQuestion(qid,flag);
		}
	}
	
	if(obj = document.getElementById("tr_" + qid))
	{	
		if(obj.style.display != display) //
		{
		obj.style.display = display;
		enableQuestion(qid,flag);
		}
	}
	
	if(obj = document.getElementById("t_" + qid))
	{
		enableQuestion(qid,flag);
		obj.style.display = display;
		var tblobj = obj.parentNode.parentNode.parentNode;
		if(tblobj.rows)
		{
			var opt_len = question[qid].length;
			for(var i=0;i<opt_len;i++)
			{
				var objtmp = document.getElementById("t_" + qid + "_" + question[qid][i]);
				if(objtmp)
				{
					objtmp.style.display = display;
				}
			}
		}
	}
}

/* 使题目有效/无效 */
function enableQuestion(qid,flag)
{
	var disa = true;
	if(flag == 1) disa = false;
	var obj = document.getElementById("q_" + qid);
	if(obj)
	{
		obj.disabled = disa;
		if(obj.selectedIndex) obj.selectedIndex = 0;
		else obj.value = '';
		
		if(disa)
		{
			if(obj.onchange) obj.onchange();
		}
	}
	obj = document.getElementById("q_" + qid + "_other");
	if(obj)
	{
		obj.disabled = disa;
	}
	
	var funcs = new Array();
	var pattern = new RegExp("[a-zA-Z]+\\([^\\)]*\\);?","ig");	
	var pattern2 = new RegExp("this","i");
	var opt_len = question[qid].length;
	
	for(var i=0;i<opt_len;i++)
	{
		var objtmp = document.getElementById("q_" + qid + "_" + question[qid][i]);
		if(objtmp)
		{
			objtmp.disabled = disa;
			objtmp.checked = false;
		}
	}

	/*
	for(var i=0;i<opt_len;i++)
	{
		if(disa)
		{
			if(objtmp && objtmp.onclick)
			{
				var match_res = objtmp.onclick.toString().match(pattern);
				if (match_res != null && match_res.length > 1)
				{
					for(var j=1;j<match_res.length;j++)
					{
						if (!inArray(match_res[j],funcs))
						{
							//替换this
							var cmd = match_res[j].replace(pattern2,"objtmp");
							//执行函数
							eval(cmd);							
							//放入数组
							funcs.push(match_res[j]);
						}
					}
				}
			}
		}
	}
	*/
}

/* 显示/隐藏答案 */
function displayAnswer(qid,aid,flag)
{
	var display = 'none';
	if(flag == 1) display = '';
	
	var obj = document.getElementById("q_" + qid + "_" + aid);
	if(obj)
	{
		var pobj = obj.parentNode;
		if(pobj)
		{
			//pobj.style.display = display;
		}
		obj.disabled = !flag;
	}
}

/* 使答案有效/无效 */
function enableAnswer(qid,aid,flag)
{
	var obj = document.getElementById("q_" + qid + "_" + aid);
	if(obj)
	{
		obj.disabled = !flag;
	}
}

/* 判断已选择数量 */
function countSelected(qid)
{
	var obj;
	var cnt = 0;

	var len = question[qid].length;
	for (var i=0; i<len; i++)
	{
		var id = "q_" + qid + "_" + question[qid][i];
		obj = document.getElementById(id);
		if (obj && obj.checked)
		{
			cnt++;
		}
	}

	return cnt;
}

/* 判断答案是否被选择 */
function judgeAnswerSelected(qid,aid)
{
	var obj = document.getElementById("q_" + qid + "_" + aid);
	if(obj)
	{
		if(obj.selected || obj.checked) return true;
	}
	
	return false;
}

/* 判断文本长度 */
function judgeTextLength(qid,len)
{
	var obj = document.getElementById("q_"+qid);
	obj.value = obj.value.replace("/(^\s*)|(\s*$)/g", "");
	if(obj.value.length > len)
	{
		if($("dl_q_"+qid) != null) location.href="#dl_q_"+qid;
		else if($("tr_"+qid) != null) location.href="#tr_"+qid;
		else if($("t_"+qid) != null) location.href="#t_"+qid;
		else if($("s_"+qid) != null) location.href="#s_"+qid;
		
		setQuestionAlert(qid);
		alert('文本长度超过限制!');
		return false;
	}
	
	return true;
}

/* 判断文本是否为数字 */
function judgeOnlyNumeric(qid,onlyNumeric)
{	
	if(onlyNumeric ==1) {
		var pageid = getPageid();
		var re=/^[0-9]*$/;
		if(inArray(qid,page[pageid])) {
			var obj = document.getElementById("q_"+qid);
			if(obj && re.test(obj.value)==false)
			{
				setQuestionAlert(qid);
				alert('只允许输入数字!');
				return false;
			}			
			
		}
	}
	return true;
}

/* 判断多选题选择数是否完成*/
function judgeMultiLimitMust(qid,count)
{	
	var pageid = getPageid();
	if(inArray(qid,page[pageid])) {
		var obj = document.getElementById("dl_q_"+qid);
		if(obj)
		{	
			var selcnt = countSelected(qid);
			if(selcnt > 0 && selcnt < count) 
			{
				setQuestionAlert(qid);
				alert('此题必须选'+count+'项！');
				return false;
			}
		}			
	}
	return true;
}

/* 判断文本是否为数字 */
function checkOnlyNumeric(qid,onlyNumeric)
{	
	if(onlyNumeric == 1) 
	{
		var   re=/^[0-9]*$/;
		var obj = document.getElementById("q_"+qid);
		var objErr = document.getElementById("q_"+ qid + "_error");
		if(obj && objErr && re.test(obj.value)==false)
		{	
			setQuestionAlert(qid);
			objErr.innerHTML = "<font color='red'>只允许输入数字!</font>";
			//obj.focus();
			return false;
		}
		objErr.innerHTML = "";
	}
	return true;
}


/* 显示/隐藏问题组 */
function displayGroup(gid,flag)
{
	var display = 'none';
	if(flag == 1) display = '';
	
	var obj = document.getElementById("dl_g_"+gid);
	if(obj)
	{
		obj.style.display = display;
		/*	var ques_len = group[gid].length;
		for(var i=0;i<ques_len;i++)
		{
			displayQuestion(group[gid][i],flag);
		}*/
	}
}

/* 判断值是否在数组中 */
function inArray(val,arr)
{
	for(var i=0;i<arr.length;i++)
	{
		if(val == arr[i]) return true;
	}
	return false;
}

/* 设置描述中的变量 */
function setDescValue(id,name,value)
{
	var obj = document.getElementById("n_" + id + "_" + name);
	
	if(obj)
	{
		obj.innerHTML = value;
	}
}

/* 检查题目是否为空 */
function checkQuestionEmpty(qid)
{
	var flag = true;
	
	//check display
	var o = null;
	if($("dl_q_"+qid) != null) o = $("dl_q_"+qid);
	else if($("tr_"+qid) != null) o = $("tr_"+qid);
	else if($("t_"+qid) != null) o = $("t_"+qid);
	else if($("s_"+qid) != null) o = $("s_"+qid);

	var hideflag = false;
	while (o)
	{
		if (o.tagName == 'BODY') break;

		if (o.style.display == 'none') hideflag = true;
		o = o.parentNode;
	}
	if (hideflag) return true;
	
	var obj = document.getElementById("q_" + qid);
	if(obj)
	{
		flag = false;
		var otherobj = document.getElementById("q_"+qid+"other");
		if(otherobj != null)
		{
			if(otherobj.style.display == '' && (otherobj.value.Trim() == '' || otherobj.value == '请选择...')) 
			{
				flag = true;
			}
		}
		if(obj.disabled == false && obj.value.Trim() == '')
		{
			flag = true;
		}
	}
	else
	{
		var isset = 0;
		if (question[qid])
		{
			var opt_len = question[qid].length;
			for(var i=0;i<opt_len;i++)
			{
				var objtmp = document.getElementById("q_" + qid + "_" + question[qid][i])
				if (objtmp && objtmp.disabled == false)
				{
					isset = 1;
					if (objtmp.checked || objtmp.selected)
					{
						flag = false;
						break;
					}
				}
			}
		}
		if(isset == 0) flag = false;
	}
	
	if(flag)
	{
		try
		{
			for(i=0;i<=pagecnt;i++)
			{
				if(!page[i]) continue;
				for(j=0;j<page[i].length;j++)
				{
					if(qid == page[i][j]) break;
				}
				if(j<page[i].length) break;
			}
			if(i!=1){
				if(i>pagecnt) goPage(pagecnt);
				else goPage(i);	
			}
			
		}
		catch (ex)
		{
		}
		
		if($("dl_q_"+qid) != null) location.href="#dl_q_"+qid;
		else if($("tr_"+qid) != null) location.href="#tr_"+qid;
		else if($("t_"+qid) != null) location.href="#t_"+qid;
		else if($("s_"+qid) != null) location.href="#s_"+qid;
		
		setQuestionAlert(qid);
		alert('此题目为必答题!');
		return false;
	}
	else
	{
		return true;
	}
}
function checkQuestion()
{
	var flag = true;
	for(var i=0;i<must.length;i++)
	{
		flag = checkQuestionEmpty(must[i]);
		if (!flag) break;
	}
	return flag;
}

/* 设置题目醒目显示 */
function setQuestionAlert(qid)
{
	var alt_bgcolor = "#FEC";
	if($("dl_q_"+qid) != null)
	{
		$("dl_q_"+qid).style.backgroundColor = alt_bgcolor;
	}
	else if($("tr_"+qid) != null)
	{
		$("tr_"+qid).style.backgroundColor = alt_bgcolor;
	}
	else if($("t_"+qid) != null)
	{
		var obj = $("t_"+qid);
		obj.style.backgroundColor = alt_bgcolor;
		var sub_len = question[qid].length;
		for(var i=0;i<sub_len;i++)
		{
			var objtmp = document.getElementById("t_" + qid + "_" + question[qid][i]);
			if (objtmp)
			{
				objtmp.style.backgroundColor = alt_bgcolor;
			}
		}
	}
	else if ($("s_"+qid) != null)
	{
		var obj = $("s_"+qid);
		obj.parentNode.style.backgroundColor = alt_bgcolor;
		obj.focus();
	}
}

/* 清除题目醒目显示 */
function clearQuestionAlert(qid)
{
	if($("dl_q_"+qid) != null)
	{
		$("dl_q_"+qid).style.backgroundColor = "";
	}
	else if($("tr_"+qid) != null)
	{
		$("tr_"+qid).style.backgroundColor = "";
	}
	else if($("t_"+qid) != null)
	{
		var obj = $("t_"+qid);
		obj.style.backgroundColor = "";
		var sub_len = question[qid].length;
		for(var i=0;i<sub_len;i++)
		{
			var objtmp = document.getElementById("t_" + qid + "_" + question[qid][i]);
			if (objtmp)
			{
				objtmp.style.backgroundColor = "";
			}
		}
	}
	else if($("s_"+qid) != null)
	{
		var obj = $("s_"+qid);
		obj.parentNode.style.backgroundColor = "";
	}
}

//题目关系实现
/* 检查答案选择数 3 */
function chkSelCount(obj,cnt)
{
	if(obj.checked)
	{
		var pattern = /q_([0-9]+)/i;
		var tmp = pattern.exec(obj.id);
		if(tmp[1] != null) var qid = tmp[1];
		
		var selcnt = countSelected(qid);
		
		if(selcnt > cnt)
		{
			alert('此题目最多允许选择'+cnt+'项!');
			obj.checked = false;
		}
	}
}


/* 检查其它答案是否被选择 4 */
function chkOtherAnswer(qid,aid,oqid,oaid,flag)
{
	var obj = document.getElementById('q_'+qid+'_'+aid);
	if(obj == null) return ;
	var havesel = false;
	if(flag == 1)
	{
		havesel = true;
	}
	
	var tmp = judgeAnswerSelected(oqid,oaid);
	
	if(tmp != havesel)
	{
		if(obj.selected != null) obj.selected = false;
		if(obj.checked != null) obj.checked = false;
	}
}
/* 设置其它题目取消选择 4 */
function setOtherAnswer(qid,aid,oqid,oaid,flag)
{
	var obj = document.getElementById('q_'+qid+'_'+aid);
	if(obj == null) return ;
	
	var havesel = false;
	if(flag == 1)
	{
		havesel = true;
	}
	
	var oObj = document.getElementById('q_'+oqid+'_'+oaid);
	if(oObj == null) return ;
	
	if((obj.selected != null && obj.selected != havesel) || (obj.checked != null && obj.checked != havesel))
	{
		if(oObj.selected != null) oObj.selected = false;
		if(oObj.checked != null) oObj.checked = false;
	}	
}
/* 设置其它题目/题目组显示 5 */
function setQuestionDisplay(qid,aid,idstr,flag) 
{	
	var oldflag = flag;
	var tmp = aid.split(',');
	var checked = 0;
	var obj;
	for(var i=0;i<tmp.length;i++)
	{
		obj = document.getElementById('q_'+qid+'_'+tmp[i]);
		if(obj == null) continue;
		if(obj.selected || obj.checked) 
		{
			checked = 1;
			break;
		}
	}

	if(checked != 1)
	{
		flag = (flag == 1)? 0:1;
	}
	
	var ids = idstr.split(',');
	for(var i=0;i<ids.length;i++)
	{
		if(ids[i].Trim() == '') continue;
		if(ids[i].substr(0,1) == 'G')  displayGroup(ids[i].substr(1,ids[i].length),flag);
		if(ids[i].substr(0,1) == 'Q')  displayQuestion(ids[i].substr(1,ids[i].length),flag);
	}
	
	//////////////////// 
	/*
	var index = qid+'_'+aid+'_'+oldflag;
	//alert(index);
	//alert(relation[index]);
	for(var i=0;i<relation[index].length;i=i+2)
	{
		var ids = relation[index][i].split(',');
		for(var j=0;j<ids.length;j++)
		{
			if(ids[j].Trim() == '') continue;
			if(ids[j].substr(0,1) == 'G')  displayGroup(ids[j].substr(1,ids[j].length),relation[index][i+1]);
			if(ids[j].substr(0,1) == 'Q')  displayQuestion(ids[j].substr(1,ids[j].length),relation[index][i+1]);
		}
	}
	*/
	
	////////////////////

	for(var j=0; j<tmp.length; j++)
	{
		var index = qid+'_'+tmp[j]+'_'+oldflag;
		//alert(index);
		//alert(relation[index]);

		for(var i=0;i<relation[index].length;i=i+2)
		{
			var ids = relation[index][i].split(',');
			for(var k=0;k<ids.length;k++)
			{
				if(ids[k].Trim() == '') continue;
				if(ids[k].substr(0,1) == 'G')  displayGroup(ids[k].substr(1,ids[k].length),relation[index][i+1]);
				if(ids[k].substr(0,1) == 'Q')  displayQuestion(ids[k].substr(1,ids[k].length),relation[index][i+1]);
			}
		}
	}
	
}
/* 设置其它答案显示 6 */
function setAnswerDisplay(qid,aid,oqid,oaid,flag)
{
	var tmp = aid.split(',');

	var checked = 0;
	for(var i=0;i<tmp.length;i++)
	{
		var obj = document.getElementById('q_'+qid+'_'+tmp[i]);
		if(obj == null) return ;
		if(obj.selected || obj.checked) 
		{
			checked = 1;
			break;
		}		
	}
	
	if(checked != 1)
	{
		flag = (flag == 1)? 0:1;
	}		
	
	var tmp1 = oaid.split(',');	
	for(var j=0;j<tmp1.length;j++)
	{
		var obj1 = tmp1[j];
		if(obj1 == null) continue;
		displayAnswer(oqid,obj1,flag);		
	}	
}
/* 设置其它题目描述中的变量 */
function setVariableInDesc(qid,oqidstr,name)
{
	var value = '';
	
	var obj = document.getElementById('q_'+qid);
	if(obj)
	{
		if(obj.selectedIndex != null) 
		{
			if(obj.value != '')	value=obj.options[obj.selectedIndex].text;
			else value = '';
		}
		else value = obj.value;
	}
	else
	{
		var opt_len = question[qid].length;
		for(var i=0;i<opt_len;i++)
		{
			var obj = document.getElementById("q_" + qid + "_" + question[qid][i]);
			var lobj = document.getElementById("l_" + qid + "_" + question[qid][i]);
			if (obj && obj.checked && lobj)
			{
				value += lobj.value + ",";
			}
		}
		if(value.length > 0) value = value.substr(0,value.length-1);
	}
	
	var ids = oqidstr.split(',');
	for(var i=0;i<ids.length;i++)
	{
		setDescValue(ids[i].toLowerCase(),name,value);
	}
}

/* 跳转到某页 */
function goPage(pageNo)
{
	//设置页号
	survey_pageid = pageNo;

	var pageobj;
	var btnobj;
	var introobj = document.getElementById("intro");
	var infoobj = document.getElementById("infoContent");
	
	//隐藏版块，页面
	hideInfo(1);
	hideContent(1);
	if(introobj) introobj.style.display = 'none';
	if(infoobj) infoobj.style.display = 'none';
	for(var i=0;i<=pagecnt;i++)
	{
		pageobj = document.getElementById("p_"+i);
		if(pageobj) pageobj.style.display = 'none';
		btnobj = document.getElementById("prev"+i);
		if(btnobj) btnobj.style.display = 'none';
		btnobj = document.getElementById("next"+i);
		if(btnobj) btnobj.style.display = 'none';
	}
	btnobj = document.getElementById("submit1");
	if(btnobj) btnobj.style.display = 'none';
	
	//显示当前页
	if(pageNo == 0) 
	{
		introobj.style.display = '';
		hideInfo(0);
		btnobj = document.getElementById("next0");
		if(btnobj) btnobj.style.display = '';
	}
	else
	{
		hideContent(0);
		pageobj = document.getElementById("p_"+pageNo);
		if(pageobj)
		{
			btnobj = document.getElementById("prev"+pageNo);
			if(btnobj) btnobj.style.display = '';
			btnobj = document.getElementById("next"+pageNo);
			if(btnobj) btnobj.style.display = '';
			pageobj.style.display = '';
		}
	}
	//显示页号
	var obj = document.getElementById("next0");
	if(obj) 
	{
		pageNo++;
	}
	else
	{
		if(pageNo == 1) introobj.style.display = '';
	}
	obj = document.getElementById("page");
	if(obj) obj.innerHTML = pageNo;
	
	if(pageNo == pagecnt)
	{
		btnobj = document.getElementById("submit1");
		if(btnobj) btnobj.style.display = '';
	}
	
	window.scrollTo(0,0);
	
	if(pageNo != pagecnt) {
		var skipflag = 1;
		for(j=0;j<page[pageNo].length;j++)
		{
			var qid = page[pageNo][j];
			
			var obj = null;
			if($("dl_q_"+qid) != null) obj = $("dl_q_"+qid);
			else if($("tr_"+qid) != null) obj = $("tr_"+qid);
			else if($("t_"+qid) != null) obj = $("t_"+qid);
			else if($("s_"+qid) != null) obj = $("s_"+qid);
			
			while (obj && obj.style.display != 'none')
            {
	            if (obj.tagName == 'DL') break;
	            obj = obj.parentNode;
            }
			if(obj && obj.style.display != 'none') 
			{
				skipflag = 0;
				break;
			}
		}
		if(skipflag == 1) {
			goPage(pageNo+1);
		}
	}
}

//显示/隐藏问卷内容
function hideContent(flag)
{
	var disp = '';
	if(flag == 1)
	{
		disp = 'none';
	}
	
	var obj = document.getElementById('survey');
	if(obj) obj.style.display = disp;
	
	var obj = document.getElementById('surveyContent');
	if(obj) obj.style.display = disp;
}

//显示/隐藏基本信息
function hideInfo(flag)
{
	var disp = '';
	if(flag == 1)
	{
		disp = 'none';
	}
	
	var obj = document.getElementById('info');
	if(obj) obj.style.display = disp;
	
	var obj = document.getElementById('infoContent');
	if(obj) obj.style.display = disp;
}

//分页提交相关函数
//返回值处理
function dealPostResponse()
{
	if (postObj.readyState == 4 || postObj.readyState == 'complete')
	{
		//如果返回的内容不为空，则修改COOKIE值
		if (postObj.responseText.length == 13)
		{
			var pattern = new RegExp("[^0-9]+","i");
			if (!pattern.test(postObj.responseText))
			{
				var obj = document.getElementById("paperid");
				if (obj)
				{
					var c_value = getCookie("haveanswer" + obj.value);
					if (c_value)
					{
						c_value = postObj.responseText + c_value.substr(13);
						var Then = new Date();
						Then.setTime(Then.getTime() + 14400 * 1000);
						document.cookie = "haveanswer" + obj.value + "=" + c_value + ";expires=" + Then.toGMTString() + ";path=/;domain=163.com;";
					}
				}
			}
		}
	}
	//使按钮有效
	var i = 0;
	var btnobj;
	while (true)
	{
		btnobj = document.getElementById("next" + i);
		if (btnobj) btnobj.disabled = false;
		else if (i > 0) break;
		i++;
	}
	btnobj = document.getElementById("submit1");
	if (btnobj) btnobj.disabled = false;
}
//创建XMLHttpRequest对象
function getHttpRequestObj(handle)
{
	var xmlObj = null; 
	if(window.XMLHttpRequest)
	{
		xmlObj = new XMLHttpRequest(); 
	}
	else if(window.ActiveXObject)
	{
		xmlObj = new ActiveXObject("Microsoft.XMLHTTP"); 
	}
	
	xmlObj.onreadystatechange = handle;
	
	return xmlObj;
}
//提交数据
function postPageAnswer(pageid)
{
	var content = "";
	//取基本信息
	var obj;
	obj = document.getElementById("paperid");
	if (!obj) return;
	content += obj.name + "=" + obj.value;
	//取隐含问题
	for(var i=0;i<hidden.length;i++)
	{
		obj = $("q_" + hidden[i]);
		if (obj) content += "&" + obj.name + "=" + encodeURIComponent(encodeURIComponent(obj.value));
	}
	//取所有已填写页面
	for (var i=0;i<=pageid;i++)
	{
		//page[i] = page[pageid];
		if (!page[i])
		{
			continue;
		}
		//取所有题目
		for (var j=0;j<page[i].length;j++)
		{
			//填空和下拉列表
			obj = $("q_" + page[i][j]);
			if (obj)
			{
				if (obj.disabled) continue;
				content += "&" + obj.name + "=" + encodeURIComponent(encodeURIComponent(obj.value));
				continue;
			}
			//单选和多选
			for(var k=0;k<question[page[i][j]].length;k++)
			{
				obj = $("q_" + page[i][j] + "_" + question[page[i][j]][k]);
				if (obj && !obj.disabled && obj.checked)
				{
					content += "&" + obj.name + "=" + encodeURIComponent(encodeURIComponent(obj.value));
				}
			}
			//其它文本框
			obj = $("q_" + page[i][j] + "_other");
			if (obj && !obj.disabled && obj.style.display == "")
			{
				content += "&" + obj.name + "=" + encodeURIComponent(encodeURIComponent(obj.value));
			}
		}
	}
	postObj.open("POST","/answer.m",true);
	postObj.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
	postObj.send(content);
	
	postFlag = 0;
	
	return true;
}
//取当前页号
function getPageid()
{
	if ((typeof survey_pageid) == 'undefined')
	{
		return null;
	}
	else
	{
		if (survey_pageid == 0 && !page[survey_pageid])
		{
			survey_pageid = 1;
		}
		return survey_pageid;
	}
}
//检查当前页的必答题
function checkPageQuestion(pageid)
{
	for(i=0;i<page[pageid].length;i++)
	{
		if (inArray(page[pageid][i],must))
		{
			if (!checkQuestionEmpty(page[pageid][i])) return false;
		}
	}
	
	return true;
}
//分页处理
function dealPage(nextpage)
{
	//检查必答题
	var pageid = getPageid();
	if (pageid == null || pageid == '' || pageid >= nextpage)
	{
		pageid = nextpage - 1;
	}
	if (!checkPageQuestion(pageid)) return;
	if (typeof(judgeTextLengths) != 'undefined' && !judgeTextLengths()) return;
    if (typeof(judgeOnlyNumerics) != 'undefined' && !judgeOnlyNumerics()) return;
    if (typeof(judgeMultiLimitMusts) != 'undefined' && !judgeMultiLimitMusts()) return;
	//提交数据
	if ((typeof preview) == 'undefined')
	{
		postObj = getHttpRequestObj(dealPostResponse);
		if (postObj)
		{
			if (postPageAnswer(pageid))
			{
				//设置下一页按钮无效
				var btnobj = document.getElementById("next" + nextpage);
				if (btnobj) btnobj.disabled = true;
				btnobj = document.getElementById("submit1");
				if (btnobj) btnobj.disabled = true;
			}
		}
	}
	
	goPage(nextpage);
	//设置进度条
	var proc = computeProcess(nextpage);
	setProcessBar(proc);
}
//选取文本框中所有内容
function selectAllText(obj)
{
	obj.select();
}

function selectTextItem(obj1)
{
		var obj = document.getElementById(obj1);
		if(obj)
		{
			if(obj.selected != null) obj.selected = true;
			if(obj.checked != null) obj.checked = true;	
		}
}

//初始化Request对象
var postObj;
var postFlag = 1;
