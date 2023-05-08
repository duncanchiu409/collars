import { Component, OnInit } from '@angular/core';
import { Timestamp, addDoc, getFirestore, collection, DocumentReference } from '@firebase/firestore';
import { Challenge } from '../../shared/interfaces/challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { getStorage, ref, getDownloadURL } from '@firebase/storage'
import { uploadBytes } from '@angular/fire/storage'
import { setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  public challenges :Challenge[] = []
  public showingChallenges :Challenge[] = []
  public sortingLogic :string = ''

  public submitChallengeIdea :Challenge = {
    uid: "0",
    title: "Submit A Challenge Idea",
    description: "Fill out below about your awesome Collars challenge idea",
    imageURI: "https://dummyimage.com/250x250/000/fff",
    entriesCounter: 0,
    startDate: new Date(),
    endDate: new Date(),
    userID: [],
    postID: []
  }

  constructor(public challengeService :ChallengeService, private dialog :MatDialog) {}

  ngOnInit(): void {
    this.challengeService.getChallenges().subscribe(
      (challenges :Challenge[]) => {
        this.challenges = [... challenges]
        this.sortUpComing()
      }
    )
  }

  sortingButton(logic :string){
    if(logic === 'upcoming'){
      this.sortUpComing()
    }
    else if(logic === 'active'){
      this.sortActive()
    }
    else{
      console.log("Invalid sorting logic :')")
    }

    this.timeParser()
    debugger
    this.showingChallenges.push(this.submitChallengeIdea)
  }

  sortUpComing() :void{
    // if(this.sortingLogic === 'upcoming'){
    //   return
    // }

    this.sortingLogic = 'upcoming'
    this.showingChallenges = JSON.parse(JSON.stringify(this.challenges.filter((challenge :Challenge) => {
      if((new Date(challenge.startDate).getTime() - new Date().getTime()) >= 0){
        return true
      }
      else{
        return false
      }
    })))
  }

  sortActive() :void{
    // if(this.sortingLogic === 'active'){
    //   return
    // }

    this.sortingLogic = 'active'
    this.showingChallenges = JSON.parse(JSON.stringify(this.challenges.filter((challenge :any) => {
      let startDate :number = challenge.startDate._seconds
      let endDate :number = challenge.endDate._seconds

      if(!((startDate - new Date().getTime()/1000) >= 0) && (endDate - new Date().getTime()/1000) >= 0){
        return true
      }
      else{
        return false
      }
    })))
  }

  submitIdea() :Promise<void>{
    return this.challengeService.addChallenges(this.submitChallengeIdea).then(() => console.log("Submitted Challenge Idea"))
  }

  openDialog() :void{
    let config = new MatDialogConfig()
    this.dialog.open(SubmitIdea,{
      width: '400px',
      height: '600px'
    })
  }

  timeParser() :void {
    return this.showingChallenges.forEach((challenge :any) => {
      let startDate :Date = new Date(challenge.startDate._seconds)
      let endDate :Date = new Date(challenge.endDate._seconds)

      challenge.startDate = startDate
      challenge.endDate = endDate
    })
  }
}

@Component({
  selector: 'submit-idea',
  templateUrl: 'submitIdea.html'
})

export class SubmitIdea{
  public image :File | null = null
  public title :string = ''
  public description :string = ''

  constructor(public dialogRef: MatDialogRef<SubmitIdea>){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveImage(e :any) :void {
    if(e.target !== null){
      this.image = e.target.files[0]
    }
  }

  async onSubmit() :Promise<void> {
    let end7DaysFromNow :Date = new Date((new Date().valueOf() + 604800000))

    // 1. Add Challenge + Grab challenge ID
    let challengeRef = await addDoc(collection(getFirestore(),'challenges'),{
      uid: '',
      title: this.title,
      description: this.description,
      imageURI: '',
      entriesCounter: 0,
      startDate: new Date(),
      endDate: end7DaysFromNow,
      userID: [],
      postID: []
    })

    // 2. upload the image
    let filePath = `challenges/${challengeRef.id}`
    let fileRef = ref(getStorage(), filePath)
    if(this.image !== null){
      let fileSnapshot = await uploadBytes(fileRef, this.image, {
        contentType: this.image.type
      })
      console.log(fileSnapshot)
    }
    else{
      return
    }

    // 3. Put download URI & uid into Challenge
    let downloadURI = ''
    downloadURI = await getDownloadURL(fileRef)
    let snapshot = await setDoc(challengeRef,{uid: challengeRef.id, imageURI: downloadURI}, {merge: true})
    console.log(downloadURI)
  }
}
