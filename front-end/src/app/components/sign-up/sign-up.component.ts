import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public password :string = ""
  public confirmPassword :string = ""
  public validation :boolean = false

  constructor(public authService: AuthService) { 

  }

  ngOnInit(): void {
  }

  validate() :boolean{
    if(this.password !== this.confirmPassword){
      return false
    }
    else{
      return true
    }
  }

}
