import { Timestamp } from "firebase/firestore";

export enum PriorityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface RegionPriorityScore {
  id?: string;
  regionName: string;
  latitude: number;
  longitude: number;
  totalNeeds: number;
  averageUrgencyScore: number;
  priorityLevel: PriorityLevel;
  lastUpdated: Timestamp;
}
