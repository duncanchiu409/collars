import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from 'src/app/shared/classes/Challenge';
import { ChallengeInterface } from 'src/app/shared/interfaces/challenge';
import { ChallengeService } from 'src/app/shared/services/challenge.service';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.css']
})
export class ChallengeDetailsComponent implements OnInit {
  public id :string;
  public challenge :Challenge;

  constructor(private challengeService :ChallengeService, private route :ActivatedRoute) {
    this.id = ''
    this.challenge = new Challenge()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params['id']){
        this.id = params['id']
      }
    })
    this.challengeService.getChallenge<Challenge>(this.id).subscribe((challenge) => {
      if(this.challenge !== undefined){
        let data = challenge.data()
        if(data !== undefined){
          this.challenge = data
        }
      }
    })
  }
}
