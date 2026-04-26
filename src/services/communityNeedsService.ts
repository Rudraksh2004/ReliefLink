import { 
  addDocument, 
  getDocument, 
  getCollection, 
  updateDocument 
} from "@/lib/firestore";
import { CommunityNeed } from "@/types/communityNeed";
import { serverTimestamp, QueryConstraint } from "firebase/firestore";

const COLLECTION = "community_needs";

export const createCommunityNeed = async (needData: Omit<CommunityNeed, "id" | "createdAt" | "updatedAt">) => {
  return await addDocument(COLLECTION, {
    ...needData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getCommunityNeedById = async (id: string) => {
  return await getDocument(COLLECTION, id) as CommunityNeed | null;
};

export const getAllCommunityNeeds = async (constraints: QueryConstraint[] = []) => {
  return await getCollection(COLLECTION, constraints) as CommunityNeed[];
};

export const updateCommunityNeed = async (id: string, data: Partial<CommunityNeed>) => {
  return await updateDocument(COLLECTION, id, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};
