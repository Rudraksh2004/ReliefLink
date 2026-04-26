import { Timestamp } from "firebase/firestore";

export enum AssignmentStatus {
  ASSIGNED = "assigned",
  ACCEPTED = "accepted",
  COMPLETED = "completed",
}

export interface Assignment {
  id?: string;
  needId: string;
  volunteerId: string;
  assignmentScore: number;
  status: AssignmentStatus;
  createdAt: Timestamp;
}
