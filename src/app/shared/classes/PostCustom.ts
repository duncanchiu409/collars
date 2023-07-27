import { Post } from './Post'
import { Dog } from './Dog'
import { Reaction } from './Reactions'

export class PostCustom{
    public post :Post;
    public dog :Dog;
    public reactions :Reaction[];

    constructor(){
        this.post = new Post();
        this.dog = new Dog();
        this.reactions = [];
    }

    parse_full_object(object :any) :boolean{
        const {post, reactions_info, dog_info} = object

        if(post === undefined){
            return false
        }
        if(reactions_info === undefined){
            return false
        }
        if(dog_info === undefined){
            return false
        }

        if(!this.post.parse_full_object(post)){
            return false;
        }
        if(!this.dog.parse_full_object(dog_info)){
            return false;
        }
        
        object.reactions_info.forEach((reaction :any) => {
            const element = new Reaction()
            if(element.parse_full_object(reaction)){
                this.reactions.push(element)
            }
            else{
                console.error('Invalid parse PostCustom in parse_full_object')
            }
        })

        return true
    }
}