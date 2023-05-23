import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Challenge } from '../classes/Challenge';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private url :string;

  constructor(private http :HttpClient, private angularFirestore :AngularFirestore) {
    this.url = environment.apiURL + '/challenges'
  }

  getChallenges(){
    return this.http.get(this.url)
  }

  addChallenges(challenge :Challenge){
    return this.angularFirestore.collection<Challenge>('challenges').add(challenge).catch(this.handleError('POST Challenge'))
  }

  getChallenge(challengeID :string){
    let url = this.url + '/' + challengeID
    return this.http.get(url).pipe(
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
