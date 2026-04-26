export interface CommunityNeed {
  id: string;
  title: string;
  category: "Medical" | "Food" | "Water" | "Shelter" | "Logistics" | "Rescue";
  peopleAffected: number;
  severityLevel: 1 | 2 | 3 | 4 | 5; // 1: Low, 5: Critical
  resourceScarcity: number; // 0 to 1
  hoursWaiting: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  urgencyScore: number;
  status: "Pending" | "In-Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
}
