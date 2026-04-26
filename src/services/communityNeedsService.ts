import { addDocument, updateDocument, getCollection } from "@/lib/firestore";
import { CommunityNeed } from "@/types/communityNeed";
import { calculateUrgencyScore } from "@/lib/algorithms/urgencyScore";

const COLLECTION = "community_needs";

export const createCommunityNeed = async (needData: Omit<CommunityNeed, "id" | "urgencyScore" | "createdAt" | "updatedAt">) => {
  const urgencyScore = calculateUrgencyScore(needData);
  return await addDocument(COLLECTION, {
    ...needData,
    urgencyScore,
    status: "Pending",
  });
};

export const fetchAllNeeds = async () => {
  return await getCollection(COLLECTION) as CommunityNeed[];
};

export const updateNeedStatus = async (id: string, status: CommunityNeed["status"]) => {
  return await updateDocument(COLLECTION, id, { status });
};
