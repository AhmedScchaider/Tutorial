import { Component,ElementRef,OnInit } from '@angular/core';
import { AngularFire,AuthProviders,AuthMethods } from 'angularfire2';
import { NavController } from 'ionic-angular';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage implements OnInit{
	root:any;
	constructor(public navCtrl: NavController, public element: ElementRef, public af: AngularFire){
		this.element.nativeElement
	}
	ngOnInit(){
		this.root = this.element.nativeElement;
		var loginBtn = this.root.querySelector('#loginBtn');
		var fbBtn =  this.root.querySelector('#fb-login');
		var twBtn =  this.root.querySelector('#twitter-login');
		loginBtn.addEventListener('click',this.onClick.bind(this));
		twBtn.addEventListener('click',this.onTwitterLogin.bind(this));
		fbBtn.addEventListener('click',this.onFacebookLogin.bind(this));
	}
	onClick(e){
		let self = this;
		let email:string = this.root.querySelector('#email').value;
		let password:string = this.root.querySelector('#password').value;
		this.af.auth.login({
			email: email,
			password: password
		},{
			provider: AuthProviders.Password,
			method: AuthMethods.Password,
		}).then(function(response){
			let user = {
				email:response.auth.email,
				picture:response.auth.photoURL
			};
			self.navCtrl.pop();
		}).catch(function(error){
			console.log(error);
		});
	}
	onTwitterLogin(e){
		let self = this;
		this.af.auth.login({
			provider: AuthProviders.Twitter,
			method: AuthMethods.Popup
		}).then(function(response){
			let user = {
				email:response.auth.email,
				picture:response.auth.photoURL
			};
			window.localStorage.setItem('user',JSON.stringify(user));
			self.navCtrl.pop();
		}).catch(function(error){
			console.log(error);
		});
	}
	onFacebookLogin(e){
		let self = this;
		this.af.auth.login({
			provider: AuthProviders.Facebook,
			method: AuthMethods.Popup
		}).then(function(response){
			let user = {
				email:response.auth.email,
				picture:response.auth.photoURL
			};
			window.localStorage.setItem('user',JSON.stringify(user));
			self.navCtrl.pop();
		}).catch(function(error){
			console.log(error);
		});
	}
}