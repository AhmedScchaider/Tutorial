'use strict';
class SideNavItem extends HTMLElement{
    static get observedAttributes(){

    }
    constructor(){
        super();
        this.icon = this.querySelector('[icon]');
        this.label = this.querySelector('label');
        this.sidenav = this.findSideNav(this);
        this.username = this.sidenav.querySelector('.username');
        
        this.username.style.willChange = 'opacity';
        this.username.style.transition = 'opacity 50ms';
        
        this.addEventListeners();
    }
    addEventListeners(){
        this.sidenav.addEventListener('onnavigationmove',this._onNavigationMove.bind(this));
        this.sidenav.addEventListener('onnavigationcollapsed',this._onNavigationCollapsed.bind(this));
        this.sidenav.addEventListener('onnavigationexpanded',this._onNavigationExpanded.bind(this));
        this.addEventListener('click',this.onItemClick.bind(this))
    }
    findSideNav(el){
        var sidenav = el;
        while(sidenav.nodeName.toLowerCase() !== 'side-nav'){
            if(sidenav.parentNode){
              sidenav = sidenav.parentNode;
            }else{
              sidenav = null;
              break;
            }
        }
        return sidenav;
    }
    _onNavigationMove(e){
        var m = parseInt(this.sidenav.navigationWidth) - parseInt(this.sidenav.minWidth);
        var d = e.detail.target.offsetWidth ;
        var op = Math.abs((m - d) / m - 1);
        this.username.style.opacity = op;
    }
    _onNavigationCollapsed(e){
        this.username.style.opacity = 0;
    }
    _onNavigationExpanded(e){
        this.username.style.opacity = 1;
    }
    onItemClick(e){
        console.log(e);
    }
    attachedCallback(){
        
    }
    connectedCallback(){

    }
    disconnectedCallback(){

    }
    attributeChangedCallback(name, oldValue, newValue){

    }

}
customElements.define('side-nav-item',SideNavItem);
