import { 
  addDocument, 
  getDocument, 
  getCollection, 
  updateDocument 
} from "@/lib/firestore";
import { RegionPriorityScore } from "@/types/regionPriorityScore";
import { serverTimestamp, QueryConstraint } from "firebase/firestore";

const COLLECTION = "region_priority_scores";

export const createRegionPriorityScore = async (data: Omit<RegionPriorityScore, "id" | "lastUpdated">) => {
  return await addDocument(COLLECTION, {
    ...data,
    lastUpdated: serverTimestamp(),
  });
};

export const getRegionPriorityScoreById = async (id: string) => {
  return await getDocument(COLLECTION, id) as RegionPriorityScore | null;
};

export const getAllRegionPriorityScores = async (constraints: QueryConstraint[] = []) => {
  return await getCollection(COLLECTION, constraints) as RegionPriorityScore[];
};

export const updateRegionPriorityScore = async (id: string, data: Partial<RegionPriorityScore>) => {
  return await updateDocument(COLLECTION, id, {
    ...data,
    lastUpdated: serverTimestamp(),
  });
};
