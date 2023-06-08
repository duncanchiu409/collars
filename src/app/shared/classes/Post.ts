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

  createPostsfromPosts(post :any){
    if(post.title !== undefined){
      this.title = post.title
    }
    else{
      return false
    }
    if(post.reactions !== undefined){
      this.reactions = post.reactions
    }
    else{
      return false
    }
    if(post.patCounter !== undefined){
      this.patCounter = post.patCounter
    }
    else{
      return false
    }
    if(post.imageURI !== undefined){
      this.imageURI = post.imageURI
    }
    else{
      return false
    }
    if(post.posterID !== undefined){
      this.posterID = post.posterID
    }
    else{
      return false
    }
    if(post.comments !== undefined){
      this.comments = post.comments
    }
    else{
      return false
    }
    if(post.uid !== undefined){
      this.uid = post.uid
    }
    else{
      return false
    }
    if(post.reactionsCounter !== undefined){
      this.reactionsCounter = post.reactionsCounter
    }
    else{
      return false
    }
    return true
  }
}
