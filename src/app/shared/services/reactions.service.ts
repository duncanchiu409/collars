import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { catchError, tap, of } from 'rxjs';
import { Reaction } from '../classes/Reactions'

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  public url :string;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http :HttpClient) {
    this.url = environment.apiURL + '/reactions'
  }

  getReactions(){
    return this.http.get<Array<Reaction>>(this.url).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<any>('Get reaction in reaction service'))
    )
  }

  reactEmoji(body :any){
    let url = this.url + '/'
    return this.http.post(url, body, this.httpOptions).pipe(
      tap(_ => console.log(_)),
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
