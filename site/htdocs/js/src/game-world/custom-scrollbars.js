/*

    http://codepen.io/johnholtripley/pen/eBNYXj
    //
    //

    TO DO #########

    allow multiple scroll bars on the page (use local variables to track position and dragger height for each scroll bar) - http://codepen.io/johnholtripley/pen/JEXjGa?editors=1111

    If not needed, don't show

    Re-init function if content changes 

    cache element references (per each scroll bar)

    remove the need to indent the content

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

function startContentScroll() {
    // prevent it from re-calculating everything during a dragged scroll:
    if (!isBeingDragged) {
        scrollOffset = document.getElementById('scrollingContent').scrollTop;
        handleOffset = Math.round(scrollbarRatio * scrollOffset);
        translateY = handleOffset;
        document.getElementById('dragger').style.transform = 'translateY(' + translateY + 'px)';
    }
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


function customScrollBar(element) {
    this.element = element;
    this.scrollingContent = this.element.firstElementChild;
    this.translateY = 0;
    this.isBeingDragged = false;

    this.init = function() {
        this.paneHeight = this.element.offsetHeight;
        this.scrollContentHeight = this.scrollingContent.scrollHeight;
        this.scrollbarRatio = (this.paneHeight / this.scrollContentHeight);
        this.draggerHeight = Math.floor(this.scrollbarRatio * this.paneHeight);
        this.dragger = this.element.querySelector("#dragger");
        this.dragger.style.height = this.draggerHeight + "px";
        // update dragger position when the content is scrolled natively:
        // use bind to pass this - http://stackoverflow.com/questions/1338599/the-value-of-this-within-the-handler-using-addeventlistener#answer-19507086
        this.scrollingContent.addEventListener('scroll', this.contentScroll.bind(this));
        // allow content to be scrolled by dragging the dragger:
        this.dragger.addEventListener('mousedown', this.startScrollDrag.bind(this));
    };

    this.contentScroll = function() {
        // prevent it from re-calculating everything during a dragged scroll:
        if (!this.isBeingDragged) {
            var scrollOffset = this.scrollingContent.scrollTop;
            var handleOffset = Math.round(this.scrollbarRatio * scrollOffset);
            this.translateY = handleOffset;
            this.dragger.style.transform = 'translateY(' + this.translateY + 'px)';
        }
    }

this.startScrollDrag = function(e) {

  // stop the content getting highlighted during the drag:
        e.preventDefault();
        objInitTop = e.pageY - this.translateY;
        this.isBeingDragged = true;
        
     //   document.addEventListener("mousemove", handleScrollDrag, false);
     //   document.addEventListener("mouseup", endScrollDrag, false);
}


    this.init();

}








// do this globally once:
var thisDevicesScrollBarWidth = scrollbarWidth();
if (thisDevicesScrollBarWidth > 0) {
    
console.log("-----------------------------------");
scrollBar1 = new customScrollBar(document.getElementById('scrollParent'));



    // eg (not touch device)
    //document.getElementById('scrollingContent').style.width = document.getElementById('scrollingContent').offsetWidth + thisDevicesScrollBarWidth + 'px';
    //initDragger();
}
