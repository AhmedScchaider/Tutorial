import { Component,ElementRef,OnInit,Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
    selector: 'page-users',
    templateUrl: 'users.html'
})

export class UsersPage implements OnInit{
    public user: any;
    public storage: any;
    public db: any;
    public name: string;
    public act: string;
    public uid: string;
    constructor(@Inject(FirebaseApp) public firebaseApp: firebase.app.App,public toastCtrl: ToastController, public navCtrl: NavController, public params: NavParams,public element: ElementRef,public loadingCtrl: LoadingController){
        this.db = firebaseApp.database();
        this.storage = firebaseApp.storage();
        this.name = params.get('name');
        this.act = params.get('act');
        this.uid = params.get('uid');
        
    }
    ngOnInit(){
        if(this.act === 'edit'){
            // create empty user object to prevent error in template
            this.user = {name:'',image:'',address:'',email:'',phone:''};
            this.db.ref(`/users/${this.uid}`)
            .once('value').then(snapshot => {
                this.user = snapshot.val();
            });
        }else{
            this.user = {name:this.name,image:'',address:'',email:'',phone:''};
        }
    }
    saveUser(event){
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
       
        let root = this.element.nativeElement;
        let image = root.querySelector('#image').files[0];
        let name = root.querySelector('#name').value;
        let email = root.querySelector('#email').value;
        let address = root.querySelector('#address').value;
        let phone = root.querySelector('#phone').value;
        this._uploadImage(image).then(imageURL => {
            let data: any = {};
            if(imageURL == null || imageURL == undefined) imageURL = '';
            if(this.act === 'add'){
                data = {
                    "name": name,
                    "email": email,
                    "image": imageURL,
                    "phone": phone,
                    "address": address
                };
                this._addUser(data);
            }else{
                data = {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "address": address
                };
                if(imageURL !== null || imageURL !== undefined) data.image = imageURL;
                this._updateUser(data);
            }
            loader.dismiss();
        });
        
    }
    _updateUser(data){
        let ref = this.db.ref(`/users/${this.uid}`);
        ref.set(data).then(response => {
            let toast = this.toastCtrl.create({
                message: 'User data has been saved.',
                duration: 2000,
                position: 'top'
            });

            toast.present(toast);
            setTimeout(function(){
                this.navCtrl.pop();
            }.bind(this),2000);
        });
    }
    _addUser(data){
        let ref = this.db.ref(`/users`);
        ref.push(data).then(response => {
            let toast = this.toastCtrl.create({
                message: 'User data has been saved.',
                duration: 2000,
                position: 'top'
            });

            toast.present(toast);
            setTimeout(function(){
                this.navCtrl.pop();
            }.bind(this),2000);
        });
    }
    _uploadImage(file){
        return new Promise((resolve,reject) => {
            var ref = this.storage.ref();
            if(file){
                var fileImageRef = ref.child(`images/users/${file.name}`);
                    fileImageRef.put(file).then(function(snapshot) {
                    return resolve(snapshot.downloadURL);
                }).catch(function(reason){
                    console.log('error happen when trying to upload file',reason);
                });
            }else{
                resolve();
            }
        });
    }
}