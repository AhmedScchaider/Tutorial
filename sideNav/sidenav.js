/* global customElements */
/* eslint-env es6 */
'use strict';

class SideNav extends HTMLElement{
    static get observedAttributes(){
		return['navigation-width','width','always-show-icon'];
	}
    get opened(){
        return this._opened;
    }
    set opened(v){
        if(typeof v === "boolean"){
            this._opened = v;
            this.setAttribute('opened','');
        }else{
            console.warn('value is not a valid boolean!');
        }
    }
	get navigationWidth(){
        return this._navigationWidth;
    }
    set navigationWidth(v){
        if(!isNaN(v)){
            this._navigationWidth = parseInt(v);
            if(!this.navigation) return;
            this.navigation.style.width = `${v}px`;
        }else{
            console.warn('navigation-width','value is not a valid number!');
        }
    }
    get width(){
        return this._width;
    }
    set width(v){
        if(!isNaN(v)){
            this._width = parseInt(v);
        }else{
            console.warn('width','value is not a valid number!');
        }
    }
    get range(){
        return (this._range !== undefined) ? this._range : 100;
    }
    set range(v){
        if(!isNaN(v)){
            this._range = v;
        }else{
            console.warn('width','value is not a valid number!');
        }
    }
    constructor(){
        super();
        this.navigation = this.querySelector('[navigation]');
        this.sidenavHeader = this.querySelector('[nav-header]');
        this.sidenavContent = this.querySelector('[nav-content]');
        this.mainContent = this.querySelector('[content]');
        this.toggleBtn = this.querySelector('[nav-toggle]');
        this.minWidth = this.calculateMinWidth();

        this.range = 100;
        this.target = null;
        this.targetBCR = null;
        this.navigationBCR = this.navigation.getBoundingClientRect();

        this.startX = 0;
        this.currentX = 0;
        this.screenX = 0;
        this.targetX = 0;
        this.collapsedX = this.navigationWidth;
        this.expandedX = this.minWidth;

        this.draggingNavigation = false;
        
        this.closeNavigation = this.closeNavigation.bind(this);
        this.onNavigationTouchMove = this.onNavigationTouchMove.bind(this);
        this.onNavigationTouchStart = this.onNavigationTouchStart.bind(this);
        this.onNavigationTouchEnd = this.onNavigationTouchEnd.bind(this);
        this.update = this.update.bind(this);

        this.registerListener();
        this.addEventListeners();
        requestAnimationFrame(this.update);
    }
    addEventListeners(){
        this.toggleBtn.addEventListener('click',this.toggleNavigation.bind(this));

        this.navigation.addEventListener('touchstart',this.onNavigationTouchStart,false);
        this.navigation.addEventListener('touchmove',this.onNavigationTouchMove,false);
        this.navigation.addEventListener('touchend',this.onNavigationTouchEnd,false);
        this.mainContent.addEventListener('touchstart',this.onNavigationTouchStart,false);
        this.mainContent.addEventListener('touchmove',this.onNavigationTouchMove,false);
        this.mainContent.addEventListener('touchend',this.onNavigationTouchEnd,false);

        this.navigation.addEventListener('mousedown',this.onNavigationTouchStart,false);
        this.navigation.addEventListener('mousemove',this.onNavigationTouchMove,false);
        this.navigation.addEventListener('mouseup',this.onNavigationTouchEnd,false);
        this.mainContent.addEventListener('mousedown',this.onNavigationTouchStart,false);
        this.mainContent.addEventListener('mousemove',this.onNavigationTouchMove,false);
        this.mainContent.addEventListener('mouseup',this.onNavigationTouchEnd,false);
        
    }
    registerListener(){
        this.onNavigationMove = new CustomEvent("onnavigationmove",
        {
            detail:{
                target:this.navigation,
                time: new Date()
            }
        });
        this.onNavigationCollapsed = new CustomEvent("onnavigationcollapsed",
        {
            detail:{
                target:this.navigation,
                timestamp: Math.floor(Date.now()/1000)
            }
        });
        this.onNavigationExpanded = new CustomEvent("onnavigationexpanded",
        {
            detail:{
                target:this.navigation,
                timestamp: Math.floor(Date.now()/1000)
            }
        });
    }
    onClick(e){
        console.log('click target',e.target);
    }
    toggleNavigation(e){
        console.log('toggleBtn clicked',e);
        let width;
        if(!this.opened){
            width = this.navigationWidth;
            this.opened = true;
        }else{
            width = this.minWidth;
            this.opened = false;
        }
        this.moveNavigationIntoPosition(width);
    }
    closeNavigation(){

    }
    onNavigationTouchStart(evt){
        
        if(this.target) return;
        if(!evt.target.hasAttribute('navigation') && !evt.target.hasAttribute('content')) {
            return;
        }
        //set startX to current touched/clicked X position on page
        this.startX = evt.pageX || evt.touches[0].pageX;
        //set currentX equal to startX
        this.currentX = this.startX;
        if(evt.target.hasAttribute('content') && this.startX >= (parseInt(this.navigationWidth) + parseInt(this.range))){
            console.log('cancel moving navigation');
            return;
        }
        this.target = this.navigation;
        //set targetBCR to current touched/clicked target Bounding Client Rectangle
        this.targetBCR = this.target.getBoundingClientRect();
        
        
        //set dragging to true
        this.draggingNavigation = true;
        /* because we will change the panel width based on X axis using translateY
        *  set property will-change to transform */
        this.navigation.style.willChange = 'width';

        evt.preventDefault();
    }
    onNavigationTouchMove(evt){
        if (!this.target)
            return;
        //set currentY to current touched/clicked Y position on page when we drag the header
        this.currentX = evt.pageX || evt.touches[0].pageX;
        this.dispatchEvent(this.onNavigationMove);
    }
    onNavigationTouchEnd(){
        if (!this.target)
            return;

        this.targetX = 0;
        //create new variable screenX and set current header panel position to it.
        let screenX = this.currentX - this.startX;
        /* threshold variable is used to check if user has drag more then 1/4 of panel height size
        *  you can change this to half or whatever you want the slider to be expanded or not
        *  when user drag more than threshold */
        const threshold = this.navigationBCR.width * 0.5;
        if (Math.abs(screenX) > threshold) {
            /* set targetX to panel bounding client rectangle height subtract by panel header height if screenY is
            *  positive value and set to negative value of panel bounding client rectangle height add by
            *  panel header height */
            this.targetX = (screenX > 0) ?
                (this.navigationBCR.width) :
                (-this.navigationBCR.width);
        }
        //set dragging to false
        this.draggingNavigation = false;
    }
    calculateMinWidth(){
        var items = this.sidenavContent.children;
        items = Array.from(items);
        return (items.length) ? items[0].querySelector('[icon]').offsetWidth :this.toggleBtn.offsetWidth;
    }
    attachedCallback(){
        console.log('attached');
    }
    connectedCallback(){
        this.navigationWidth = this.getAttribute('navigation-width');
        this.opened = (this.hasAttribute('opened') || this.navigation.offsetWidth !== parseInt(this.minWidth)) ? true : false;
        this.style.opacity = 1;
        this.sidenavHeader.style.width = `${this.navigationWidth}px`;
        this.mainContent.style.width = `calc(100% - ${this.navigationWidth}px)`;
    }
    disconnectedCallback(){

	}
    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
        	default:
        	break;
        	case "navigation-width":
                if(newValue !== oldValue)
                this.navigationWidth = parseInt(newValue);
				break;
        	case "width":
                if(newValue !== oldValue)
        		this.width = newValue;
        		break;
            case "always-show-icon":
                if(this.hasAttribute('always-show-icon')){
                    this.alwaysShowIcon = true;
                }else{
                    this.alwaysShowIcon = false;
                }
                break;
        }
	}
    moveNavigationIntoPosition(width){
        var nav  = this.navigation;
        const onTransitionEnd = evt => {
            nav.style.transition = '';
            if(this.opened){
                this.dispatchEvent(this.onNavigationExpanded);
            }else{
                this.dispatchEvent(this.onNavigationCollapsed);
            }
            nav.removeEventListener('transitionend',onTransitionEnd);
        };
        nav.addEventListener('transitionend',onTransitionEnd);
        nav.style.transition = 'width ease-in-out 200ms';
        nav.style.width = `${width}px`;
         // user has finish dragging, set target to null
        if(!this.draggingNavigation)
            this.target = null;
    }
    update(){
        requestAnimationFrame(this.update);
        if (!this.target)
            return;
        
        this.screenX = this.currentX - this.startX ;
        let currentWidth = parseInt(this.navigation.style.width.replace('px',''));
         
        /* create new variable width and set the value to where we want the sideNav width to change based on X axis.
        *  if current state is opened then change the width to navigationWidth add by screenX if screenX is positive value
        *  and navigationWidth substract by absolute value of screenX if screenX is negative value
        *  if current state is not opened use minWidth rather than navigationWidth */
        let width;
        if(this.opened){
            width = (this.screenX > 0 ) ? parseInt(this.navigationWidth) + Math.abs(this.screenX) : parseInt(this.navigationWidth) - Math.abs(this.screenX);
        }else{
            width = (this.screenX > 0 ) ? parseInt(this.minWidth) + Math.abs(this.screenX) : parseInt(this.minWidth) - Math.abs(this.screenX);
        }
        
        if(width > this.navigationWidth) width = parseInt(this.navigationWidth);
        if(width < this.minWidth) width = parseInt(this.minWidth);
        
        this.target.style.width = `${width}px`;
        // Check if user still dragging or not, if true don't execute the next code.
        if (this.draggingNavigation)
            return;
        const navigation = this.target;
        
        const isNearlyAtStart = (!this.opened)?(Math.abs(width) <= this.navigationWidth/2):(Math.abs(width) >= this.navigationWidth/2);

        // If the panel is nearly expanded and current state is not expanded.
        if (!isNearlyAtStart) {
            // set isExpanded to true
            this.opened = !this.opened;
            if(currentWidth > (this.navigationWidth/2)) width = this.navigationWidth;
            if(currentWidth < (this.navigationWidth/2)) width = this.minWidth;
        } else{
            if(this.opened) width = this.navigationWidth;
            if(!this.opened) width = this.minWidth;
        }        
        this.moveNavigationIntoPosition(width);
    }
}
customElements.define('side-nav',SideNav);

