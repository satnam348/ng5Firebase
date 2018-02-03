import { ADMIN } from './../models/admin.config';
import { Injectable , EventEmitter } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import 'firebase/storage';
import { User } from '../models/user.model';


@Injectable()
export class AuthService {
  public eventEmit  = new EventEmitter();
  public eventEmitLogin  = new EventEmitter();
  public locationNotifier  = new EventEmitter();
  constructor(public af: AngularFireDatabase, public app: FirebaseApp, public afAuth: AngularFireAuth, private router: Router) {
  }
  public updateUserData(user, name?) {
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : name ,
      photoURL: user.photoURL
    };
     const updates = {};
     updates['/users/' + user.uid] = data;
     firebase.database().ref().update(updates);
     this.router.navigateByUrl('/profile');

  }

  public updateUserDatafromSignUp(user, name) {

     const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL
    };
     const updates = {};
     updates['/users/' + user.uid] = data;
     firebase.database().ref().update(updates);
     this.router.navigateByUrl('/profile');
   }


   public ChecKAuthentication() {
   return  firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
            this.eventEmit.next(user);
            const data: User = {
              uid: btoa(user.uid),
              email: user.email,
              displayName: name,
           };
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            sessionStorage.setItem('UserData', JSON.stringify(user));
            sessionStorage.setItem('session', 'true');
            this.SiteAdmin(data.uid);
           // this.router.navigate(['/profile']);
          } else {
            this.router.navigate(['/login']);
          }
        });
   }
   public SiteAdmin(uid) {
     const isSiteAdmin = (uid === ADMIN.uid ) ? 'true' : 'false';
     sessionStorage.setItem('isSiteAdmin', isSiteAdmin);
   }
   public sendVerificationMail() {
    firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            user.sendEmailVerification().then(function() {
             console.log('Email sent');
            }).catch(function(error) {
              console.log(error);
            });
          }
    });
   }
   public signInWithEmailAndPassword(email, password) {
   return firebase.auth().signInWithEmailAndPassword(email, password).
    then(() => {
      this.eventEmit.next();
      this.router.navigateByUrl('/profile');
      console.log('Login');
    }).
    catch((error) => {
      console.log(error);
      this.eventEmitLogin.next(error);
    });
   }
   public signOut() {
    firebase.auth().signOut().then(() => {
      this.eventEmit.next(null);
      sessionStorage.setItem('session', 'false');
      sessionStorage.removeItem('isSiteAdmin');
       sessionStorage.removeItem('UserData');
      console.log('Login Out');
    }).catch((error) => {
      console.log(error);
    });
   }

   public sendPasswordResetEmail(email) {
    return firebase.auth().sendPasswordResetEmail(email).then(() => {
      console.log('email send');
    }).catch(function(error) {
      console.log(error);
    });
   }
   getSession() {
    return JSON.parse(sessionStorage.getItem('session')) && JSON.parse(sessionStorage.getItem('isSiteAdmin'));
    }
}
