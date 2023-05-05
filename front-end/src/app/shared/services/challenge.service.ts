import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Challenge } from '../interfaces/challenge';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challengeURI = 'http://127.0.0.1:5001/colal-ae06f/us-central1/collars/challenges'

  constructor(private http :HttpClient, private angularFirestore :AngularFirestore) {

  }

  getChallenges(){
    return this.http.get<Array<Challenge>>(this.challengeURI).pipe(
      catchError(this.handleError<Array<Challenge>>('GET Challenges'))
    )
  }

  addChallenges(challenge :Challenge){
    return this.angularFirestore.collection<Challenge>('challenges').add(challenge).catch(this.handleError('POST Challenge'))
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
