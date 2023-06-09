import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { collection, doc, getFirestore, setDoc } from '@firebase/firestore';
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
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
  public compressed_image :string = ''

  constructor (public router :Router, private dogSevice :DogService, public dialog :MatDialog, private imageCompress: NgxImageCompressService) {
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

  async addDog(){
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
          userId: user_obj.uid,
          dogCompressedImageURI: ''
        }
        this.dogSevice.addDogInfo(dog).subscribe( async something => {
          let filePath = `userprofile/compressed/${something.uid}`
          let fileRef = ref(getStorage(), filePath)

          let compressedFileURL = ''
          let originalFileURL = ''

          let dogRef = doc(getFirestore(), 'dogs', something.uid)

          if(this.compressed_image !== ''){
            try{
              let fileSnapshot = await uploadString(fileRef, this.compressed_image, 'data_url').then((snapshot) => {
                console.log(snapshot.ref)
                getDownloadURL(snapshot.ref).then(async (result)=>{
                  console.log(result)
                  compressedFileURL = result
                  let snapshot = await setDoc(dogRef, {dogCompressedImageURI: compressedFileURL}, {merge: true})
                  console.log(snapshot)
                })
              })
            }
            catch(err){
              console.log(err)
            }
          }

          let originalfilePath = `userprofile/uncompressed/${something.uid}`
          let originalfileRef = ref(getStorage(), originalfilePath)

          if(this.cropped_image !== 'https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/userprofile%2F5856.jpg?alt=media&token=f626ef7b-2458-47a6-82db-3dea63ac8f9a'){
            try{
              let fileSnapshot = await uploadString(originalfileRef, this.cropped_image, 'data_url').then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async result => {
                  console.log(result)
                  originalFileURL = result
                  let snapshot = await setDoc(dogRef, {dogImageURI: originalFileURL}, {merge: true})
                  console.log(snapshot)
                })
              })
            }
            catch(err){
              console.log(err)
            }
          }

          // upload file to dog obj in firebase firestore
          let snapshot;
          debugger
          if( compressedFileURL !== '' && originalFileURL !== ''){
             snapshot = await setDoc(dogRef, {dogImageURI: originalFileURL, dogCompressedImageURI: compressedFileURL}, {merge: true})
             console.log(snapshot)
          }
        })

        // upload the image?
        //
        //
        //
        // put download url && uid into dog-info

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
      if(result === '' || result === undefined){
        this.cropped_image = 'https://firebasestorage.googleapis.com/v0/b/colal-ae06f.appspot.com/o/userprofile%2F5856.jpg?alt=media&token=f626ef7b-2458-47a6-82db-3dea63ac8f9a'
      }
      else{
        this.cropped_image = result

        this.imageCompress.compressFile(this.cropped_image, 1, 50, 50, 100, 100).then(result_image => {
          this.compressed_image = result_image
        })
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
      if(this.original_profile_image !== null){
        reader.readAsDataURL(this.original_profile_image)
      }
    }
    console.log(this.original_profile_image)
  }

  closeDialog(){
    this.dialogRef.close()
  }

  closeDoneDialog(){
    this.dialogRef.close(this.cropped_image)
  }
}
