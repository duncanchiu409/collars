import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { DogInfo } from '../interfaces/dogInfo'

import { Observable, throwError, of, map } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private dogURI = 'http://127.0.0.1:5001/colal-ae06f/us-central1/collars/doginfo'
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http :HttpClient, private authService :AuthService){}

  getDogInfo(userAccessToken :string){
    const httpParams = {'userAccessToken': userAccessToken}

    return this.http.get(this.dogURI, {params: httpParams}).pipe(
      tap(userDogInformation => console.log(userDogInformation)),
      catchError(this.handleError("Get dog information"))
    )
  }

  addDogInfo(dog :DogInfo) :Observable<DogInfo>{
    return this.http.post<DogInfo>(this.dogURI, dog, this.httpOptions).pipe(
      tap((newDog :DogInfo) => console.log(newDog)),
      catchError(this.handleError<DogInfo>("addDogInfo()"))
    )
  }

  private handleError<T>(operation = 'operation', result? :T){
    return (error :any) :Observable<T> => {
      console.log(error)
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  private log(message :string){
    console.log(`DogService: ${message}`)
  }
}
