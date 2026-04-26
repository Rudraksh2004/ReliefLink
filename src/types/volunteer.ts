import { Timestamp } from "firebase/firestore";

export enum VolunteerAvailability {
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
  ANYTIME = "anytime",
}

export interface Volunteer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: VolunteerAvailability;
  latitude: number;
  longitude: number;
  assignedTaskIds: string[];
  createdAt: Timestamp;
}
