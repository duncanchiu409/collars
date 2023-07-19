import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Post } from '../classes/Post';
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getFunctions, connectFunctionsEmulator, httpsCallableFromURL, httpsCallable, HttpsCallable } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AuthService } from 'src/app/shared/services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  public url :string;
  public headerOptions = {ResponseType: 'JSON'}

constructor(private angularFirestore :AngularFirestore, private authService :AuthService, private http :HttpClient) {
    this.url = environment.apiURL + '/posts'
  }

  getPosts(challengeID :string, params?: any){
    return this.http.get<Array<any>>(this.url + '/' + challengeID, {params: params}).pipe(
      tap(_ => console.log(_))
    )
  }

  getPost(postID :string){
    let url = this.url + '/' + postID
    return this.http.get(url).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<Post>('GET A POST'))
    )
  }

  sendUserToken(params :any){
    let url = this.url + '/usertokentesting';
    return this.http.get(url, {params: params}).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError('sendUserToken'))
    )
  }
  
  addPost(userAccessToken :string, body :any){
    let url = this.url + '/'
    body['userAccessToken'] = userAccessToken;
    return this.http.post(url, body).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError('Add post'))
    )
  }

  connectToEmulator(){
    let functionInstance = getFunctions()
    connectFunctionsEmulator(functionInstance, 'localhost', 5001)
    let https :HttpsCallable = httpsCallable(functionInstance, 'getAllPosts')
    debugger
    console.log(https)
    return https
  }

  private handleError<T>(operation='operation', result? :T){
    return (error :any) => {
      console.log(error)
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  private log(message :string) :void{
    console.log(message)
  }
}
