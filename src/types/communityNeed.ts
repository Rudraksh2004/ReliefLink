import { Timestamp } from "firebase/firestore";

export enum CommunityNeedCategory {
  MEDICAL = "medical",
  FOOD = "food",
  SHELTER = "shelter",
  RESCUE = "rescue",
  LOGISTICS = "logistics",
  OTHER = "other",
}

export enum CommunityNeedStatus {
  PENDING = "pending",
  MATCHED = "matched",
  RESOLVED = "resolved",
}

export interface CommunityNeed {
  id?: string;
  title: string;
  description: string;
  category: CommunityNeedCategory;
  peopleAffected: number;
  locationName: string;
  latitude: number;
  longitude: number;
  urgencyScore: number;
  status: CommunityNeedStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
