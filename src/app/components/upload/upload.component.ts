import { AuthService } from './../../services/auth.service';
import { FirebaseApp } from 'angularfire2';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


// declare var firebase: any;

interface Image {
  name: string;
  filename: string;
  downloadURL?: string;
  key?: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  public folder = 'images';
  selectedFiles: any;
  imageData: Observable<any[]>;
  isAuthenticate: Boolean;
  constructor(public af: AngularFireDatabase, public app: FirebaseApp, public _AuthService: AuthService) {
    this.imageData = this.getImages('/images');
    this.isAuthenticate = this._AuthService.getSession();
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }
  getImages(listPath) {
    return this.af.list(listPath).valueChanges();
  }

  upload() {
    // Create a root reference
    const storageRef = this.app.storage().ref();

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
          this.saveImage({ name: selectedFile.name, url: item.url });
        }
      );
    }
  }

  private saveImage(image: any) {
    // this.af.list
    const newPostKey = firebase
      .database()
      .ref()
      .child('images')
      .push().key;
    const updates = {};
    image.key = newPostKey;
    updates['/images/' + newPostKey] = image;
    firebase
      .database()
      .ref()
      .update(updates);
  }
  delete(image: Image) {
    const storagePath = `${this.folder}/` + image.name;
    const referencePath = `${this.folder}/` + image.key;

    // Do these as two separate steps so you can still try delete ref if file no longer exists
    // Delete from Storage
    firebase
      .storage()
      .ref()
      .child(storagePath)
      .delete()
      .then(
        () => {
          console.log('File deleted', storagePath);
        },
        error => console.error('Error deleting stored file', storagePath)
      );

    // Delete references
    this.af.object(referencePath).remove();
  }
}
