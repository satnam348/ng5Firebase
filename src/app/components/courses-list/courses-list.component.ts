import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
 interface Blog {
  title: string;
  link: string;
  description: string;
  time: Date;
  author: string;
}

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  coursesObservable: Observable<any[]>;
  myForm: FormGroup;
  isAuthenticate: boolean;
  constructor(private db: AngularFireDatabase) { }
  ngOnInit() {
    this.coursesObservable = this.getCourses('/courses');
    this.myForm = new FormGroup({
      title: new FormControl('', Validators.required),
      link: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
 this.isAuthenticate = this.getSession();
  }
  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
  getSession() {
  return JSON.parse(sessionStorage.getItem('session'));
  }
  onSubmit(formData) {
    if (formData.valid) {
      const key = formData.value.title.replace(/\s/g, '-');
      // const newPostKey = firebase.database().ref().child('courses').push().key;
      // const userRef = this.db.list(`courses/${key}`);
      const author = JSON.parse(sessionStorage.getItem('currentUser'));
      const data: Blog  = {
        title: formData.value.title,
        link: formData.value.link,
        description: formData.value.description,
        time: new Date(),
        author: author.email
      };
      const updates = {};
      updates['/courses/' + key] = data;
      firebase.database().ref().update(updates);
    }
    this.myForm.reset();
  }

}
