import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

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

  constructor (public router :Router) { }

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
        console.log(this.dogName,this.dogBreed,this.dogTeritory)
      }
    }
  }
}
