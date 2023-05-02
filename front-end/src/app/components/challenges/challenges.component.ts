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

  constructor(public challengeService :ChallengeService) {
    this.challenges = [...this.challengeService.challenges]
  }

  ngOnInit(): void {
    this.challenges = [...this.challengeService.challenges]
  }

  sortUpComing() :void{
    this.challenges = this.challengeService.challenges.filter((challenge :Challenge) => {
      if((new Date(challenge.timer).getTime() - new Date().getTime()) >= 0){
        return true
      }
      else{
        return false
      }
    })
  }

  sortActive() :void{
    this.challenges = this.challengeService.challenges.filter((challenge :Challenge) => {
      if(!((new Date(challenge.timer).getTime() - new Date().getTime()) >= 0)){
        return true
      }
      else{
        return false
      }
    })
  }
}
