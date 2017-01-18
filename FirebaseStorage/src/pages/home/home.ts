import { Component,Inject } from '@angular/core';
import { AngularFire,FirebaseListObservable,FirebaseApp } from 'angularfire2';
import { NavController,AlertController } from 'ionic-angular';
import {  LoginPage } from '../login/login';
import {  UsersPage } from '../users/users';
import {  UserDetail } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public users: FirebaseListObservable<any>;
  
  constructor(public navCtrl: NavController, public af: AngularFire, public alert: AlertController) {
    if(!this.isAlreadyLoggedIn()){
      console.log('not login yet, redirect to login page');
      this.navCtrl.push(LoginPage);
    }
    let db = this.af.database;
    this.users = db.list('/users');
  }
  addUser(e){
    this.showUserNameAlert().then((data: any) =>{
      console.log('username', data.name);
      this.navCtrl.push(UsersPage,{"act":"add","name":data.name});
    });
  }
  showUserNameAlert(){
    return new Promise((resolve,reject) => {
      let alert = this.alert.create();
      alert.setTitle('User Name');
      alert.addInput({type:'text',label: 'name',name:'name'});
      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          resolve(data);
        }
      });
      alert.present();
    })
  }
  viewUserDetail(uid){
    this.navCtrl.push(UserDetail,{"uid":uid});
  }
  editUser(uid){
    this.navCtrl.push(UsersPage,{"act":"edit","uid":uid});
  }
  deleteUser(uid){
    this._confirmDelete().then(() => {
      let users = this.af.database.list('/users');
      users.remove(uid);
    });
  }
  _confirmDelete(){
    return new Promise((resolve,reject) => {
      let alert = this.alert.create();
      alert.setTitle('Delete User');
      alert.setMessage('Are you sure you want to delete this user ?');
      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          resolve(data);
        }
      });
      alert.present();
    })
  }
  isAlreadyLoggedIn(){
    let user = window.localStorage.getItem('user');
    return user !== null &&  user !== undefined;
  }

}
