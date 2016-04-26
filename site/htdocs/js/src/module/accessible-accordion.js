function AccordionWidget(el, selectedIndex) {
    // http://codepen.io/stowball/pen/eZKwRv
    // kudos Matt Stow
    if (!el) {
        return;
    }
    this.el = el;
    this.accordionTriggers = this.el.getElementsByClassName('js-accordion-trigger');
    this.accordionPanels = this.el.getElementsByClassName('js-accordion-panel');
    if (this.accordionTriggers.length === 0 || this.accordionTriggers.length !== this.accordionPanels.length) {
        return;
    }
    this.init(selectedIndex);
}

AccordionWidget.prototype.init = function(selectedIndex) {
    this.accordionTriggersLength = this.accordionTriggers.length;
    this.expandedAccordions = new Array(this.accordionTriggersLength);
    this.multiSelectable = this.el.hasAttribute('aria-multiselectable');
    this.keys = {
        prev: 38,
        next: 40,
        space: 32
    };
    var initialSelectedIndex;
    for (var i = 0; i < this.accordionTriggersLength; i++) {
        this.accordionTriggers[i].index = i;
        this.accordionTriggers[i].addEventListener('click', this.accordionClick.bind(this), false);
        this.accordionTriggers[i].addEventListener('keydown', this.accordionCursor.bind(this), false);
        this.accordionTriggers[i].addEventListener('focus', this.accordionFocus.bind(this), false);
        if (this.accordionTriggers[i].classList.contains('is-selected')) {
            this.expandedAccordions[i] = true;
        }
    }
    if (!isNaN(selectedIndex)) {
        initialSelectedIndex = selectedIndex < this.accordionTriggersLength ? selectedIndex : this.accordionTriggersLength - 1;
        this.expandedAccordions = new Array(this.accordionTriggersLength);
        this.expandedAccordions[initialSelectedIndex] = true;
    } else {
        initialSelectedIndex = this.expandedAccordions.lastIndexOf(true);
        if (!this.multiSelectable) {
            this.expandedAccordions = new Array(this.accordionTriggersLength);
            this.expandedAccordions[initialSelectedIndex] = true;
        }
    }
    this.setSelected(initialSelectedIndex);
    this.setExpanded();
    this.el.classList.add('is-initialized');
};

AccordionWidget.prototype.accordionClick = function(e) {
    e.preventDefault();
    this.setSelected(e.target.index, true);
    this.setExpanded(e.target.index, true);
};

AccordionWidget.prototype.accordionCursor = function(e) {
    var targetIndex;
    if (e.keyCode === this.keys.space || e.keyCode === this.keys.prev || e.keyCode === this.keys.next) {
        e.preventDefault();
        if (e.keyCode === this.keys.space) {
            this.setExpanded(e.target.index, true);
            return;
        }
    } else {
        return;
    }

    if (e.keyCode === this.keys.prev && e.target.index > 0) {
        targetIndex = e.target.index - 1;
    } else if (e.keyCode === this.keys.next && e.target.index < this.accordionTriggersLength - 1) {
        targetIndex = e.target.index + 1;
    } else {
        return;
    }
    this.setSelected(targetIndex, true);
};

AccordionWidget.prototype.accordionFocus = function() {
    if (this.accordionTriggersLength === 1) {
        this.setSelected(0);
    }
    return;
};

AccordionWidget.prototype.setSelected = function(index, userInvoked) {
    if (index === -1) {
        this.accordionTriggers[0].setAttribute('tabindex', 0);
        return;
    }

    for (var i = 0; i < this.accordionTriggersLength; i++) {
        if (i === index) {
            this.accordionTriggers[i].classList.add('is-selected');
            this.accordionTriggers[i].setAttribute('aria-selected', true);
            this.accordionTriggers[i].setAttribute('tabindex', 0);
            if (userInvoked) {
                this.accordionTriggers[i].focus();
            }
        } else {
            this.accordionTriggers[i].classList.remove('is-selected');
            this.accordionTriggers[i].setAttribute('aria-selected', false);
            this.accordionTriggers[i].setAttribute('tabindex', -1);
        }
    }
};

AccordionWidget.prototype.setExpanded = function(index, userInvoked) {
    var i;
    if (userInvoked) {
        if (this.multiSelectable) {
            this.expandedAccordions[index] = !this.expandedAccordions[index];
        } else {
            for (i = 0; i < this.accordionTriggersLength; i++) {
                if (i === index) {
                    this.expandedAccordions[i] = !this.expandedAccordions[i];
                } else {
                    this.expandedAccordions[i] = false;
                }
            }
        }
    }
    for (i = 0; i < this.accordionTriggersLength; i++) {
        if (this.expandedAccordions[i]) {
            this.accordionTriggers[i].setAttribute('aria-expanded', true);
            this.accordionTriggers[i].classList.add('is-expanded');
            this.accordionPanels[i].setAttribute('aria-hidden', false);
            this.accordionPanels[i].classList.remove('is-hidden');
            this.accordionPanels[i].setAttribute('tabindex', 0);
        } else {
            this.accordionTriggers[i].setAttribute('aria-expanded', false);
            this.accordionTriggers[i].classList.remove('is-expanded');
          //  this.accordionPanels[i].setAttribute('aria-hidden', true);
            this.accordionPanels[i].classList.add('is-hidden');
            this.accordionPanels[i].setAttribute('tabindex', -1);
        }
    }
};

// transition callback
var animatedElements = document.getElementsByClassName('js-accordion-panel');
var transitionEvent = whichTransitionEvent();
if (transitionEvent) {
    for (var i = 0; i < animatedElements.length; i++) {
        animatedElements[i].addEventListener(transitionEvent, function() {
            // will fire on open complete and close complete:
            if (hasClass(this, 'is-hidden')) {
                this.setAttribute('aria-hidden', true);
            } else {
                this.setAttribute('aria-hidden', false);
            }
        });
    }
}


// set up:
if (cutsTheMustard) {
    var accordionElements = document.getElementsByClassName('accordion-interface');
    accordionCount = accordionElements.length;
    for (i = 0; i < accordionCount; i++) {
        new AccordionWidget(accordionElements[i], 0);
    }
}
