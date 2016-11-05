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
class MusicPlayer{
    constructor(){
        this.player = document.querySelector('audio');
        this.playlist = document.querySelector('.playlist');
        this.playPauseBtn = Array.from(document.querySelectorAll('.play-btn'));
        this.nextBtn = document.querySelector('.next-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.duration = document.querySelector('.duration');
        this.currentTime = document.querySelector('.currentTime');
        this.preloader = document.querySelector('.preloader');
        this.songs = Array.from(document.querySelectorAll('.song a'));
        this.currentSong = 0;

        this.onPlayPause = this.onPlayPause.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onMetadataLoaded = this.onMetadataLoaded.bind(this);
        this.onSongEnded = this.onSongEnded.bind(this);
        this.songChanged = this.songChanged;
        this.setupMarqueeAnimation = this.setupMarqueeAnimation.bind(this);
        this.addEventListeners();
        this.initPlaylist();

    }

    initPlaylist(){
        this.getPlaylist();
    }
    getPlaylist(){
        var self = this;
        return new Promise(function(resolve,reject){
            var xhr = new XMLHttpRequest();
            xhr.onload = function(e){
                e.preventDefault();
                if(xhr.status == 200 || xhr.status == 409){
                    var data = JSON.parse(xhr.response.match(/\[.*\]/ig, "")[0]);
                    data.forEach(function(item,index){
                        self.loadPlaylistMetadata(item,index,data.length);
                    });
                    self.songs = Array.from(document.querySelectorAll('.song a'))
                    resolve(data);

                }else{
                    reject('cant get paylist');
                }
            }
            xhr.open('get', '\songlist', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }
    addEventListeners(){
        this.player.ontimeupdate = this.onProgress;
        this.player.onended = this.onSongEnded;
        this.player.onloadedmetadata = this.onMetadataLoaded;
        for(var i in this.playPauseBtn){
            this.playPauseBtn[i].addEventListener('click',this.onPlayPause);
        }
        this.nextBtn.addEventListener('click',this.onNextClick);
        this.prevBtn.addEventListener('click',this.onPreviousClick);
    }
    onSongEnded(e){
        this.moveToNext();
    }
    onNextClick(e){
        this.moveToNext();
        e.preventDefault();
    }
    onPreviousClick(e){
        this.moveToPrevious();
        e.preventDefault();
    }
    onPlayPause(e){
        if(this.player.getAttribute('src') == ''){
            this.player.setAttribute('src',this.songs[0].getAttribute('href'));
            this.currentSong = 0;
            this.songChanged(null,0);
        }
        if(this.player.paused){
            this.player.play().then().catch(function(error){
                console.log(error);
            });
            for(var i in this.playPauseBtn){
                this.playPauseBtn[i].children[0].setAttribute('src','assets/icons/pause-btn.svg');
                this.playPauseBtn[i].setAttribute('state','play');
            }
        }else{
            try{
                this.player.pause();
                for(var i in this.playPauseBtn){
                    this.playPauseBtn[i].children[0].setAttribute('src','assets/icons/play-btn.svg');
                    this.playPauseBtn[i].setAttribute('state','play');
                }
            }catch(error){
                console.log(error);
            }

        }

        e.preventDefault();
    }
    onProgress(e){
        //console.log(e);
    }
    loadPlaylistMetadata(path,index,length){
        self =this;
        var li = document.createElement('li');
        li.setAttribute('class','song');
        li.setAttribute('data-index',index);
        var a = document.createElement('a');
        a.setAttribute('href',path);
        var img = document.createElement('img');
        img.className = 'cover';
        img.style.cssFloat = 'left';
        var meta = document.createElement('div');
        meta.className = 'metatag playlist';
        var title = document.createElement('span');
        title.className = 'title';
        title.style.whiteSpace = 'nowrap';
        var artist = document.createElement('span');
        artist.className = 'artist';
        li.appendChild(a);
        a.appendChild(img);
        a.appendChild(meta);
        var p = document.createElement('p');
        p.appendChild(title);
        meta.appendChild(p);
        p = document.createElement('p').appendChild(artist);
        meta.appendChild(p);

        a.onclick = function(e){
            e.preventDefault();
            self.player.setAttribute('src',path);
            self.songChanged(self.currentSong,li.getAttribute('data-index'));
            self.currentSong = parseInt(li.getAttribute('data-index'));
            self.playPauseBtn[0].children[0].click();
        };
        this.playlist.children[0].appendChild(li);
        jsmediatags.read(path, {
            onSuccess: function(tag) {
                var url = path;
                var filename = url.split('/');
                filename = filename[filename.length-1];

                if(tag.tags.picture != undefined){
                     var base64String = "";
                     for (var i = 0; i < tag.tags.picture.data.length; i++) {
                        base64String += String.fromCharCode(tag.tags.picture.data[i]);
                    }
                    img.setAttribute('src',"data:"+ tag.tags.picture.format +";base64," + window.btoa(base64String));
                }else{
                    img.setAttribute('src',"assets/img/albumart_mp_unknown.png");
                }
                artist.innerHTML = tag.tags.artist || 'unknown';
                title.innerHTML = tag.tags.title || filename;

                self.setupMarqueeAnimation(title,artist);
                if(index == length - 1){
                    self.preloader.style.display = 'none';
                    let list = self.playlist.querySelectorAll('li');
                    list.forEach(function(item,index){
                        item.style.transition = `transform 300ms ease-in ${index*0.2}s, opacity 300ms ease-in ${index*0.2}s`;
                    });
                    self.playlist.setAttribute('class','playlist');
                }

            },
            onError: function(error) {
                console.log(error);
            }
        });
    }
    setupMarqueeAnimation(title,artist){
        if(title.offsetWidth > parseInt(title.parentNode.style.width.replace('px',''))){
            title.className += ' marquee-title';
        }else{
            title.style.willChange = 'initial';
            title.className = 'title';
        }
        if(artist.offsetWidth > parseInt(artist.parentNode.style.width.replace('px',''))){
            artist.className += ' marquee-artist';
        }else{
            artist.className = 'artist';
        }
    }
    onMetadataLoaded(e){
        var self = this;
        var artists = document.querySelectorAll('.meta .artist');
        var titles = document.querySelectorAll('.meta .title');
        var covers = Array.from(document.querySelectorAll('img.coverart'));
        jsmediatags.read(e.target.src, {
            onSuccess: function(tag) {
                var url = e.target.src;
                var filename = url.split('/');
                filename = filename[filename.length-1]
                if(tag.tags.picture != undefined){
                    for(var j in covers){
                        var base64String = "";
                        for (var i = 0; i < tag.tags.picture.data.length; i++) {
                            base64String += String.fromCharCode(tag.tags.picture.data[i]);
                        }
                        covers[j].setAttribute('src',"data:"+ tag.tags.picture.format +";base64," + window.btoa(base64String));
                    }
                }else{
                    for(var j in covers){
                        covers[j].setAttribute('src',"assets/img/albumart_mp_unknown.png");
                    }
                }
                for(var i = 0; i<artists.length;i++){
                    titles[i].parentNode.style.width = 200;
                    artists[i].parentNode.style.width = 200;
                    artists[i].innerHTML = tag.tags.artist;
                    titles[i].innerHTML = tag.tags.title;


                    if(undefined == tag.tags.artist){
                        artists[i].innerHTML = 'unknown';
                    }
                    if(undefined == tag.tags.title){
                        titles[i].innerHTML = filename;
                    }

                    self.setupMarqueeAnimation(titles[i],artists[i]);
                }

            },
            onError: function(error) {
                console.log(error);
            }
        });
    }

    moveToNext(){
        //this.player.pause();
        const next = this.currentSong + 1;
        if(next < this.songs.length){
            const link = this.songs[next].getAttribute('href');
            this.songChanged(this.currentSong,next);
            this.currentSong = next;
            this.player.setAttribute('src',link);

        }else{
            var link = this.songs[0].getAttribute('href');
            this.songChanged(this.currentSong,0);
            this.currentSong = 0;
            this.player.setAttribute('src',link);
        }
        this.player.load();
        this.player.play();
    }
    moveToPrevious(){
        this.player.pause();
        var prev = this.currentSong - 1;
        if(prev >= 0){
            const link = this.songs[prev].getAttribute('href');
            this.songChanged(this.currentSong,prev);
            this.currentSong = prev;
            this.player.setAttribute('src',link);

        }else{
            prev = this.songs.length - 1;
            var link = this.songs[prev].getAttribute('href');
            this.songChanged(this.currentSong,prev);
            this.currentSong = prev;
            this.player.setAttribute('src',link);
        }
        this.player.play();
    }
    play(){
        this.player.play();
    }
    pause(){
        this.player.pause();
    }
    songChanged(before,current){
        if(before == null){
            this.songs[current].setAttribute('class','active');
        }else{
            this.songs[before].removeAttribute('class');
            this.songs[current].setAttribute('class','active');
        }
    }

}
window.addEventListener('load',() => new MusicPlayer());
