/*
 * plusTabs version 1.0.1
 *
 * Author: Jason Day @iamjasonday - 
 * Forked by Ross Carver to update allowing for todo to display as many tabs as possible before displaying showmore
 *
 * (c) 2012, Jason Day
 *
 * Dual licensed under the MIT and GPL licenses
 * 
 * Dependencies: jQuery v1.6+, jQuery UI 1.8+
 * 
 * Description:
 * plusTabs extends jQuery UI tabs to include a dropdown for when tabs break to the next line
 *
 * Usage:
 * 
 * 	Simple:
 * 		$("#selector").plusTabs();
 *
 * 	Options:
 *  		$("#selector".plusTabs({
 *  			className: "plusTabs", //classname for css scoping
 *  			seeMore: true,  //initiate "see more" behavior
 *  			seeMoreText: "More", //set see more text
 *  			showCount: false, //show drop down count
 *  			expandIcon: "&#9660; ", //icon/caret - if using image, specify image width
 *  			dropWidth: "66%", //width of dropdown
 *			sizeTweak: 0 //adjust size of active tab to tweak "see more" layout
 *  		});
 * 
 */

(function ($)
{
  var methods = {
    init: function (options)
    {
      if (options === undefined) options = {};
      //Merge defaults and options
      options = $.extend(
      {}, $.fn.plusTabs.defaults, options);
      return this.each(function ()
      {
	       var o = options,
	       $plusTabs = $(this);
	
    	  // add class plusTabs for tabs styling
    	  (o.className != '') && $plusTabs.addClass(o.className);
    	  //initiate jQuery UI Tabs
    	  $plusTabs.tabs();
    
    	  function showActiveTab()
    	  {                                      
         //hide all tabs, show selected tab
          var fitTabCount=1;
    	    $uiTabsNav.find("li").hide();                      // hide all tabs
          var sumWidth=$(".seeMore").outerWidth()+$uiTabsNav.find("li.ui-state-active").outerWidth(); // start with the width of selected, plus see more
    	    $uiTabsNav.find("li.ui-state-active").removeClass('notfit').addClass('fits').show();      // then just show the selected tab
          // now iterate over all the other tabs, and show each while there is enough room left to do so
          $uiTabsNav.find("li:not(.ui-state-active)").each(function(){   
            if(($(this).outerWidth()+sumWidth+o.sizeTweak) < ATBwidth){
              $(this).show();
              fitTabCount++;                  // increment the count of number of tabs that will fit
              $(this).addClass('fits');       // we'll use this to find only those without fits class below
              sumWidth+= $(this).outerWidth();
            } else {
              $(this).addClass('notfit');       // we'll use this to find only those without fits class below
            }
          });
          
    	    var allTabsLength = "";
    	    if (o.showCount === true){
    	      allTabsLength = " (" + parseInt($plusTabs.tabs("length")-(fitTabCount-1)) + ")";    // this will show only the number of hidden tabs
    	    }
    	    
          //add "see more" tab
    	    if ($plusTabs.find("li.seeMore").length == 0){
    	      $uiTabsNav.append("<li class='ui-state-default ui-corner-top seeMore'><a href='javascript: void(0);'>" + o.expandIcon + o.seeMoreText + allTabsLength + "</a></li>");
    	    } else {
    	      $plusTabs.find("li.seeMore").show();
    	    }
    	    // set active tab width
    	    var seeMoreWidth = $(".seeMore").outerWidth();
          var moreActiveTab = ATBwidth - seeMoreWidth - o.sizeTweak;          // width of all minus room for see more tab minus tweaking option
    	    
    	    // position .allTabs
    	    var uiTabsHeight = $uiTabsNav.outerHeight();
    	    var $allTabs = $plusTabs.find(".allTabs");
    	    $allTabs.css({"top": uiTabsHeight,"width": o.dropWidth});
          
    	    // Highlight active tab in allTabs dropdown
    	    $allTabs.find("a").removeClass("highlight");
          
    	    var selectedText = $uiTabsNav.find("li.ui-state-active a").text();
    	    var allTabsSelected = $allTabs.find('a:contains("' + selectedText + '")');
    	    $plusTabs.find(allTabsSelected).addClass("highlight");
          
    	  } // end function for showActiveTab
        
        
        var ATBwidth = $plusTabs.outerWidth();
    	  var tabsWidth = 0;
    	  var fitTabCount=1;
    	  var $uiTabsNav = $plusTabs.find('.ui-tabs-nav');
    	  // get total width of all tabs of current product
    	  $uiTabsNav.find("li").hide();                      // hide all tabs
        
        if ($plusTabs.find("li.seeMore").length == 0){
  	      $uiTabsNav.append("<li class='ui-state-default ui-corner-top seeMore fits'><a href='javascript: void(0);'>" + o.expandIcon + o.seeMoreText + allTabsLength + "</a></li>");
  	    } else {
  	      $plusTabs.find("li.seeMore").show();
  	    }
        
        var sumWidth=$(".seeMore").outerWidth()+$uiTabsNav.find("li.ui-state-active").outerWidth(); // start with the width of selected, plus see more
  	    var allTabsLength = "";
  	    
        $uiTabsNav.find("li.ui-state-active").removeClass('notfit').addClass('fits').show();      // then just show the selected tab
        // now iterate over all tabs, and show each while there is enough room left to do so
        //$uiTabsNav.find("li").each(function (index, tabs)
        $uiTabsNav.find("li:not(.ui-state-active)").each(function(index,tabs)  
        {
    	    if(($(this).outerWidth()+sumWidth+o.sizeTweak) < ATBwidth){
            $(this).show();
            fitTabCount++;                  // increment the count of number of tabs that will fit
            $(this).addClass('fits');       // we'll use this to find only those without fits class below
            sumWidth+= $(this).outerWidth();
          } else{
            $(this).addClass('notfit');       // we'll use this to find only those without fits class below
            $(this).hide();
          }
          tabsWidth += $(tabs).outerWidth();
    	  });
        if (o.showCount === true){
  	      allTabsLength = " (" + parseInt($plusTabs.tabs("length")-(fitTabCount)) + ")";    // this will show only the number of hidden tabs
  	    }
        // we redo this here because we can't tell how many are hidden before the .each, but we needed to add the .seeMore before that to calculate width properly!
        $uiTabsNav.find('.seeMore').removeClass('notfit').html("<a href='javascript: void(0);'>" + o.expandIcon + o.seeMoreText + allTabsLength + "</a>");
        
    	  // Check if product, initialize "see more" behavior
    	  if (o.seeMore === true && tabsWidth >= ATBwidth)
    	  {
    	    var allTabsNav = $('<div class="allTabs" />').appendTo($plusTabs);
          //clone tabs/behavior append to allTabs
    	    $uiTabsNav.find('li.notfit').show().clone().click(function (event) // using parent here inherits tab styling
    	    {
            event.preventDefault();                          //stop hash to behavior
    	      $plusTabs.tabs('select', parseInt($(this).index()+fitTabCount));       // mimic tab select
    	      showActiveTab();                                 // show active tab on selection
    	      $plusTabs.find('.allTabs').slideUp('fast');      //hide "see more tabs"
    	    }).appendTo(allTabsNav);
    	    
          showActiveTab();
    	  } /*end if o.seeMore === "true" */
    	  
        // "see more" functionality
    	  // show all tabs drop down with a timer
    	  var timeout; 
        var $allTabs = $plusTabs.find(".allTabs");
        
    	  $plusTabs.find(".seeMore a").click(function() {   // provide event action for drop-down menu on the seemore tab
    			clearTimeout(timeout);
    			$allTabs.slideDown();
    			timeout = setTimeout(function() {
    			    $allTabs.slideUp();
    			    clearTimeout(timeout);
    			}, 3000)
    			});
    	    
          $plusTabs.find(".seeMore a").keydown(function(e) {
            if (e.which === 13) {
              $allTabs.find("a:first").focus();
            }
    		  });
    	    
    		  $allTabs.mouseenter(function(){
    			 clearTimeout(timeout);
    			});
    		    
    		  $allTabs.mouseleave(function() {
            clearTimeout(timeout);
            var $this = $(this)
            timeout = setTimeout(function() {
              $this.slideUp()
            }, 1000)
    			});
    	
      });
    }
  };
  $.fn.plusTabs = function (method)
  {
    if (methods[method])
    {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || !method)
    {
      return methods.init.apply(this, arguments);
    }
    else
    {
      $.error('Method ' + method + ' does not exist on $.plusTabs');
    }
  };
  // Default settings
  $.fn.plusTabs.defaults = {
    className: "plusTabs",
    seeMore: true,
    seeMoreText: "More",
    showCount: false,
    expandIcon: "&#9660; ",
    dropWidth: "66%",
    sizeTweak: 0
  };
})(jQuery);