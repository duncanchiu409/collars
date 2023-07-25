export class Challenge {
  public uid :string;
  public title :string;
  public description: string;
  public imageURI: string;
  public entriesCounter: number;
  public startDate: number;
  public endDate: number;
  public userID: string[];
  public postID: string[];

  constructor(){
    this.uid = ''
    this.title = ''
    this.description = ''
    this.imageURI = ''
    this.entriesCounter = 0
    this.startDate = 0
    this.endDate = 0
    this.userID = []
    this.postID = []
  }

  get_sumbit_idea() :void{
    this.uid = '0'
    this.title = 'Submit A Challenge Idea'
    this.description = 'Fill out below about your awesome Collars challenge idea'
    this.imageURI = 'https://dummyimage.com/250x250/000/fff'
    this.entriesCounter = 0
    this.startDate = 0
    this.endDate = 0
    this.userID = []
    this.postID = []
  }

  parse_full_object(challenge :any) :boolean {
    if(challenge.uid == undefined){
      return false;
    }else{
      this.uid = challenge.uid
    }
    if(challenge.title == undefined){
      return false;
    }
    else{
      this.title = challenge.title
    }
    if(challenge.description == undefined){
      return false;
    }
    else{
      this.description = challenge.description
    }
    if(challenge.imageURI == undefined){
      return false;
    }
    else{
      this.imageURI = challenge.imageURI
    }
    if(challenge.entriesCounter == undefined){
      return false;
    }
    else{
      this.entriesCounter = challenge.entriesCounter
    }
    if(challenge.startDate == undefined){
      return false;
    }
    else{
      this.startDate = challenge.startDate._seconds
    }
    if(challenge.endDate == undefined){
      return false;
    }
    else{
      this.endDate = challenge.endDate._seconds
    }
    if(challenge.userID == undefined){
      return false;
    }
    else{
      this.userID = challenge.userID
    }
    if(challenge.postID == undefined){
      return false;
    }
    else{
      this.postID = challenge.postID
    }
    return true
  }
}
