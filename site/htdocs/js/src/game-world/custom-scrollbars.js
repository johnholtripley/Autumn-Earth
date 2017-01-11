    /*

    http://codepen.io/johnholtripley/pen/eBNYXj
    //
    //

    TO DO #########

    allow multiple scroll bars on the page (use local variables to track position and dragger height for each scroll bar)

    If not needed, don't show

    Resize function if content changes 

    cache element references

    */




   function scrollbarWidth() {
       // Add a temporary scrolling element to the DOM, then check the difference between its outer and inner elements.
       // only need to call once - won't change
       var testDiv = document.createElement('div');
       testDiv.style.cssText = 'width:50px;height:50px;overflow-y:scroll;top:-200px;left:-200px;position:absolute;';
       var width = 0;
       var widthMinusScrollbars = 0;
       document.body.appendChild(testDiv);
       width = testDiv.offsetWidth;
       var widthMinusScrollbars = testDiv.clientWidth;
       document.body.removeChild(testDiv);
       return (width - widthMinusScrollbars);
   }

   function handleScrollDrag(e) {
       translateY = (e.pageY - objInitTop);
       if (translateY < 0) {
           translateY = 0;
       }
       if (translateY + draggerHeight > paneHeight) {
           translateY = paneHeight - draggerHeight;
       }
       document.getElementById('dragger').style.transform = 'translateY(' + translateY + 'px)';
       // move content accordingly:
       document.getElementById('scrollingContent').scrollTop = (translateY / scrollbarRatio);
   }

   function endScrollDrag(e) {
       isBeingDragged = false;
       // tidy up and remove event listeners:
       document.removeEventListener("mousemove", handleScrollDrag, false);
       document.removeEventListener("mouseup", endScrollDrag, false);
   }

   function initDragger() {
       translateY = 0;
       isBeingDragged = false;
       var scrollContentHeight = document.getElementById('scrollingContent').scrollHeight;
       paneHeight = document.getElementById('scrollParent').offsetHeight;
       scrollbarRatio = (paneHeight / scrollContentHeight);
       draggerHeight = Math.floor(scrollbarRatio * paneHeight);
       document.getElementById('dragger').style.height = draggerHeight + "px";
       // allow content to be scrolled by dragging the dragger:
       document.getElementById('dragger').addEventListener('mousedown', function(e) {
           // stop the content getting highlighted during the drag:
           e.preventDefault();
           var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
           var clickedSlotRect = document.getElementById('dragger').getBoundingClientRect();
           objInitTop = clickedSlotRect.top + pageScrollTopY;
           objInitTop = e.pageY - translateY;
           isBeingDragged = true;
           document.addEventListener("mousemove", handleScrollDrag, false);
           document.addEventListener("mouseup", endScrollDrag, false);
       });

       // update dragger position when the content is scrolled natively:
       document.getElementById('scrollingContent').addEventListener('scroll', startContentScroll);
   }

   function startContentScroll() {
       // prevent it from re-calculating everything during a dragged scroll:
       if (!isBeingDragged) {
           scrollOffset = document.getElementById('scrollingContent').scrollTop;
           handleOffset = Math.round(scrollbarRatio * scrollOffset);
           translateY = handleOffset;
           document.getElementById('dragger').style.transform = 'translateY(' + translateY + 'px)';
       }
   }



/*
   document.getElementById('scrollingContent').style.width = document.getElementById('scrollingContent').offsetWidth + scrollbarWidth() + 'px';
   initDragger();
*/