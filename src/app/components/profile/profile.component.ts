import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { User } from '../../models/user.model';
import { FormGroup, FormControl , Validators } from '@angular/forms';
export interface User {
  email: string;
  photoURL?: string;
  displayName?: string;
  phoneNumber?: string;
  jobTitle: string;
  location: string;
  country: string;
  description: string ;

}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
user: any;
selectedFiles: any;
folder: String = 'user';
editUser: Boolean = false;
myForm: FormGroup;
  constructor(public _auth: AuthService) { }

  ngOnInit() {
 firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    this.user = user;
    console.log(this.user);
  }

 });
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }
toggleEditUser() {
  this.editUser = !this.editUser;
}
  upload() {
    // Create a root reference
    const storageRef =  firebase.storage().ref();
    const item = this.selectedFiles;
    for (const selectedFile of item) {
      console.log(selectedFile);
      const folder = this.folder;
      const path = `/${this.folder}/${selectedFile.name}`;
      const iRef = storageRef.child(path);
      const uploadTask: firebase.storage.UploadTask = storageRef
        .child(path)
        .put(selectedFile);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          item.progress =
            uploadTask.snapshot.bytesTransferred /
            uploadTask.snapshot.totalBytes *
            100;
          console.log(item.progress);
        },
        error => {},
        () => {
          item.url = uploadTask.snapshot.downloadURL;
          item.isUploading = false;
          this.updateUser(item.url);
        }
      );
    }
  }
createForm() {
  this.myForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    jobTitle: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),


  });
}
  updateUser(url) {
    const user = firebase.auth().currentUser;
    const data: any = {
        photoURL: url
    };
    user.updateProfile(data).then(function() {
      console.log('sucess');
    }).catch(function(error) {
      // An error happened.
    });
  }
  updateProfile() {

  }
}
