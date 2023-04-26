import { Component, OnInit } from '@angular/core';
import { ChallengeService } from 'src/app/shared/services/challenge.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  constructor(public challengeService :ChallengeService) { }

  ngOnInit(): void {

  }
}
