import { Timestamp } from "@firebase/firestore";

export interface ChallengeInterface{
    uid: string,
    title: string,
    description: string,
    imageURI: string,
    entriesCounter: number,
    startDate: Timestamp,
    endDate: Timestamp,
    userID: string[],
    postID: string[]
}
