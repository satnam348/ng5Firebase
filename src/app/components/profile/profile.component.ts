import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { User } from '../../models/user.model';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
export interface User {
   displayName?: string;
  phoneNumber?: string;
  jobTitle: string;
  location: string;
  country: string;
  description: string ;
  email: string;
  photoURL: string;

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
currentUser: any;
currentLocation: any;
  constructor(public _auth: AuthService) { }

  ngOnInit() {
 firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    this.user = user;
    console.log(this.user);
     this.getUsers();
  }
this._auth.locationNotifier.subscribe((data) => {
this.currentLocation = data;
});
 });
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.upload();
  }
  getUsers() {
   return firebase.database().ref('/users/' +  this.user.uid).on('value', ((snapshot) => {
    this.currentUser = snapshot.val() ;
    }));
  }
  autoCompleteCallback1(selectedData: any) {
    console.log(selectedData);
  }
  toggleEditUser() {
  this.editUser = !this.editUser;
  this.createForm();
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
    displayName: new FormControl(this.currentUser.displayName, Validators.required),
    phoneNumber: new FormControl(this.currentUser.phoneNumber, Validators.required),
    jobTitle: new FormControl(this.currentUser.jobTitle, Validators.required),
    location: new FormControl(this.currentUser.location, Validators.required),
    country: new FormControl(this.currentUser.country, Validators.required),
    description: new FormControl(this.currentUser.description, Validators.required),
  });
}
  updateUser(url) {
    const user = firebase.auth().currentUser;
    const data: any = {
        photoURL: url
    };
    user.updateProfile(data).then(() => {
      console.log('sucess');
      this.updateProfilePic(url);
    }).catch(function(error) {
      // An error happened.
    });
  }
  updatePhone(no) {
    const user = firebase.auth().currentUser;
    const data: any = {
      phoneNumber: no
    };
    user.updateProfile(data).then(function() {
      console.log('sucess');
    }).catch(function(error) {
      // An error happened.
    });
  }
  updateProfile(user, loc) {
    const key = this.user.uid;
    const updates = {};
    user.value.email = this.user.email;
    user.value.location = this.currentLocation ? this.currentLocation : this.currentUser.location  ;
    user.value.photoURL = this.user.photoURL;
    updates['/users/' + key] = user.value;
    firebase.database().ref().update(updates);
    this.updatePhone(user.value.phoneNumber);
    this.editUser = false;
    this._auth.notification('Profile Updated');
  }
  updateProfilePic(user) {
    const key = this.user.uid;
    const updates = {};
        this.currentUser.photoURL = user;
    updates['/users/' + key] = this.currentUser;
    firebase.database().ref().update(updates);
    this._auth.notification('Profile Updated');
  }
}
