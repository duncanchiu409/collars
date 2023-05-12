import { Timestamp } from '@firebase/firestore';
import { ChallengeInterface } from '../interfaces/challenge'

export class Challenge implements ChallengeInterface{
  public uid :string;
  public title :string;
  public description: string;
  public imageURI: string;
  public entriesCounter: number;
  public startDate: Timestamp;
  public endDate: Timestamp;
  public userID: string[];
  public postID: string[];

  constructor(){
    this.uid = ''
    this.title = ''
    this.description = ''
    this.imageURI = ''
    this.entriesCounter = 0
    this.startDate = new Timestamp(0,0)
    this.endDate = new Timestamp(0,0)
    this.userID = []
    this.postID = []
  }

  get_sumbit_idea(name :string){
    if(name === 'submit_idea'){
      this.uid = '0'
      this.title = 'Submit A Challenge Idea'
      this.description = 'Fill out below about your awesome Collars challenge idea'
      this.imageURI = 'https://dummyimage.com/250x250/000/fff'
    }
  }
}
