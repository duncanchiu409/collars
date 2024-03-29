import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Challenge } from '../classes/Challenge';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private url :string;

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http :HttpClient, private angularFirestore :AngularFirestore) {
    this.url = environment.apiURL + '/challenges'
  }

  getChallenges(params :any){
    let url = this.url + '/custom'
    return this.http.get<Challenge[]>(url, {params: params}).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<Challenge[]>('GET CHALLENGE'))
    )
  }

  addChallenges(challenge :Challenge){
    let url = this.url + '/'
    return this.http.post(url, challenge, this.httpOptions).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError('POST ONE CHALLENGE'))
    )
  }

  getChallenge(challengeID :string){
    let url = this.url + '/' + challengeID
    return this.http.get(url, this.httpOptions).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<Challenge>('GET A CHALLENGE'))
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
