import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { tap } from 'rxjs';
import { Reaction } from '../classes/Reactions'

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  public url :string;

  constructor(private http :HttpClient) {
    this.url = environment.apiURL + '/reactions'
  }

  getReactions(){
    return this.http.get<Array<Reaction>>(this.url).pipe(
      tap(_ => console.log(_))
    )
  }
}
