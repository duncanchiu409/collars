import { Comment } from './Comment'
import { Dog } from './Dog'

export class CommentCustom{
    public dog :Dog;
    public comment :Comment;

    constructor(){
        this.dog = new Dog();
        this.comment = new Comment();
    }

    parse_full_object(object :any) :boolean{
        if(object.dogInfo === undefined){
            return false;
        }
        else{
            let element = new Dog()
            if(element.parse_full_object(object.dogInfo)){
                this.dog = element
            }
            else{
                return false;
            }
        }
        if(object.comment === undefined){
            return false
        }
        else{
            let element = new Comment()
            if(element.parse_full_object(object.comment)){
                this.comment = element
            }
            else{
                return false
            }
        }
        return true
    }
}