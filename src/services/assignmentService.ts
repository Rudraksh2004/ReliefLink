import { 
  addDocument, 
  getDocument, 
  getCollection, 
  updateDocument 
} from "@/lib/firestore";
import { Assignment } from "@/types/assignment";
import { serverTimestamp, QueryConstraint } from "firebase/firestore";

const COLLECTION = "assignments";

export const createAssignment = async (assignmentData: Omit<Assignment, "id" | "createdAt">) => {
  return await addDocument(COLLECTION, {
    ...assignmentData,
    createdAt: serverTimestamp(),
  });
};

export const getAssignmentById = async (id: string) => {
  return await getDocument(COLLECTION, id) as Assignment | null;
};

export const getAllAssignments = async (constraints: QueryConstraint[] = []) => {
  return await getCollection(COLLECTION, constraints) as Assignment[];
};

export const updateAssignment = async (id: string, data: Partial<Assignment>) => {
  return await updateDocument(COLLECTION, id, data);
};
