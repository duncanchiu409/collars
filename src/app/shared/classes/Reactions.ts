export class Reaction{
  public uid :string;
  public title :string;
  public imageURI :string;

  constructor(){
    this.uid = ''
    this.title = ''
    this.imageURI = ''
  }

  createReactionFromObject(obj :any){
    if(obj.uid == undefined){
      return false
    }
    else{
      this.uid = obj.uid
    }
    if(obj.title == undefined){
      return false
    }
    else{
      this.title = obj.title
    }
    if(obj.emojiURI == undefined){
      return false
    }
    else{
      this.imageURI = obj.emojiURI
    }
    return true
  }
}
