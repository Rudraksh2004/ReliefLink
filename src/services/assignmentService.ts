import { addDocument, updateDocument } from "@/lib/firestore";
import { Assignment } from "@/types/assignment";

const COLLECTION = "assignments";

export const createAssignment = async (needId: string, volunteerId: string, confidence: number) => {
  return await addDocument(COLLECTION, {
    needId,
    volunteerId,
    status: "Assigned",
    matchConfidence: confidence,
    assignedAt: new Date().toISOString(),
  });
};

export const updateAssignmentStatus = async (id: string, status: Assignment["status"]) => {
  const updateData: any = { status };
  if (status === "Completed") {
    updateData.completedAt = new Date().toISOString();
  }
  return await updateDocument(COLLECTION, id, updateData);
};
