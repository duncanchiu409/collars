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
  public message :string = ""

  constructor(public authService: AuthService) { 

  }

  ngOnInit(): void {
  }

  validate() :boolean{
    if(this.password !== this.confirmPassword){
      this.message='Mis-match password'
      return false
    }
    else{
      this.message=''
      return true
    }
  }

}
