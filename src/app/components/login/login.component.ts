import { FirebaseApp } from 'angularfire2';
import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import 'firebase/storage';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: Observable<User>;
  error: any;
  constructor(public Auth: AuthService, public af: AngularFireDatabase,
    public app: FirebaseApp, public afAuth: AngularFireAuth, private router: Router) {

}

loginFb() {
  const provider = new firebase.auth.FacebookAuthProvider();
  return this.oAuthLogin(provider);
}

loginGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return this.oAuthLogin(provider);
}
private oAuthLogin(provider) {
  return this.afAuth.auth.signInWithPopup(provider)
  .then((credential) => {
    this.Auth.updateUserData(credential.user);
     });
}

}
