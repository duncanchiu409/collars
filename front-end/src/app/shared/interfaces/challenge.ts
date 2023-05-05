import { Time } from "@angular/common";
import { Timestamp } from "firebase/firestore";

export interface Challenge{
    uid: string,
    title: string,
    description: string,
    imageURI: string,
    entriesCounter: number,
    startDate: Date,
    endDate: Date,
    userID: string[],
    postID: string[]
}