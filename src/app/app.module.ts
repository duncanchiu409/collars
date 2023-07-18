import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from "./shared/services/auth.service";
import { ChallengeService } from "./shared/services/challenge.service"
import { DogService } from "./shared/services/dog.service"

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ChallengesComponent } from './components/challenges/challenges.component';
import { DogInfoComponent } from './components/dog-info/dog-info.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog'
import { SubmitIdea } from './components/challenges/challenges.component';
import { ChallengeDetailsComponent} from './components/challenge-details/challenge-details.component';
import { NavButtonComponent } from './components/nav-button/nav-button.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { PostsService } from './shared/shared/services/posts.service';
import { ReactionsService } from './shared/services/reactions.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TimeToDaysPipe } from './time-to-days.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { imageDialog } from './components/dog-info/dog-info.component';
import { MatExpansionModule } from '@angular/material/expansion'
import { PostService } from './services/post.service';
import { CommentsService } from './services/comments.service';
import { SubmitChallenge } from './components/challenge-details/challenge-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ChallengesComponent,
    DogInfoComponent,
    WelcomeComponent,
    ForgetPasswordComponent,
    SubmitIdea,
    ChallengeDetailsComponent,
    NavButtonComponent,
    SettingsComponent,
    ProfileComponent,
    PostComponent,
    TimeToDaysPipe,
    imageDialog,
    SubmitChallenge
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
    ImageCropperModule,
    MatExpansionModule
  ],
  providers: [AuthService, ChallengeService, DogService, PostsService, ReactionsService, PostService, CommentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
