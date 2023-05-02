import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Challenge } from '../interfaces/challenge';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challengeURI = 'http://127.0.0.1:5001/colal-ae06f/us-central1/collars/challenges'
  public challenges :Challenge[] = []

  constructor(private http :HttpClient) {
    this.getChallenges()
  }

  getChallenges() {
    return this.http.get(this.challengeURI).subscribe(res => {
      this.challenges = []
      let response = <Array<Challenge>> res
      response.forEach(challenge => this.challenges.push(challenge))
    })
  }

  addChallenges(){
    
  }
}
