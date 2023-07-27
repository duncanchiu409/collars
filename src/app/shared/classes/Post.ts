import { CommentEndToken } from '@angular/compiler/src/ml_parser/tokens';
import { Comment } from '../classes/Comment'

interface PostInterface{
  title :string;
  uid :string;
  reactions :ReactionInterface[];
  patCounter :number;
  challengeID :string;
  imageURI :string;
  posterId :string;
  comments :Comment[];
  reactionsCounter :{[key :string]: string}
}

interface ReactionInterface{
  reactionID :string;
  userID :string;
}

export class Post {
  public title: string;
  public uid: string;
  public reactions: ReactionInterface[];
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
    if(object.challengeID !== undefined){
      this.challengeID = object.challengeID
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

  returnSimpleStruct(){
    let result :PostInterface = {
      title: this.title,
      uid: this.uid,
      reactions: this.reactions,
      patCounter: this.patCounter,
      challengeID: this.challengeID,
      imageURI: this.imageURI,
      posterId: this.posterID,
      comments: this.comments,
      reactionsCounter: this.reactionsCounter
    }
    return result;
  }
}
