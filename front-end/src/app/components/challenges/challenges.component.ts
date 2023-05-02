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
  }

}
