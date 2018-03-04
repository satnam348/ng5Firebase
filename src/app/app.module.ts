import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import { AppNavbarComponent } from './components/app-navbar/app-navbar.component';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmailComponent } from './components/email/email.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/authguard.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { LocationComponent } from './components/location/location.component';
import {MessagingService} from './services/messaging.service';
import { ModalDirective } from './components/gallery/model.directive';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'question/:category', component: CoursesListComponent },
    { path: 'gallery', component: GalleryComponent },
     { path: 'upload', component: UploadComponent , canActivate: [AuthGuard]},
     { path: 'login', component: LoginComponent },
     { path: 'signup', component: SignupComponent },
     { path: 'login-email', component: EmailComponent },
     { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
     { path: 'privacy-policy', component: PrivacyComponent },
     { path: 'desclaimer', component: DisclaimerComponent },
     { path: 'about', component: AboutUsComponent },
     { path: '**', component: LoginComponent }


];

@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    CoursesListComponent,
    UploadComponent,
    GalleryComponent,
    LoginComponent,
    SignupComponent,
    EmailComponent,
    ProfileComponent,
    LocationComponent,
    ModalDirective,
    PrivacyComponent,
    DisclaimerComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
     AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: false}),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    Ng4GeoautocompleteModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, MessagingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
