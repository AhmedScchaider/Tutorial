

'use strict';
class MorphingButton{
    constructor(){
        //initilize all variables
        this.btn = document.querySelector('.morpher a');
        this.meta = document.querySelector('.player');
        this.btnClose = document.querySelector('.button--close');

        this.onClick = this.onClick.bind(this);
        this.onCardClose = this.onCardClose.bind(this);
        //add all even listener needed
        this.addEventListeners();
    }
    addEventListeners(){
        this.btn.addEventListener('click',this.onClick);
        this.btnClose.addEventListener('click',this.onCardClose);
    }
    onCardClose(e){
        e.preventDefault();
        this.hideCard();
    }
    onClick(e){
        e.preventDefault();
        let self = this;
        // start listening state
        this.listening();

        //simulate listening for song in 5000 miliseconds
        setTimeout(function(){
            // stop listening state
            self.stopListening();
            // show card with song information
            self.showCard();
            // clear current Timeout
            clearTimeout(this);
        },5000);
    }

    stopListening(){
        // remove the listening class from button
        this.btn.className = 'circle-button';
    }
    listening(){
        // add class listening to circle-button to show wave
        this.btn.className += ' listening';
    }
    hideCard(){
        // remove player--visible to hide the song information
        this.meta.className = 'player';
        // add transition to morpher with 100ms delay on transform
        this.btn.parentNode.style.transition = 'border-radius 100ms linear,transform 100ms linear 100ms';
        // remove card class from morpher
        this.btn.parentNode.className = 'morpher';
        //add transtion on opacity with duration 200ms and delay 200ms
        this.btn.style.transition = 'opacity 200ms linear 200ms';
        //change button opacity to 1 and show the button
        this.btn.style.opacity = 1;
    }
    showCard(){
        // add transition to morpher with 100ms delay on border-radius
        this.btn.parentNode.style.transition = 'border-radius 100ms linear 100ms,transform 100ms linear';
        //add transtion on opacity with duration 50ms
        this.btn.style.transition = 'opacity 50ms linear';
        //change button opacity to 0 and hide the button
        this.btn.style.opacity = 0;
        // add card class to morpher to transform it from circle button to card
        this.btn.parentNode.className += ' card';
        // add player--visible class to show track information
        this.meta.className += ' player--visible';
    }
}

window.addEventListener('load',() => new MorphingButton());
