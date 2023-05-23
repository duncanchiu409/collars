import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, map, concat, of } from 'rxjs'
import { DocumentSnapshot } from '@firebase/firestore';
import { Challenge } from 'src/app/shared/classes/Challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import { PostsService } from 'src/app/shared/shared/services/posts.service';
import { Post } from '../../shared/classes/Post'

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  public id :string;
  public challenge :Challenge;
  public posts :Post[];

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute, private postsService :PostsService) {
    this.id = ''
    this.challenge = new Challenge()
    this.posts = []
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

  debugButton(){
    this.postsService.getPost('EwNWEPjCrXtoC8wetHGo').subscribe(
     _ => console.log(_)
    )
    debugger
  }

}
