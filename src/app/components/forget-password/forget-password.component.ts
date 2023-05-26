import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public errorMessage :string = ''
  public email :string = ''

  constructor(public authService :AuthService) {}

  ngOnInit(): void {
  }

  resetPassword(){
    if(this.email === ''){
      this.errorMessage = 'Please enter your email'
    }
    else{
      this.authService.ResetPassword(this.email).catch((err) => {
        console.log(err)
        this.errorMessage = 'Please enter a valid email'
      })
    }
  }

}
