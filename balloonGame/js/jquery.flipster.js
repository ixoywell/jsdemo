/* global window, document, jQuery */
(function($) {
$.fn.flipster = function(options) {
    var isMethodCall = typeof options === 'string' ? true : false;

    if (isMethodCall) {
        var method = options;
        var args = Array.prototype.slice.call(arguments, 1);
    } else {
        var defaults = {
            itemContainer:    'ul', // Container for the flippin' items.
            itemSelector:     'li', // Selector for children of itemContainer to flip
            style:            'coverflow', // Switch between 'coverflow' or 'carousel' display styles
            start:            'center', // Starting item. Set to 0 to start at the first, 'center' to start in the middle or the index of the item you want to start with.

            enableKeyboard:   true, // Enable left/right arrow navigation
            enableMousewheel: true, // Enable scrollwheel navigation (up = left, down = right)
            enableTouch:      true, // Enable swipe navigation for touch devices

            onItemSwitch:     $.noop, // Callback function when items are switched
            disableRotation:  false,

            enableNav:        false, // If true, flipster will insert an unordered list of the slides
            navPosition:      'after', // [before|after] Changes the position of the navigation before or after the flipsterified items - case-insensitive

            enableNavButtons: true, // If true, flipster will insert Previous / Next buttons
            prevText:         '',//'Previous',       // Changes the text for the Previous button
            nextText:         '',//'Next'            // Changes the text for the Next button
            firstLoad: true
        };
        var settings = $.extend({}, defaults, options);

        var win = $(window);
    }

    return this.each(function(){

        var _flipster = $(this);
        var methods;

        if (isMethodCall) {
            methods = _flipster.data('methods');
            return methods[method].apply(this, args);
        }

        var _flipItemsOuter;
        var _flipItems;
        var _flipItemsBtn;
        var _flipNav;
        var _flipNavItems;
        var _current = 0;

        var _startTouchX = 0;
        var _actionThrottle = 0;
        var _throttleTimeout;
        var compatibility;

        var navCategories = [],
            navItems = [], //项
            navList = [], //列表
            navListBtn = []; //列表

        // public methods
        methods = {
            jump: jump
        };
        _flipster.data('methods', methods);

        function removeThrottle() {
            _actionThrottle = 0;
        }

        function resize() {
            _flipItemsOuter.height(calculateBiggestFlipItemHeight());
            _flipster.css("height","320px");
            //_flipster.css("height","auto");
            //_flipster.css({"width":"80%", "margin":"0 auto"});
           if(settings.firstLoad){
               if ( settings.style === 'carousel' ) { _flipItemsOuter.width(_flipItems.width()*0.8); }
               settings.firstLoad = false;
           }
            _flipItemsOuter.width(_flipItems.width());
        }

        function calculateBiggestFlipItemHeight() {
            var biggestHeight = 0;
            _flipItems.each(function() {
                if ($(this).height() > biggestHeight) biggestHeight = $(this).height();
            });
            return biggestHeight;
        }

        function buildNav() {
            if ( settings.enableNav && _flipItems.length > 1 ) {


                _flipItems.each(function(){
                    var category = $(this).data("flip-category"),
                        itemNum = $(this).data("num"),
                        itemId = $(this).attr("id"),
                        itemContent = $(this).attr("content");

                    if ( typeof category !== 'undefined' ) {
                        if ( $.inArray(category,navCategories) < 0 ) {
                            navCategories.push(category);
                            //礼包介绍
                            navList[category] = '<li class="flip-nav-category '+itemId+'" data-flip-category="'+category+'">'+itemContent+'\n';//<ul class="flip-nav-items">\n';

console.log(itemNum);
                            //礼包查看按钮
                            navListBtn[category] = '<li class="ranking-btn-'+ itemNum+'" data-num= "'+itemNum+'"data-flip-category="'+category+'"></li>\n';//<ul class="flip-nav-items">\n';

                        }
                    }
                    /*
                    if ( $.inArray(itemId,navItems) < 0 ) {
                        navItems.push(itemId);
                        //var link = '<a href="#'+itemId+'" class="flip-nav-item-link">'+itemTitle+'</a></li>\n';
                    /*    if (typeof category !== 'undefined') {
                            navList[category] = navList[category] + '<li class="flip-nav-item">' + itemTitle + '</li>\n';
                        }
                        else {

                            navList[itemId] = '<li name="'+itemId+'"class="flip-nav-item data-flip-category="'+category+'">' + itemTitle + '</li>\n';
                       // }
                    }
                    */
                });
                //礼包介绍
                var navDisplay = '<ul class="flipster-nav">\n';

                for (var navIndex in navList) {
                    navDisplay += navList[navIndex];//+ "</ul>\n</li>\n";
                }

                navDisplay += '</ul>';

                if(settings.navPosition.toLowerCase() != "after") {
                    _flipNav = $(navDisplay).prependTo(_flipster);
                } else {
                    _flipNav = $(navDisplay).appendTo(_flipster);
                }

                //礼包查看按钮
                var navDisplayBtn = '';
                for (var navIndexBtn in navListBtn) {
                    navDisplayBtn += navListBtn[navIndexBtn];//+ "</ul>\n</li>\n";
                }
                $('.gift-details-btn').html(navDisplayBtn);
/*
                _flipNavItems = _flipNav.find("a").on("click",function(e){
                    var target;
                    if ( $(this).hasClass("flip-nav-category-link") ) {
                        target = _flipItems.filter("[data-flip-category='"+$(this).data("flip-category")+"']");
                    } else {
                        target = $(this.hash);
                    }

                    if ( target.length ) {
                        jump(target);
                        e.preventDefault();
                    }
                });
              */
            }
        }

        function updateNav() {
            if ( settings.enableNav && _flipItems.length > 1 ) {
                var currentItem = $(_flipItems[_current]);
                console.log(currentItem.attr('id'));
                console.log(currentItem.data('num'));
                console.log(currentItem.data('flip-category'));
                _flipNav.find(".flip-nav-current").removeClass("flip-nav-current");
            //    _flipNavItems.filter("[href='#"+currentItem.attr("id")+"']").addClass("flip-nav-current");
           //     _flipNav.filter("[class='"+currentItem.data("flip-category")+"']").addClass("flip-nav-current");
                _flipNav.find('.'+currentItem.attr('id')).addClass("flip-nav-current");
                $('.gift-details-btn').children('li.show').removeClass("show");
                $('.gift-details-btn').children('li').filter("[data-num='"+currentItem.data("num")+"']").addClass("show");
                //_flipNav.filter("[data-flip-category='"+currentItem.data("flip-category")+"']").addClass("flip-nav-current");
            }

        }

        function buildNavButtons() {
            if ( settings.enableNavButtons && _flipItems.length > 1 ) {
                _flipster.find(".prev-btn, .next-btn").remove();
                _flipster.append("<a href='#' class='gift-btn prev-btn'>"+settings.prevText+"</a> <a href='#' class='gift-btn next-btn'>"+settings.nextText+"</a>");

                _flipster.children('.prev-btn').on("click", function(e) {
                    jump("left");
                    e.preventDefault();
                });

                _flipster.children('.next-btn').on("click", function(e) {
                    jump("right");
                    e.preventDefault();
                });
            }
        }

        function center() {
            var currentItem = $(_flipItems[_current]).addClass("flip-current");

            _flipItems.removeClass("flip-prev flip-next flip-current flip-past flip-future no-transition");

            if ( settings.style === 'carousel' ) {

                _flipItems.addClass("flip-hidden");

                var nextItem = $(_flipItems[_current+1]),
                    futureItem = $(_flipItems[_current+2]),
                    prevItem = $(_flipItems[_current-1]),
                    pastItem = $(_flipItems[_current-2]);

                if ( _current === 0 ) {
                    prevItem = _flipItems.last();
                    pastItem = prevItem.prev();
                }
                else if ( _current === 1 ) {
                    pastItem = _flipItems.last();
                }
                else if ( _current === _flipItems.length-2 ) {
                    futureItem = _flipItems.first();
                }
                else if ( _current === _flipItems.length-1 ) {
                    nextItem = _flipItems.first();
                    futureItem = $(_flipItems[1]);
                }

                futureItem.removeClass("flip-hidden").addClass("flip-future");
                pastItem.removeClass("flip-hidden").addClass("flip-past");
                nextItem.removeClass("flip-hidden").addClass("flip-next");
                prevItem.removeClass("flip-hidden").addClass("flip-prev");

            }
            else {
                var spacer = currentItem.outerWidth()/2;
                var totalLeft = 0;
                var totalWidth = _flipItemsOuter.width();
                var currentWidth = currentItem.outerWidth();
                var currentLeft = (_flipItems.index(currentItem)*currentWidth)/2 +spacer/2;

                _flipItems.removeClass("flip-hidden");

                for (var i = 0; i < _flipItems.length; i++) {
                    var thisItem = $(_flipItems[i]);
                    var thisWidth = thisItem.outerWidth();

                    if (i < _current) {
                        thisItem.addClass("flip-past")
                            .css({
                                "z-index" : i,
                                "left" : (i*thisWidth/2)+"px"
                            });
                    }
                    else if ( i > _current ) {
                        thisItem.addClass("flip-future")
                            .css({
                                "z-index" : _flipItems.length-i,
                                "left" : (i*thisWidth/2)+spacer+"px"
                            });
                    }
                }

                currentItem.css({
                    "z-index" : _flipItems.length+1,
                    "left" : currentLeft +"px"
                });

                totalLeft = (currentLeft + (currentWidth/2)) - (totalWidth/2);
                var newLeftPos = -1*(totalLeft)+"px";
                /* Untested Compatibility */
                if (compatibility) {
                    var leftItems = $(".flip-past");
                    var rightItems = $(".flip-future");
                    $(".flip-current").css("zoom", "1.0");
                    for (i = 0; i < leftItems.length; i++) {
                        $(leftItems[i]).css("zoom", (100-((leftItems.length-i)*5)+"%"));
                    }
                    for (i = 0; i < rightItems.length; i++) {
                        $(rightItems[i]).css("zoom", (100-((i+1)*5)+"%"));
                    }

                    _flipItemsOuter.animate({"left":newLeftPos}, 333);
                }
                else {
                    _flipItemsOuter.css("left", newLeftPos);
                }
            }

            currentItem
                .addClass("flip-current")
                .removeClass("flip-prev flip-next flip-past flip-future flip-hidden");

            resize();
            updateNav();
            settings.onItemSwitch.call(this);
        }

        function jump(to) {
            if ( _flipItems.length > 1 ) {
                if ( to === "left" ) {
                    if ( _current > 0 ) { _current--; }
                    else { _current = _flipItems.length-1; }
                }
                else if ( to === "right" ) {
                    if ( _current < _flipItems.length-1 ) { _current++; }
                    else { _current = 0; }
                } else if ( typeof to === 'number' ) {
                    _current = to;
                } else {
                    // if object is sent, get its index
                    _current = _flipItems.index(to);
                }
                center();
            }
        }

        function init() {
            // Basic setup
            _flipster.addClass("flipster flipster-active flipster-"+settings.style).css("visibility","hidden");
            if (settings.disableRotation)
              _flipster.addClass('no-rotate');
            _flipItemsOuter = _flipster.find(settings.itemContainer).addClass("flip-items");
            _flipItems = _flipItemsOuter.find(settings.itemSelector).addClass("flip-item flip-hidden").wrapInner("<div class='flip-content' />");

            //Browsers that don't support CSS3 transforms get compatibility:
            var isIEmax8 = ('\v' === 'v'); //IE <= 8
            var checkIE = document.createElement("b");
            checkIE.innerHTML = "<!--[if IE 9]><i></i><![endif]-->"; //IE 9
            var isIE9 = checkIE.getElementsByTagName("i").length === 1;
            if (isIEmax8 || isIE9) {
                compatibility = true;
                _flipItemsOuter.addClass("compatibility");
            }

            // Insert navigation if enabled.
            buildNav();
            buildNavButtons();

            // Set the starting item
            if (settings.start && _flipItems.length > 1) {
                // Find the middle item if start = center
                if ( settings.start === 'center' ) {
                    if (!_flipItems.length % 2) {
                        _current = _flipItems.length/2 + 1;
                    } else {
                        _current = Math.floor(_flipItems.length/2);
                    }
                } else {
                    _current = settings.start;
                }
            }


            // initialize containers
            resize();

            // Necessary to start flipster invisible and then fadeIn so height/width can be set accurately after page load
            _flipster.hide().css("visibility","visible").fadeIn(400,function(){ center(); });

            // Attach event bindings.
            win.on("resize.flipster", function() {
                resize();
                center();
            });

            // Navigate directly to an item by clicking
            _flipItems.on("click", function(e) {
                if ( !$(this).hasClass("flip-current") ) { e.preventDefault(); }
                jump(_flipItems.index(this));
            });

            // Keyboard Navigation
            if (settings.enableKeyboard && _flipItems.length > 1) {
                win.on("keydown.flipster", function(e) {
                    _actionThrottle++;
                    if (_actionThrottle % 7 !== 0 && _actionThrottle !== 1) return; //if holding the key down, ignore most events

                    var code = e.which;
                    if (code === 37 ) {
                        e.preventDefault();
                        jump('left');
                    } else if (code === 39 ) {
                        e.preventDefault();
                        jump('right');
                    }
                });

                win.on("keyup.flipster", function(e){
                    _actionThrottle = 0; //reset action throttle on key lift to avoid throttling new interactions
                });
            }

            // Mousewheel Navigation
            if (settings.enableMousewheel && _flipItems.length > 1) { // TODO: Fix scrollwheel on Firefox
                _flipster.on("mousewheel.flipster", function(e){
                    _throttleTimeout = window.setTimeout(removeThrottle, 500); //throttling should expire if scrolling pauses for a moment.
                    _actionThrottle++;
                    if (_actionThrottle % 4 !==0 && _actionThrottle !== 1) return; //throttling like with held-down keys
                    window.clearTimeout(_throttleTimeout);

                    if ( e.originalEvent.wheelDelta /120 > 0 ) { jump("left"); }
                    else { jump("right"); }

                    e.preventDefault();
                });
            }

            // Touch Navigation
            if ( settings.enableTouch && _flipItems.length > 1 ) {
                _flipster.on("touchstart.flipster", function(e) {
                    _startTouchX = e.originalEvent.targetTouches[0].screenX;
                });

                _flipster.on("touchmove.flipster", function(e) {
                    e.preventDefault();
                    var nowX = e.originalEvent.targetTouches[0].screenX;
                    var touchDiff = nowX-_startTouchX;
                    if (touchDiff > _flipItems[0].clientWidth/1.75){
                        jump("left");
                        _startTouchX = nowX;
                    }else if (touchDiff < -1*(_flipItems[0].clientWidth/1.75)){
                        jump("right");
                        _startTouchX = nowX;
                    }
                });

                _flipster.on("touchend.flipster", function(e) {
                    _startTouchX = 0;
                });
            }
        }

        // Initialize if flipster is not already active.
        if ( !_flipster.hasClass("flipster-active") ) { init(); }
    });
};
})(jQuery);
