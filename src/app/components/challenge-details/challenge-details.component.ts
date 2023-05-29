import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, map, concat, of } from 'rxjs'
import { DocumentSnapshot } from '@firebase/firestore';
import { Challenge } from 'src/app/shared/classes/Challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import { PostsService } from 'src/app/shared/shared/services/posts.service';
import { Post } from '../../shared/classes/Post'
import { HttpsCallable } from 'firebase/functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  public id :string;
  public challenge :Challenge;
  public posts :Post[];
  public emojiDict :{[key: string]: string}

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute, private postsService :PostsService, private angularFire :AngularFireAuth) {
    this.id = ''
    this.challenge = new Challenge()
    this.posts = []
    this.emojiDict = {}
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map( params => {
        this.id = params['id']
        return this.id
      }),
      switchMap( id => this.postsService.getPosts(id) ),
      tap( posts => posts.forEach((post) => {
        let obj = new Post()
        if(obj.createPostsfromPosts(post)){
          this.posts.push(obj)
        }
        else{
          console.log(post)
        }
      }))).subscribe( _ => console.log("Done? ngOnInit"))
      this.
  }

  getChallengeID(){
    this.route.params.subscribe((params) => {
      if(params['id']){
        this.id = params['id']
      }
    })
 }

  getChallenge(){
    this.challengeService.getChallenge(this.id).subscribe((challenge :any) => {
      this.challenge.parse_object(challenge)
    })
  }

  getPosts(){
    debugger
    let postsID :string[] = this.challenge.postID
    postsID.forEach(
      postID => this.postsService.getPost(postID).subscribe(
        _ => console.log(_)
      )
    )
  }

  sendToken(){
    let token = localStorage.getItem('user')
    if(token !== null){
      let idToken = JSON.parse(token)
      let params = {'idToken': idToken.stsTokenManager.accessToken }
      this.postsService.sendUserToken(params).subscribe(_ => console.log(_))
    }
    else{
      throw Error("Token is not present in Browser")
    }
  }

  debugButton(){
    this.sendToken()
  }

}
