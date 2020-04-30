import { Photo } from './photo';

export interface UserData {
    newUser: boolean;
    eulaAccepted: boolean;
    language?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    birthday?: string;
    gender?: string;
    nationality?: string;
    city?: string;
    profilePicture?: Photo;
    uuid?: string;
    timezone?: string;
    startDate?: string; // yyyy-MM-dd
    endDate?: string; // yyyy-MM-dd
}
