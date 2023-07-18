import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, switchMap, map, concat, of } from 'rxjs'
import { addDoc, DocumentSnapshot, getFirestore, collection, setDoc } from '@firebase/firestore';
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
import { MatDialog } from '@angular/material/dialog';
import { SubmitIdea } from '../challenges/challenges.component';
import { HttpClient } from '@angular/common/http';
import { DogService } from 'src/app/shared/services/dog.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

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

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute, private postsService :PostsService, private angularFire :AngularFireAuth, private reactionService :ReactionsService, private authService :AuthService, public router :Router, public dialog :MatDialog) {
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
      this.getChallenge()
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
  public image :File | null = null;
  public imageDataURL :any = '';
  public userAccessToken :string = ''
  public userDogInformation :any
  public postImageRef :any;
  public postRef :any;

  constructor(private dogService :DogService, private authService :AuthService, private reactionService :ReactionsService, @Inject(MAT_DIALOG_DATA) public data: {challengeID: string}){}

  ngOnInit() :void{
    this.authService.refreshedIDToken().then(
      userAccessToken => {
        if(userAccessToken !== undefined){
          this.userAccessToken = userAccessToken
        }
        else{
          throw Error;
        }
      }
    )

    setTimeout(() => {
      this.dogService.getDogInfo(this.userAccessToken).subscribe( result => {
        this.userDogInformation = result
      })
    }
    , 1000)
  }

  fileUpload(e :any){
    if(e.target.files[0] !== null){
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = () => {
        this.imageDataURL = reader.result
      }
    }
  }

  async sendPost(){
    const challenge = {
      challengeID: this.data.challengeID,
      comments: [],
      imageURI: '',
      patCounter: 0,
      posterID: this.authService.userData.uid,
      reactions: [],
      title: 'testing 1',
      uid: '',
    }

    try{
      this.postRef = await addDoc(collection(getFirestore(), 'posts'), challenge)

      let postImagePath = `posts/${this.postRef.id}`
      this.postImageRef = ref(getStorage(), postImagePath)

      if(this.imageDataURL !== null){
        try{
          await uploadString(this.postImageRef, this.imageDataURL, 'data_url');
        }
        catch(err){
          console.log(err)
        }
      }
      else{
        throw Error('POST post image failed: Failed to submit ImageRef')
      }


    }
    catch(err){
      console.log(err)
    }

    this.reactionService.getReactions().subscribe(async (reactionsObjects) => {
      let downloadURI = ''
      downloadURI = await getDownloadURL(this.postImageRef)

      const reactionsCounter :{[key :string] :Number} = {}
      reactionsObjects.forEach((reaction :any) => {
        reactionsCounter[reaction.uid] = 0;
      })

      let snapshot = await setDoc(this.postRef, {
        uid: this.postRef.id,
        imageURI: downloadURI,
        reactionsCounter: reactionsCounter,
      }, {merge: true})
    })
  }
}
