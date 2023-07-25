import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private url = environment.apiURL + '/comments'

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor( private http :HttpClient ) { }

  getComments(postid :string){
    let url = this.url + '/' + postid
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<any>('Get comment in Comment Service'))
    )
  }

  getLimitedComments(postid :string, params :any){
    let url = this.url + '/custom/' + postid

    return this.http.get<any>(url, {params: params}).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<any>('Get limited comment in Comment service'))
    )
  }

  addComments(body :any){
    let url = this.url + '/'
    return this.http.post<any>(url, body, this.httpOptions).pipe(
      tap(_ => console.log(_))
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
