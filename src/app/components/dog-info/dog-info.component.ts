import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
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

  public cropped_profile_image :File | null
  public original_profile_image :File | null

  public cropped_image :string = 'https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/userprofile%2F5856.jpg?alt=media&token=f626ef7b-2458-47a6-82db-3dea63ac8f9a'

  constructor (public router :Router, private dogSevice :DogService, public dialog :MatDialog) {
    this.original_profile_image = null
    this.cropped_profile_image = null
  }

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

  openDialog() :void{
    const dialogRef = this.dialog.open(imageDialog, {
      width: '30%',
      data: {
        original: this.original_profile_image,
        cropped: this.cropped_profile_image
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result === ''){
        this.cropped_image = 'https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/userprofile%2F5856.jpg?alt=media&token=f626ef7b-2458-47a6-82db-3dea63ac8f9a'
      }
      else{
        this.cropped_image = result
      }
    })
  }
}

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.html',
  styleUrls: ['./image-dialog.css']
})
export class imageDialog{
  public original_profile_image :File | null;
  public cropped_profile_image :File | null;
  public image_dataURL = ''

  public imageChangedEvent :any = ''
  public cropped_image :any = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data :any, public dialogRef :MatDialogRef<imageDialog>){
    this.original_profile_image = data.original
    this.cropped_profile_image = data.cropped
  }

  fileChangeEvent(e :any){
    this.imageChangedEvent = e
  }

  imageCropped(e :ImageCroppedEvent){
    this.cropped_image = e.base64
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }


  fileUpload(e :any){
    this.original_profile_image = e.target.files[0]

    const reader = new FileReader()
    if(reader !== null){
      reader.onloadend = () => {
        this.image_dataURL = <string> reader.result
      }
    }
    if(this.original_profile_image !== null){
      reader.readAsDataURL(this.original_profile_image)
    }
    console.log(this.original_profile_image)
  }

  closeDialog(){
    this.dialogRef.close(this.cropped_image)
  }
}
