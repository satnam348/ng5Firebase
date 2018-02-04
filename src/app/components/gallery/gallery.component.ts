import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imageData: Observable<any[]>;
  slideUrl: string;
  intialView: number;
  openLightBox: Boolean = false;
  constructor(public af: AngularFireDatabase) { }

  ngOnInit() {
    this.imageData = this.getImages('/images');
  }

      getImages(listPath) {
        return this.af.list(listPath).valueChanges();
      }
      openSlide(item) {
        this.intialView = window.scrollY;
        window.scrollTo(0, 0);
        this.openLightBox = true;
      this.slideUrl = item;
      }
      closeSlide() {
        this.openLightBox = false;
        window.scrollTo(0,  this.intialView );
      }
}
