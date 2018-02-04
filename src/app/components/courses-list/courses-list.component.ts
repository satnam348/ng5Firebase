import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import {Routes, ActivatedRoute} from '@angular/router';

 interface Blog {
  title: string;
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
  Users: Observable<any[]>;
  myForm: FormGroup;
  isAuthenticate: boolean;
  siteAdmin: boolean;
  currentRoute: any;
  category = ['angular', 'javascript', 'node', 'jquery', 'angularjs' ];
  @ViewChild('target') private myScrollContainer: ElementRef;
  constructor(private db: AngularFireDatabase, public _AuthService: AuthService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.currentRoute = params.category;
      this.coursesObservable = this.getCourses(`courses/${this.currentRoute}`);
    });
    this.myForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
 this.isAuthenticate = this.getSession();
 this.siteAdmin = this._AuthService.getSession();

  }
  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
  getSession() {
    return JSON.parse(sessionStorage.getItem('session')) ;
    }
  onSubmit(formData) {
    if (formData.valid) {
      const key = formData.value.title.replace(/\s/g, '-').replace('.', '').toLocaleLowerCase();
      const author = JSON.parse(sessionStorage.getItem('currentUser'));
      const data: Blog  = {
        title: formData.value.title,
        description: formData.value.description,
        time: new Date(),
        author: author.email
      };
      const updates = {};
      updates[`/courses/${this.currentRoute}/` + key] = data;
      firebase.database().ref().update(updates);
    }
    this.myForm.reset();
  }
editPost(post) {
  this.myForm = new FormGroup({
    title: new FormControl(post.title , Validators.required),
    description: new FormControl(post.description , Validators.required)
  });
 const at = this.myScrollContainer.nativeElement;
 at.scrollIntoView();
}
clearPost() {
  this.myForm.reset();
}
removePost(post) {
  const key = post.title.replace(/\s/g, '-');
  const referencePath = `courses/${key}`;
  firebase.database().ref(referencePath).remove();
}
}
