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
import { FormGroup, FormControl , Validators } from '@angular/forms';
import {MessagingService} from '../../services/messaging.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: Observable<User>;
  error: any;
  myForm: FormGroup;
  message;
  switchForget: Boolean = false;
  constructor(public Auth: AuthService, public af: AngularFireDatabase, public msgService: MessagingService ,
    public app: FirebaseApp, public afAuth: AngularFireAuth, private router: Router) {
      this.myForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
      this.Auth.eventEmitLogin.subscribe((data) => {
      this.error = data.message;
      });
this.pushNotify();
}
pushNotify() {
  this.msgService.getPermission();
  this.msgService.receiveMessage();
  this.message = this.msgService.currentMessage;
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
toggleSwitch() {
  this.switchForget = !this.switchForget;
}
emailLogin(formData) {
  if (formData.valid) {
    this.Auth.signInWithEmailAndPassword(formData.value.email, formData.value.password);
  }
}
forgetPassword(formData) {
  if (formData.valid) {
    this.Auth.sendPasswordResetEmail(formData.value.email);
}
}
}
