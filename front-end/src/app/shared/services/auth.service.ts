import { Injectable, NgZone } from '@angular/core';

import { User } from './user';

import { FacebookAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) { 
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log(user)
            if (user === undefined){
              this.router.navigate(['dog-info'])
            }
            this.router.navigate(['challenges']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(username :string, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user, username);
        this.router.navigate(['dog-info'])
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, username? :string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      username: username
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  FacebookAuth() {
    return this.AuthLogin(new FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider :any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const userString = localStorage.getItem('user')

    if(userString === null){
      return false
    }

    return true;
  }

  get withDogInfo(): boolean {
    const userString = localStorage.getItem('user')

    if(userString === null){
      return false
    }

    const user = JSON.parse(userString)
    const userRef = this.afs.doc(`users/${user.uid}`);
    const result = userRef.get()
    
    let user_snapshot :any[] = []
    result.forEach((res) => {
      let res_snapshot = res.data()
      console.log(res_snapshot)
      user_snapshot.push(res_snapshot)
    })

    if(user_snapshot.length !== 1){
      return false
    }
    else{
      if(user_snapshot[0].dogid === undefined){
        return false
      }
      return true
    }
  }
}
