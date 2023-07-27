export class User{
    public dogId :string;
    public email :string;
    public followers :string[];
    public uid :string;
    public username :string;

    constructor(){
        this.dogId = '';
        this.email = '';
        this.followers = [];
        this.uid = '';
        this.username = '';
    }
    
    parse_full_object(object :any) :boolean{
        if(object.dogId === undefined){
            return false;
        }
        else{
            this.dogId = object.dogId;
        }
        if(object.email === undefined){
            return false;
        }
        else{
            this.email = object.email;
        }
        if(object.followers === undefined){
            return false;
        }
        else{
            this.followers = object.followers;
        }
        if(object.uid === undefined){
            return false;
        }
        else{
            this.uid = object.uid;
        }
        if(object.username === undefined){
            return false;
        }
        else{
            this.username = object.username;
        }
        return true;
    }
}