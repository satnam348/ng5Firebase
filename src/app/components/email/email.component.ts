import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl , Validators } from '@angular/forms';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  myForm: FormGroup;
  error: any;
  switchForget: Boolean = false;
  constructor(public _AuthService: AuthService) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this._AuthService.eventEmitLogin.subscribe((data) => {
    this.error = data.message;
    });
  }
toggleSwitch() {
  this.switchForget = !this.switchForget;
}
emailLogin(formData) {
  if (formData.valid) {
 this._AuthService.signInWithEmailAndPassword(formData.value.email, formData.value.password);
  }
}
forgetPassword(formData) {
  if (formData.valid) {
    this._AuthService.sendPasswordResetEmail(formData.value.email);
}
}
}
