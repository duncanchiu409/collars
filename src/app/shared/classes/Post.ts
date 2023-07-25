import { Comment } from '../classes/Comment'

export class Post {
  public title: string;
  public uid: string;
  public reactions: number[];
  public patCounter: number;
  public challengeID: string;
  public imageURI: string;
  public posterID: string;
  public comments: Comment[];
  public reactionsCounter: {[key:string]: string}

  constructor(){
    this.title = ''
    this.reactions = []
    this.patCounter = 0
    this.challengeID = ''
    this.imageURI = ''
    this.posterID = ''
    this.comments = []
    this.uid = ''
    this.reactionsCounter = {}
  }

  parse_full_object(object :any) :boolean{
    if(object.title !== undefined){
      this.title = object.title
    }
    else{
      return false
    }
    if(object.reactions !== undefined){
      this.reactions = object.reactions
    }
    else{
      return false
    }
    if(object.patCounter !== undefined){
      this.patCounter = object.patCounter
    }
    else{
      return false
    }
    if(object.imageURI !== undefined){
      this.imageURI = object.imageURI
    }
    else{
      return false
    }
    if(object.posterID !== undefined){
      this.posterID = object.posterID
    }
    else{
      return false
    }
    if(object.comments !== undefined){
      this.comments = object.comments
    }
    else{
      return false
    }
    if(object.uid !== undefined){
      this.uid = object.uid
    }
    else{
      return false
    }
    if(object.reactionsCounter !== undefined){
      this.reactionsCounter = object.reactionsCounter
    }
    else{
      return false
    }
    return true
  }
}
