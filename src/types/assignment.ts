export interface Assignment {
  id: string;
  needId: string;
  volunteerId: string;
  status: "Assigned" | "On-Site" | "Completed" | "Cancelled";
  assignedAt: string;
  completedAt?: string;
  matchConfidence: number; // 0 to 1
}
