import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Challenge } from '../../shared/interfaces/challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';

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
    imageURI: "https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/challenges%2Fdefault_challenge.png?alt=media&token=ddd879d4-80d6-4336-ab24-2c1e3b38dbb7",
    entriesCounter: 0,
    startDate: new Date(0),
    endDate: new Date(0),
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

  sortUpComing() :void{
    if(this.sortingLogic === 'upcoming'){
      return
    }

    this.sortingLogic = 'upcoming'
    this.showingChallenges = this.challenges.filter((challenge :Challenge) => {
      if((new Date(challenge.startDate).getTime() - new Date().getTime()) >= 0){
        return true
      }
      else{
        return false
      }
    })
    this.challenges.push(this.submitChallengeIdea)
  }

  sortActive() :void{
    if(this.sortingLogic === 'active'){
      return
    }

    this.sortingLogic = 'active'
    this.showingChallenges = this.challenges.filter((challenge :Challenge) => {
      if(!((new Date(challenge.startDate).getTime() - new Date().getTime()) >= 0) && (new Date(challenge.endDate).getTime() - new Date().getTime()) >= 0){
        return true
      }
      else{
        return false
      }
    })
    this.challenges.push(this.submitChallengeIdea)
  }

  submitIdea() :Promise<void>{
    return this.challengeService.addChallenges(this.submitChallengeIdea).then(() => console.log("Submitted Challenge Idea"))
  }

  openDialog() :void{
    let config = new MatDialogConfig()
    config.maxWidth = '400'
    this.dialog.open(SubmitIdea,config)
  }

}

@Component({
  selector: 'submit-idea',
  templateUrl: 'submitIdea.html'
})

export class SubmitIdea{
  constructor(){

  }
}
