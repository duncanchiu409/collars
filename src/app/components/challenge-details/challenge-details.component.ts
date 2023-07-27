import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap, map, concat, of, forkJoin } from 'rxjs'
import { addDoc, DocumentSnapshot, getFirestore, collection, setDoc } from '@firebase/firestore';
import { Challenge } from 'src/app/shared/classes/Challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import { PostsService } from 'src/app/shared/services/posts.service';
import { Post } from '../../shared/classes/Post'
import { HttpsCallable } from 'firebase/functions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ReactionsService } from 'src/app/shared/services/reactions.service';
import { Reaction } from 'src/app/shared/classes/Reactions';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SubmitIdea } from '../challenges/challenges.component';
import { HttpClient } from '@angular/common/http';
import { DogService } from 'src/app/shared/services/dog.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { PostCustom } from '../../shared/classes/PostCustom'
import { Dog } from '../../shared/classes/Dog'

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  public id :string;
  public challenge :Challenge;
  public emojiMap :Reaction[];
  public emojiURIArray :{[key: string]:string[]}
  public sortingLogic :string;
  public params :{[key: string]:string}
  public postsObject :PostCustom[];

  public dropDown = false;

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute, private postsService :PostsService, private angularFire :AngularFireAuth, private reactionService :ReactionsService, private authService :AuthService, public router :Router, public dialog :MatDialog) {
    this.id = ''
    this.challenge = new Challenge()
    this.emojiMap = []
    this.sortingLogic = 'ALL'
    this.emojiURIArray = {}
    this.params = {sort: 'ALL', userAccessToken: ''}
    this.postsObject = []
  }

  ngOnInit(): void {
    this.authService.refreshedIDToken().then(userAccessToken => {
      if(userAccessToken !== undefined){
        this.params['userAccessToken'] = userAccessToken;
        this.route.params.pipe(
          tap(params => {
            this.id = params['id']
          }),
          switchMap(params => {
            return forkJoin(
              this.challengeService.getChallenge(this.id),
              this.postsService.getPosts(this.id, this.params)
            )
          })
        ).subscribe(([challenge, posts]) => {
          this.challenge = new Challenge()
          if(!this.challenge.parse_full_object(challenge)){
            console.error('Invalid parse Challenge in ngOnInit')
          }
    
          posts.forEach( post => {
            let element = new PostCustom()
            if(element.parse_full_object(post)){
              this.postsObject.push(element)
            }
            else{
              console.error('Invalid parse PostCustom in ngOnInit')
            }
          })
          this.getReactions()
        })
      }
      else{
        console.error('Missing userAccessToken')
        this.router.navigate(['welcome'])
      }
    })
  }

  getReactions(){
    this.reactionService.getReactions().subscribe(
      (reactions) => {
        reactions.forEach(
          (reaction :any) => {
            let obj = new Reaction()
            if(obj.parse_full_object(reaction)){
              this.emojiMap.push(obj)
            }
            else{
              console.error('Invalid parse Reaction in getReactions')
            }})
        this.postsObject.forEach(
          (object) => {
            const post = object.post
            this.emojiURIArray[post.uid]=[]
            for(let key in post.reactionsCounter){
              let tmpDict = this.emojiMap.find((reaction)=>reaction.uid === key)
              if(tmpDict === undefined) console.error('Mismatch Reaction in getReactions')
              else this.emojiURIArray[post.uid].push(tmpDict.imageURI)
            }})})
  }

  renderPosts(){
    this.postsService.getPosts(this.id, this.params).subscribe(result => {
      this.postsObject = []
      result.forEach(object => {
        const element = new PostCustom()
        if(element.parse_full_object(object)){
          this.postsObject.push(element)
        }
        else{
          console.error('Invalid parse PostCustom in renderPosts')
        }
      })
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
    this.challengeService.getChallenge(this.id).subscribe((challenge) => {
      if(!this.challenge.parse_full_object(challenge)){
        console.error('Invalid parse Challenge in dropDownMenu')
      }
    })

    if(this.dropDown === false){
      this.dropDown = true
    }
    else{
      this.dropDown = false
    }
  }

  enterChallenge(){
    this.dialog.open(SubmitChallenge, {
      height: '80vh',
      data: {challengeID: this.challenge.uid}
    })
  }
}

@Component({
  selector: 'submit-challenge',
  templateUrl: 'submitChallenge.html',
  styleUrls: ['submitChallenge.css']
})

export class SubmitChallenge{
  public imageDataURL :string = '';
  public userAccessToken :string = ''
  public userDogInformation :Dog;
  public postImageRef :any;
  public postRef :any;
  public postCaption :string = '';

  constructor(private dogService :DogService, private authService :AuthService, private reactionService :ReactionsService, private postsService :PostsService, @Inject(MAT_DIALOG_DATA) public data: {challengeID: string}){
    this.userDogInformation = new Dog()
  }

  ngOnInit() :void{
    this.authService.refreshedIDToken().then( userAccessToken => {
        if(userAccessToken !== undefined){
          this.userAccessToken = userAccessToken
          this.dogService.getDogInfo(this.userAccessToken).subscribe(result => {
            let element = new Dog()
            element.parse_full_object(result)
            this.userDogInformation = element})
        }
        else{
          throw Error;
        }
      }
    )
  }

  fileUpload(e :any){
    if(e.target.files[0] !== null){
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
        if(typeof reader.result === 'string'){
          this.imageDataURL = reader.result
        }
      }
    }
  }

  async sendPost(){
    const post = new Post()
    post.challengeID = this.data.challengeID;
    post.posterID = this.authService.userData.id;
    post.title = this.postCaption;

    if(this.userAccessToken !== ''){
      this.postsService.addPost(this.userAccessToken, post).pipe(
        tap(_ => console.log(_))
      ).subscribe()
    }
  }

  changeTextArea(e :any){
    if(e.target?.value !== undefined || e.target?.value !== null || e.target?.value !== ''){
      this.postCaption = e.target?.value
    }
  }
}
