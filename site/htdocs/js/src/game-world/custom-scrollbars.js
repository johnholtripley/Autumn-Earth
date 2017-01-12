/*

    http://codepen.io/johnholtripley/pen/eBNYXj
    //
    //

    TO DO #########

    If not needed, don't show

    Re-init function if content changes 

    remove the need to indent the content

    use classes instead of ids

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





function customScrollBar(element) {
    this.element = element;
    this.scrollingContent = this.element.firstElementChild;
    this.translateY = 0;
    this.isBeingDragged = false;

    this.init = function() {
        this.scrollingContent.style.width = this.scrollingContent.offsetWidth + thisDevicesScrollBarWidth + 'px';
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
        this.objInitTop = e.pageY - this.translateY;
        this.isBeingDragged = true;

        // http://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind#answer-22870717
        this.mouseMoveEvent = this.handleScrollDrag.bind(this);
        document.addEventListener('mousemove', this.mouseMoveEvent);
        this.mouseUpEvent = this.endScrollDrag.bind(this);
        document.addEventListener('mouseup', this.mouseUpEvent);

    }

    this.handleScrollDrag = function(e) {
        this.translateY = (e.pageY - this.objInitTop);
        if (this.translateY < 0) {
            this.translateY = 0;
        }
        if (this.translateY + this.draggerHeight > this.paneHeight) {
            this.translateY = this.paneHeight - this.draggerHeight;
        }
        this.dragger.style.transform = 'translateY(' + this.translateY + 'px)';
        // move content accordingly:
        this.scrollingContent.scrollTop = (this.translateY / this.scrollbarRatio);
    }

    this.endScrollDrag = function(e) {
        this.isBeingDragged = false;
        // tidy up and remove event listeners:
        document.removeEventListener('mousemove', this.mouseMoveEvent);
        document.removeEventListener('mouseup', this.mouseUpEvent);
    }

    this.init();

}








// do this globally once:
thisDevicesScrollBarWidth = scrollbarWidth();
if (thisDevicesScrollBarWidth > 0) {

    
    scrollBar1 = new customScrollBar(document.getElementById('scrollParent'));



    // eg (not touch device)
    //
    //initDragger();
}
