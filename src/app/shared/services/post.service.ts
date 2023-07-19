import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public url :string

  constructor(private http :HttpClient) {
    this.url = environment.apiURL + '/post'
  }

  getPost(postid :string, params :any){
    let url = this.url + '/' + postid
    return this.http.get(url, {params: params}).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<any>('Get post in post service'))
    )
  }

  private handleError<T>(operation = 'operation', result? :T){
    return (error :any) => {
      console.log(error)
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  private log(message :string){
    console.log(message)
  }
}
