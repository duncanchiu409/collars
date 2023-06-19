import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { DogService } from 'src/app/shared/services/dog.service';
import { PassThrough } from 'stream';

@Component({
  selector: 'app-dog-info',
  templateUrl: './dog-info.component.html',
  styleUrls: ['./dog-info.component.css']
})
export class DogInfoComponent implements OnInit {
  public dogName :string = '';
  public dogNameStatus: boolean = false;
  public dogBreed :string = ''
  public dogBreedStatus :boolean = false;
  public dogTeritory :string = ''
  public dogTeritoryStatus :boolean = false;

  constructor (public router :Router, private dogSevice :DogService) { }

  ngOnInit(): void {
  }

  onDone(){
    if(this.dogNameStatus === false){
      if(this.dogName === ""){
        window.alert("Please input dog name")
      }
      else{
        this.dogNameStatus = true
      }
    }
    else if(this.dogBreedStatus === false){
      if(this.dogBreed === ""){
        window.alert("Please input dog breed")
      }else{
        this.dogBreedStatus = true
      }
    }
    else if(this.dogTeritoryStatus === false){
      if(this.dogTeritory === ""){
        window.alert("Please input dog teritory")
      }else{
        this.dogTeritoryStatus = true
      }
    }
    else{
      let user = localStorage.getItem('user')

      if(user === null){
        this.router.navigate(['/'])
      }
      else{
        this.addDog()
      }
    }
  }

  addDog(){
    let user = localStorage.getItem("user")

    if( user !== null ){
      let user_obj = JSON.parse(user)
      if( user !== null && user_obj.uid !== null ){
        let dog = {
          uid: "",
          dogName: this.dogName,
          dogBreed: this.dogBreed,
          dogTeritory: this.dogTeritory,
          dogImageURI: "",
          userId: user_obj.uid
        }
        this.dogSevice.addDogInfo(dog).subscribe()
        this.router.navigate(['challenges'])
      }
    }

    if(user == null){
      console.log("Unable to grab Sign-in User")
    }
    else{
      // dog.userId = JSON.parse(user).uid
      // this.router.navigate(["/challenges"])
    }
  }
}
