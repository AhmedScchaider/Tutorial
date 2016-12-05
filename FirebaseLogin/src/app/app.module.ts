import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB3V2kYKYRUATtfyLrSwQ63tcswVQqeIkY",
    authDomain: "nerdiex-99466.firebaseapp.com",
    databaseURL: "https://nerdiex-99466.firebaseio.com",
    storageBucket: "nerdiex-99466.appspot.com",
    messagingSenderId: "963376549934"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
