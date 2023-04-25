export interface Challenge{
    title: string,
    descripton: string,
    imageURI: string,
    entriesCounter: number,
    timer: Date,
    userID: string[],
    postID: string[]
}