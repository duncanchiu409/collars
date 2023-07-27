export class Dog {
    public dogBreed :string;
    public dogCompressedImageURI :string;
    public dogImageURI :string;
    public dogName :string;
    public dogTeritory :string;
    public uid :string;
    public userId :string;

    constructor(){
        this.dogBreed = '';
        this.dogCompressedImageURI = '';
        this.dogImageURI = ''
        this.dogName = ''
        this.dogTeritory = ''
        this.uid = ''
        this.userId = ''
    }

    parse_full_object(object :any) :boolean{
        if(object.dogBreed === undefined){
            return false
        }
        else{
            this.dogBreed = object.dogBreed
        }
        if(object.dogCompressedImageURI === undefined){
            return false
        }
        else{
            this.dogCompressedImageURI = object.dogCompressedImageURI
        }
        if(object.dogImageURI === undefined){
            return false
        }
        else{
            this.dogImageURI = object.dogImageURI
        }
        if(object.dogName === undefined){
            return false
        }
        else{
            this.dogName = object.dogName
        }
        if(object.dogTeritory === undefined){
            return false
        }
        else{
            this.dogTeritory = object.dogTeritory
        }
        if(object.uid === undefined){
            return false
        }
        else{
            this.uid = object.uid
        }
        if(object.userId === undefined){
            return false
        }
        else{
            this.userId = object.userId
        }
        return true
    }
}