export interface Challenge{
    title: string,
    description: string,
    imageURI: string,
    entriesCounter: number,
    timer: Date,
    userID: string[],
    postID: string[]
}