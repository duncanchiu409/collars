import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap, map, concat, of } from 'rxjs'
import { DocumentSnapshot } from '@firebase/firestore';
import { Challenge } from 'src/app/shared/classes/Challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import { PostsService } from 'src/app/shared/shared/services/posts.service';
import { Post } from '../../shared/classes/Post'
import { HttpsCallable } from 'firebase/functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ReactionsService } from 'src/app/shared/services/reactions.service';
import { Reaction } from 'src/app/shared/classes/Reactions';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  public id :string;
  public challenge :Challenge;
  public posts :Post[];
  public emojiMap :Reaction[];
  public emojiURIArray :{[key: string]:string[]}
  public sortingLogic :string;
  public params :{[key: string]:string}
  public postsObject :any[];

  public dropDown = false;

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute, private postsService :PostsService, private angularFire :AngularFireAuth, private reactionService :ReactionsService, private authService :AuthService, public router :Router) {
    this.id = ''
    this.challenge = new Challenge()
    this.posts = []
    this.emojiMap = []
    this.sortingLogic = 'ALL'
    this.emojiURIArray = {}
    this.params = {sort: 'ALL', userAccessToken: ''}
    this.postsObject = []
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.route.params.subscribe((params) => {
        this.id = params['id']
      })
      this.renderPosts()
    },500)
  }

  getReactions(){
    this.reactionService.getReactions().subscribe(
      (reactions) => {
        reactions.forEach(
          (reaction :any) => {
            let obj = new Reaction()
            if(obj.createReactionFromObject(reaction)){
              obj.createReactionFromObject(reaction)
              this.emojiMap.push(obj)
            }
            else{
              throw Error('Crash')
            }})
        this.posts.forEach(
          (post) => {
            this.emojiURIArray[post.uid]=[]
            for(let key in post.reactionsCounter){
              let tmpDict = this.emojiMap.find((reaction)=>reaction.uid === key)
              if(tmpDict === undefined) throw Error
              else this.emojiURIArray[post.uid].push(tmpDict.imageURI)
            }})})
  }

  renderPosts(){
    // refresh token
    // getNewPostsService()
    //
    this.authService.refreshedIDToken().then((_) => {
      if(_ !== undefined){
        this.params['userAccessToken'] = _
        this.postsService.getPosts(this.id, this.params).subscribe((result) => {
          this.postsObject = []
          result.forEach(obj => this.postsObject.push(obj))
        })
      }
      else{
        console.log("Token is not present")
      }
    }).then(() => console.log(this.postsObject))
    // render in html
  }

  getChallenge(){
    this.challengeService.getChallenge(this.id).subscribe((challenge :any) => {
      this.challenge.parse_object(challenge)
    })
  }

  logout(){
    this.authService.SignOut()
  }

  returnChallenges(){
    this.router.navigate(['challenges'])
  }

  changeSortingLogic(logic :string){
    this.sortingLogic = logic
    this.params['sort'] = logic
    this.renderPosts()
  }

  dropDownMenu(){
    this.getChallenge()

    if(this.dropDown === false){
      this.dropDown = true
    }
    else{
      this.dropDown = false
    }
  }
}
