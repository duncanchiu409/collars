export class Reaction{
  public uid :string;
  public title :string;
  public imageURI :string;

  constructor(){
    this.uid = ''
    this.title = ''
    this.imageURI = ''
  }

  parse_full_object(object :any) :boolean{
    if(object.uid == undefined){
      return false
    }
    else{
      this.uid = object.uid
    }
    if(object.title == undefined){
      return false
    }
    else{
      this.title = object.title
    }
    if(object.emojiURI == undefined){
      return false
    }
    else{
      this.imageURI = object.emojiURI
    }
    return true
  }
}
