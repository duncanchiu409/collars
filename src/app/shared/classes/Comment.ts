export class Comment{
  public commentID :string;
  public commentContext :string;

  constructor(){
    this.commentID = ''
    this.commentContext = ''
  }

  parse_full_object(object :any) :boolean{
    if(object.commentID === undefined || object.commentContext === null){
      return false;
    }
    else{
      this.commentID = object.commentID
    }
    if(object.commentContext === undefined || object.commetContext === null){
      return false;
    }
    else{
      this.commentContext = object.commentContext
    }
    return true
  }
}
