/*
 * 弹出购买页
 */
//$('.buy-box').slideDown("normal");
	//$('body').css("overflow","hidden");
	//$('article').addEventListener('DOMMouseScroll',scrollFunc,false);
	//alert($('body').width());
//$('#close-buy').click(function(){
//	$('.buy-box').slideUp("normal");	
//	$('body').css("overflow","scroll");
//})

$('.zh-con').click(function(){
	$(this).siblings('.txt-js').toggleClass('txt-js-show');	
	$(this).parent().siblings('.zh').children('.txt-js').removeClass('txt-js-show');
	$(this).parent().siblings('.zh').children('.tick').removeClass('tick-show');
	if($(this).siblings('.tick').hasClass('tick-show')){
		$(this).siblings('.tick').removeClass('tick-show');
	}	
})
$('.txt-js').click(function(){
	$(this).removeClass('txt-js-show');
	//css({width:'-120px'});
	$(this).siblings('.tick').addClass('tick-show');
})