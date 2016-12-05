import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {  LoginPage } from '../login/login';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    if(!this.isAlreadyLoggedIn()){
      console.log('not login yet, redirect to login page');
      this.navCtrl.push(LoginPage);
    }
  }
  isAlreadyLoggedIn(){
    let user = window.localStorage.getItem('user');
    return user !== null &&  user !== undefined;
  }

}
