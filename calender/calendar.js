/// <reference path="jquery-1.9.1.min.js" />

var vYear = new Date().getFullYear();
var vMonth = new Date().getMonth() + 1;
var arrCurrentMonth;

$(function () {
	//读取数据显示
	calendarRefresh(vYear, vMonth);
	
	//日历的上一页下一页
    $("#calendar .fc-header-left").click(function () {
        if (vMonth == 1) {
            vMonth = 12;
            vYear = vYear - 1;
        }
        else
            vMonth = vMonth - 1;
        calendarRefresh(vYear, vMonth);
    });
    $("#calendar .fc-header-right").click(function () {
        if (vMonth == 12) {
            vMonth = 1;
            vYear = vYear + 1;
        }
        else
            vMonth = vMonth + 1;
        calendarRefresh(vYear, vMonth);
    });
	
	
})

//绘制日历
function calendarRefresh(y, m) {
    $(".calendarTop span").html("" + y +"年" + m + "月 ");
    var selectYear = y;   //年份
    var selectMonth = m;  //月份
    var iweek = getWeek(selectYear, selectMonth, 1);        //当前所选月的1号是星期几
    var ilastMonth = getDays(selectMonth == 1 ? selectYear - 1 : selectYear, selectMonth == 1 ? 12 : selectMonth - 1);  //上一个月的天数
    var icurrentMonth = getDays(selectYear, selectMonth);   //所选择月的天数
    var inextMonth = getDays(selectMonth == 12 ? selectYear + 1 : selectYear, selectMonth == 12 ? 1 : selectMonth + 1);  //下一个月的天数
    var iiweek = getWeek(selectYear, selectMonth, icurrentMonth);        //当前所选月的最后一天是星期几
    var ilast = 0;  //当前显示的上个月的天数
    var inext = 0;  //当前显示的下个月的天数
    var itoday = 0; //当前日期所在日历数组的下标
    arrCurrentMonth = new Array();
    for (var i = ilastMonth - iweek; i < ilastMonth; i++) { //上一月弥补的日期
        arrCurrentMonth.push(i + 1);
        ilast++;
    }
    for (var i = 0; i < icurrentMonth; i++) {               //当前月份的日期
        arrCurrentMonth.push(i + 1);
        if (arrCurrentMonth[i] == new Date().getDate() && y == new Date().getFullYear() && m == (new Date().getMonth() + 1))
            itoday = i;
    }
    for (var i = 0; i < (iiweek == 6 ? 7 : 13 - iiweek); i++) {
        arrCurrentMonth.push(i + 1);
        inext++;
    }
    var cdate = arrCurrentMonth.length;
    var strHtml = "";
	var j=0;
    for (var a = 0; a < cdate / 7-1; a++) {
        if (a == 0)
            strHtml += "<tr class='fc-week0 fc-first'>";
        else if (a + 1 == cdate)
            strHtml += "<tr class='fc-week" + a + " fc-last'>";
        else
            strHtml += "<tr class='fc-week" + a + "'>";
        for (var b = 0; b < 7; b++) {
            if (b == 0) {
                if (a * 7 + b < ilast || cdate - (a * 7 + b) - 1 < inext)
                    strHtml += "<td class='fc-widget-content fc-day0 fc-first fc-other-month'>";
                else
                    strHtml += "<td class='fc-widget-content fc-day0 fc-first'>";
            }
            else if (b + 1 == 7) {
                if (a * 7 + b < ilast || cdate - (a * 7 + b) - 1 < inext)
                    strHtml += "<td class='fc-widget-content fc-day6 fc-last fc-other-month'>";
                else
                    strHtml += "<td class='fc-widget-content fc-day6 fc-last'>";
            }
            else {
                if (a * 7 + b < ilast || cdate - (a * 7 + b) - 1 < inext)
                    strHtml += "<td class='fc-widget-content fc-day" + b + " fc-other-month' >";
                else
                    strHtml += "<td class='fc-widget-content fc-day" + b + "'>";
            }
			
				
			var dataMonth=vMonth < 10? "0"+vMonth : vMonth;
			
			
			
			 if(ilast>j ){
				 mon =vMonth-1;
				}
				else if(icurrentMonth+ilast<=j ){
				 mon=vMonth+1;
				 }
				  else{
				 mon =vMonth;
				}
			if(mon==0){
				mon=12;
				years=y-1;
			}else if (mon==13){
			    mon=1;
				years=y+1;
			}else{
				years=y;
				}
				
			  j=j+1;
			 var dataMonth=mon < 10? "0"+mon : mon;
			
			
			var dataToday=arrCurrentMonth[a * 7 + b] < 10? "0"+arrCurrentMonth[a * 7 + b] : arrCurrentMonth[a * 7 + b];
		    var dataCalendar=""+years+""+dataMonth+"" + ""+dataToday +"";
            strHtml += "<div style='fc-day-h'>";
            strHtml += "<div class='fc-day-number' data-calendar='"+dataCalendar+"'> " + arrCurrentMonth[a * 7 + b] + " </div>";//
//            strHtml += "<div class='fc-day-content'>";
//            strHtml += "<div style='position: relative;'></div>";
//            strHtml += "</div>";
            strHtml += "</div>";
            strHtml += "</td>";
        }
        strHtml += "</tr>";
    }
    $("#canlendar-date").html(strHtml);
    if (itoday != 0) {
        $("#calendar #canlendar-date .fc-day-number").eq(itoday).html("<span class='todayCss'>今天</span>");
    }
	$("#calendar #canlendar-date .fc-day-number").each(function(i) {
		 for (var ipp=0;ipp<sFtv.length;ipp++){ //显示回款日期
        if (parseInt(sFtv[ipp].substr(0,8))==$(this).data("calendar")){
              $($(".fc-day-number")[i]).append("<span class='hk'>"+sFtv[ipp].substr(9)+"</span>");
            }
		 }	
		 
	});
	getdate();
}

//获取日历时间
function getdate(){
	$('.fc-border-separate td').click(function(){
		var cdate = $(this).find('.fc-day-number').data('calendar');
		alert(cdate);
		
	})
}

//计算y年m月d号是星期几(int)
function getWeek(y, m, d) {
    var firstDay = y + "-" + m + "-" + d;
    arys1 = firstDay.split('-');
    var date = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
    return date.getDay();
}

//计算y年m月有多少天
function getDays(y, m) {
    if (m == 2) {
        return y % 4 == 0 ? 29 : 28;
    } else if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
        return 31;
    } else {
        return 30;
    }
}

//月份数字转换大写
function CNUpper(num) {
    var upper;
    switch (num) {
        case 1:
            upper = "一";
            break;
        case 2:
            upper = "二";
            break;
        case 3:
            upper = "三";
            break;
        case 4:
            upper = "四";
            break;
        case 5:
            upper = "五";
            break;
        case 6:
            upper = "六";
            break;
        case 7:
            upper = "七";
            break;
        case 8:
            upper = "八";
            break;
        case 9:
            upper = "九";
            break;
        case 10:
            upper = "十";
            break;
        case 11:
            upper = "十一";
            break;
        case 12:
            upper = "十二";
            break;
    }
    return upper;
}

$(function () {
    $("#calendar .fc-header-left .fc-button-content").hover(function () {
        $(this).css("background", "#EFEFEF");
    }, function () {
        $(this).css("background", "none");
    });
    $("#calendar .fc-header-right .fc-button-content").hover(function () {
        $(this).css("background", "#EFEFEF");
    }, function () {
        $(this).css("background", "none");
    });
})