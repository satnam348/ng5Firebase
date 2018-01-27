import { FirebaseApp } from 'angularfire2';
import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import 'firebase/storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent  {

  state: string = '';
  error: any;
  myForm: FormGroup;
  constructor(public af: AngularFireDatabase,
    public Auth: AuthService,
    public app: FirebaseApp, public afAuth: AngularFireAuth, private router: Router) {
    this.myForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl(),
      confirmPassword: new FormControl()
    });
  }

  onSubmit(formData) {
    if (formData.valid) {
      console.log(formData.value);
      this.afAuth.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password).then(
        (success) => {
        console.log(success);
        this.Auth.updateUserDatafromSignUp(success, formData.value.name);
        this.Auth.sendVerificationMail();
        this.router.navigate(['/login']);
      }).catch(
        (err) => {
        console.log(err);
        this.error = err;
      });
    }
  }

}
