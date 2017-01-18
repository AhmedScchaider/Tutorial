import { Component,OnInit } from '@angular/core';
import { AngularFire,AngularFireDatabase } from 'angularfire2';
import { NavController,NavParams } from 'ionic-angular';


@Component({
    selector: 'user-detail',
    templateUrl: 'detail.html'
})

export class UserDetail implements OnInit{
    public uid: string;
    public db: AngularFireDatabase;
    public user: any;
    constructor(public params: NavParams,public af: AngularFire){
        this.uid = params.get('uid');
        this.db = af.database;
        let self = this;
        let users = this.db.object('/users', { preserveSnapshot: true });
        users.subscribe(snapshot => {
            self.user = snapshot.val()[this.uid];
        });
    }
    
    ngOnInit(){

    }
}