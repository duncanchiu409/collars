import { Component, OnInit } from '@angular/core';
import { Timestamp, addDoc, getFirestore, collection, DocumentReference } from '@firebase/firestore';
import { ChallengeInterface } from '../../shared/interfaces/challenge';
import { Challenge } from '../../shared/classes/Challenge'
import { ChallengeService } from 'src/app/shared/services/challenge.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { getStorage, ref, getDownloadURL } from '@firebase/storage'
import { uploadBytes, uploadString } from '@angular/fire/storage'
import { setDoc } from '@firebase/firestore';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper'
import { NgxImageCompressService } from 'ngx-image-compress'
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  public showingChallenges :Challenge[] = []
  public sortingLogic :string = ''
  public userAccessToken :string = ''
  public submitIdeaChallenge :Challenge;

  constructor(public challengeService :ChallengeService, private dialog :MatDialog, private authService :AuthService, private router :Router) {
    this.sortingLogic = 'UPCOMING'
    this.submitIdeaChallenge = new Challenge()
    this.submitIdeaChallenge.get_sumbit_idea()
  }

  ngOnInit(): void {
    this.authService.refreshedIDToken().then(userAccessToken => {
      if(userAccessToken !== undefined){
        this.userAccessToken = userAccessToken
        this.renderChallenges(this.sortingLogic)
      }
      else{
        console.error('userAccessToken is not present')
        this.router.navigate(['welcome'])
      }
    })
  }

  sortingButton(logic :string){
    if(logic === 'UPCOMING'){
      this.renderChallenges('UPCOMING')
      this.sortingLogic = 'UPCOMING'
    }
    else if(logic === 'ACTIVE'){
      this.renderChallenges('ACTIVE')
      this.sortingLogic = 'ACTIVE'
    }
    else if(logic === 'COMPLETED'){
      this.renderChallenges('COMPLETED')
      this.sortingLogic = 'COMPLETED'
    }
    else{
      console.log("Invalid sorting logic :')")
    }
  }

  renderChallenges(sort :string){
    this.challengeService.getChallenges({sort: sort, userAccessToken: this.userAccessToken}).subscribe(resultChallenges => {
      this.showingChallenges = []
      resultChallenges.forEach(challenge => {
        let tmp = new Challenge()
        if(tmp.parse_full_object(challenge) === null){
          console.log('something wrong in parsing',challenge)
        }
        this.showingChallenges.push(tmp)
    })
  })}

  openDialog() :void{
    this.dialog.open(SubmitIdea,{
      width: '1000px',
      height: '600px'
    })
  }
}

@Component({
  selector: 'submit-idea',
  templateUrl: 'submitIdea.html',
  styleUrls: ['submitIdea.css']
})

export class SubmitIdea{
  public image :File | null = null
  public title :string = ''
  public description :string = ''

  imageChangedEvent :any = ''
  croppedImage :any = ''

  imgResultBeforeCompression: string = ''
  imgResultAfterCompression: string = ''

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event)
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

  constructor(public dialogRef: MatDialogRef<SubmitIdea>, private imageCompress: NgxImageCompressService){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveImage(e :any) :void {
    if(e.target !== null){
      this.image = e.target.files[0]
    }
  }

  compressImage() :void {
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      this.imgResultBeforeCompression = image;
      console.log('Size in bytes of the uploaded image was:', this.imageCompress.byteCount(image));

      this.imageCompress
      .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
      .then(compressedImage => {
        this.imgResultAfterCompression = compressedImage;
        console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
      });
    });
  }

  clickSubmitButton() :void {
    this.onSubmit().then(() => this.dialogRef.close())
  }

  async onSubmit() :Promise<void> {
    let end7DaysFromNow :Date = new Date((new Date().valueOf() + 604800000))

    // 1. Add Challenge + Grab challenge ID
    let challengeRef = await addDoc(collection(getFirestore(),'challenges'),{
      title: this.title,
      description: this.description,
      entriesCounter: 0,
      startDate: new Date(),
      endDate: end7DaysFromNow,
      userID: [],
      postID: []
    })

    // 2. upload the image
    let filePath = `challenges/${challengeRef.id}`
    let fileRef = ref(getStorage(), filePath)
    if(this.croppedImage !== null){
      try{
        await uploadString(fileRef, this.croppedImage, 'data_url');
      }
      catch(err){
        console.log(err)
      }
    }
    else{
      throw Error('POST Challenge failed: Failed to submit imageRef')
    }

    // 3. Put download URI & uid into Challenge
    let downloadURI = ''
    downloadURI = await getDownloadURL(fileRef)
    let snapshot = await setDoc(challengeRef,{uid: challengeRef.id, imageURI: downloadURI}, {merge: true})
    console.log(snapshot)
  }
}
