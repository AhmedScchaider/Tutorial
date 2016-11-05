
/**
* Copyright 2016 Nerdiex All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


'use strict';

class SlidingUpPanel{

    constructor (){
        this.slidingPanel = document.querySelector('#sliding-up-panel');
        this.panelHeader = document.querySelector('#sliding-up-panel-header');
        this.panelBody = document.querySelector('#sliding-up-panel-body');
        this.mainContent = document.body.children[0];

        this.mainContent.style.marginBottom = `${this.panelHeader.offsetHeight}px`;

        this.target = null;
        this.targetBCR = null;
        this.panelBCR = this.slidingPanel.getBoundingClientRect();

        this.startY = 0;
        this.currentY = 0;
        this.screenY = 0;
        this.targetY = 0;
        this.collapsedY = this.panelBCR.height - this.panelHeader.offsetHeight;
        this.expandedY = -this.panelBCR.height + this.panelHeader.offsetHeight;

        this.draggingHeader = false;
        this.isExpanded = false;

        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.update = this.update.bind(this);

        this.initListener();
        this.addEventListeners();

        requestAnimationFrame(this.update);
    }
    initListener(){
        this.onPanelMove = new CustomEvent("onpanelmove",
        {
            detail:
            {
                message: "Hello There",
                target:this.slidingPanel,
                header:this.panelHeader,
                body:this.panelBody,
                time: new Date()
            },

            bubbles: true,
            cancelable: true
        });
        this.onPanelExpanded = new CustomEvent("onpanelexpanded",
        {
            detail:
            {
                message: "Hello There",
                time: new Date()
            },
            target:this.slidingPanel,
            header:this.panelHeader,
            body:this.panelBody,
            bubbles: true,
            cancelable: true
        });
        this.onPanelCollapsed = new CustomEvent("onpanelcollapsed",
        {
            detail:
            {
                message: "Hello There",
                time: new Date()
            },
            target:this.slidingPanel,
            header:this.panelHeader,
            body:this.panelBody,
            bubbles: true,
            cancelable: true
        });
    }
    addEventListeners(){
        document.addEventListener('touchstart', this.onStart);
        document.addEventListener('touchmove', this.onMove);
        document.addEventListener('touchend', this.onEnd);

        const self = this;
        window.addEventListener('resize',function(e){
            self.slidingPanel.style.top = window.innerHeight - self.panelHeader.offsetHeight;
            self.expandedY = -window.innerHeight + self.panelHeader.offsetHeight;
            self.animateSlidePanelIntoPosition(self.slidingPanel);
            e.preventDefault();
        });

        document.addEventListener('mousedown', this.onStart);
        document.addEventListener('mousemove', this.onMove);
        document.addEventListener('mouseup', this.onEnd);
    }
    onStart (evt) {
        if (this.target)
            return;
        //if current target id is not sliding-up-panel-header, don't execute the next code.
        if (evt.target.id != 'sliding-up-panel-header')
            return;
        //set target to current touched/clicked target
        this.target = evt.target;
        //set targetBCR to current touched/clicked target Bounding Client Rectangle
        this.targetBCR = this.target.getBoundingClientRect();
        //set startY to current touched/clicked Y position on page
        this.startY = evt.pageY || evt.touches[0].pageY;
        //set currentY equal to startY
        this.currentY = this.startY;

        //set draggingHeader to true
        this.draggingHeader = true;
        /* because we will change the panel position based on Y axis using translateY
        *  set property will-change to transform */
        this.slidingPanel.style.willChange = 'transform';

        evt.preventDefault();
    }
    onMove(evt){
        if (!this.target)
            return;
        //set currentY to current touched/clicked Y position on page when we drag the header
        this.currentY = evt.pageY || evt.touches[0].pageY;
        evt.target.parentNode.dispatchEvent(this.onPanelMove);
    }
    onEnd(evt){
        if (!this.target)
            return;

        this.targetY = 0;
        //create new variable screenY and set current header panel position to it.
        let screenY = this.currentY - this.startY;
        /* threshold variable is used to check if user has drag more then 1/4 of panel height size
        *  you can change this to half or whatever you want the slider to be expanded or not
        *  when user drag more than threshold */
        const threshold = this.panelBCR.height * 0.25;
        if (Math.abs(screenY) > threshold) {
            /* set targetY to panel bounding client rectangle height subtract by panel header height if screenY is
            *  positive value and set to negative value of panel bounding client rectangle height add by
            *  panel header height */
            this.targetY = (screenY > 0) ?
                (this.panelBCR.height - this.panelHeader.offsetHeight) :
                (-this.panelBCR.height + this.panelHeader.offsetHeight);
        }
        //set draggingHeader to false
        this.draggingHeader = false;
    }
    update () {
        requestAnimationFrame(this.update);

        if (!this.target)
            return;

        if (this.draggingHeader) {
            this.screenY = this.currentY - this.startY;
        } else {
            this.screenY += (this.targetY - this.screenY) / 4;
        }
        /* create new variable to and set the value to where we want the sliding panel to move based on Y axis.
        *  if current panel state is expanded then we move it to expandedY add by screenY
        *  if not then use screenY instead */
        let to = (this.isExpanded) ? (this.expandedY + this.screenY) : this.screenY;
        //prevent the header to overflow the screen height when dragging
        if(to < this.expandedY) to = this.expandedY;
        if(to > 0) to = 0;

        this.slidingPanel.style.transform = `translateY(${to}px)`;
        // Check if user still dragging the header or not, if true don't execute the next code.
        if (this.draggingHeader)
            return;
        const panel = this.target.parentNode;
        const isNearlyAtStart = (!this.isExpanded)?(Math.abs(this.screenY) < Math.abs(panel.offsetHeight/4)):(Math.abs(this.screenY) > Math.abs(panel.offsetHeight/4));
        const isNearlyExpanded = (!this.isExpanded)?(Math.abs(this.screenY) > Math.abs(panel.offsetHeight/4)):(Math.abs(this.screenY) < Math.abs(panel.offsetHeight/4));
        // If the panel is nearly expanded and current state is not expanded.
        if (isNearlyExpanded && !this.isExpanded) {
            // set isExpanded to true
            this.isExpanded = true;
            panel.dispatchEvent(this.onPanelExpanded);
        } else if (isNearlyAtStart) {
            // set isExpanded to false
            this.isExpanded = false;
            panel.dispatchEvent(this.onPanelCollapsed);
        }
        // animate the panel to the position where we want it based on its state expanded or not.
        this.animateSlidePanelIntoPosition(this.target.parentNode);
    }
    animateSlidePanelIntoPosition (target) {
        if(!target){
            return;
        }
        // create new function variable to excecute when the transition has ended
        const onAnimationComplete = evt => {
            const panel = evt.target;
            panel.removeEventListener('transitionend', onAnimationComplete);
            panel.style.transition = '';
        };
        // create and set panel to current slidingPanel
        const panel = target;
        //check if current state is expanded
        if(this.isExpanded){
            //add event listener when the transition has ended.
            panel.addEventListener('transitionend', onAnimationComplete);
            //set the panel transition to transform with duration 200 miliseconds
            panel.style.transition = `transform 200ms`;
            //set the panel transform to position when it's in expanded state
            panel.style.transform = `translateY(${this.expandedY}px)`;

            this.panelHeader.setAttribute('class','expanded');
        }else{
            //add event listener when the transition has ended.
            panel.addEventListener('transitionend', onAnimationComplete);
            //set the panel transition to transform with duration 200 miliseconds
            panel.style.transition = `transform 200ms`;
            //set the panel transform to position when it's not in expanded state
            panel.style.transform = `translateY(0px)`;

            this.panelHeader.removeAttribute('class')
        }
        // user has finish dragging the header, set target to null
        if(!this.draggingHeader)
            this.target = null;
    }
    
}
window.addEventListener('load', () => new SlidingUpPanel());
