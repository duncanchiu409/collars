import { Component, OnInit } from '@angular/core';
import { Timestamp, addDoc, getFirestore, collection, DocumentReference } from '@firebase/firestore';
import { ChallengeInterface } from '../../shared/interfaces/challenge';
import { Challenge } from '../../shared/classes/Challenge'
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
  public submitIdeaChallenge :Challenge

  constructor(public challengeService :ChallengeService, private dialog :MatDialog) {
    this.submitIdeaChallenge = new Challenge()
    this.submitIdeaChallenge.get_sumbit_idea("submit_idea")
  }

  ngOnInit(): void {
    this.challengeService.getChallenges().subscribe(
      (challenges) => {
        this.challenges = [... challenges]
        this.sortingButton('upcoming')
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
    this.showingChallenges.push(this.submitIdeaChallenge)
  }

  sortUpComing() :void{
    // if(this.sortingLogic === 'upcoming'){
    //   return
    // }

    this.sortingLogic = 'upcoming'
    this.showingChallenges = JSON.parse(JSON.stringify(this.challenges.filter((challenge :Challenge) => {
      let startDate :number = challenge.startDate.seconds

      if((startDate - new Date().getTime()/1000) >= 0){
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
    this.showingChallenges = JSON.parse(JSON.stringify(this.challenges.filter((challenge :Challenge) => {
      let startDate :number = challenge.startDate.seconds
      let endDate :number = challenge.endDate.seconds

      if(!((startDate - new Date().getTime()/1000) >= 0) && (endDate - new Date().getTime()/1000) >= 0){
        return true
      }
      else{
        return false
      }
    })))
  }

  submitIdea() :Promise<void>{
    return this.challengeService.addChallenges(this.submitIdeaChallenge).then(() => console.log("Submitted Challenge Idea"))
  }

  openDialog() :void{
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
  templateUrl: 'submitIdea.html',
  styleUrls: ['submitIdea.css']
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

  clickSubmitButton() :void {
    this.onSubmit()
    this.dialogRef.close()
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
