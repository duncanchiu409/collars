import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Post } from '../../classes/Post';
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  public url :string;

  constructor(private angularFirestore :AngularFirestore, private http :HttpClient) {
    this.url = environment.apiURL + '/posts'
  }

  getPosts(challengeID :string){
    return this.http.get<Array<Post>>(this.url + '/' + challengeID).pipe(
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
