import { Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/shared/interfaces/challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  public challenges :Challenge[] = []
  public showingChallenges :Challenge[] = []
  public sortingLogic :string = 'upcoming'

  public submitChallengeIdea :Challenge = {
    uid: "0",
    title: "Submit A Challenge Idea",
    description: "Fill out below about your awesome Collars challenge idea",
    imageURI: "https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/challenges%2Fdefault_challenge.png?alt=media&token=ddd879d4-80d6-4336-ab24-2c1e3b38dbb7",
    entriesCounter: 0,
    timer: new Date(),
    userID: [],
    postID: []
  }

  constructor(public challengeService :ChallengeService) {}

  ngOnInit(): void {
    this.challengeService.getChallenges().subscribe(
      (challenges :Challenge[]) => {
        this.challenges = [... challenges]
        this.sortUpComing()
      }
    )
  }

  sortUpComing() :void{
    this.sortingLogic = 'upcoming'
    this.showingChallenges = this.challenges.filter((challenge :Challenge) => {
      if((new Date(challenge.timer).getTime() - new Date().getTime()) >= 0){
        return true
      }
      else{
        return false
      }
    })
    this.challenges.push(this.submitChallengeIdea)
  }

  sortActive() :void{
    this.sortingLogic = 'active'
    this.showingChallenges = this.challenges.filter((challenge :Challenge) => {
      if(!((new Date(challenge.timer).getTime() - new Date().getTime()) >= 0)){
        return true
      }
      else{
        return false
      }
    })
    this.challenges.push(this.submitChallengeIdea)
  }

}
