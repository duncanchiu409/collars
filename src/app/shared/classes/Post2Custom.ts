import { Post } from './Post'
import { Reaction } from './Reactions'
import { User } from './User'
import { Dog } from './Dog'

export class Post2Custom{
    public post :Post;
    public reactions :Reaction[];
    public user :User;
    public userDog :Dog;

    constructor(){
        this.post = new Post();
        this.reactions = []
        this.user = new User();
        this.userDog = new Dog();
    }

    parse_full_object(object :any) :boolean{
        if(object.post === undefined){
            return false;
        }
        else{
            if(!this.post.parse_full_object(object.post)){
                return false;
            }
        }
        if(object.reactions === undefined){
            return false;
        }
        else{
            this.reactions = []
            object.reactions.forEach((reaction :any) => {
                let element = new Reaction()
                if(element.parse_full_object(reaction)){
                    this.reactions.push(element)
                }
                else{
                    console.error('Invalid parse Post2Custom in parse_full_object');
                }
            })
        }
        if(object.user === undefined){
            return false;
        }
        else{
            if(!this.user.parse_full_object(object.user)){
                return false;
            }
        }
        if(object.userDog === undefined){
            return false;
        }
        else{
            if(!this.userDog.parse_full_object(object.userDog)){
                return false;
            }
        }

        return true;
    }
}