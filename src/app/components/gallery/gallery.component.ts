import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imageData: Observable<any[]>;
  constructor(public af: AngularFireDatabase) { }

  ngOnInit() {
    this.imageData = this.getImages('/images');
  }

      getImages(listPath) {
        return this.af.list(listPath).valueChanges();
      }
}
