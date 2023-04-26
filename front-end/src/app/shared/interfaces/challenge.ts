export interface Challenge{
    uid: string,
    title: string,
    description: string,
    imageURI: string,
    entriesCounter: number,
    timer: Date,
    userID: string[],
    postID: string[]
}