import { 
  addDocument, 
  getDocument, 
  getCollection, 
  updateDocument 
} from "@/lib/firestore";
import { RegionPriorityScore, PriorityLevel } from "@/types/regionPriorityScore";
import { CommunityNeed } from "@/types/communityNeed";
import { getAllCommunityNeeds } from "./communityNeedsService";
import { serverTimestamp, QueryConstraint, where, query, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

export const updateRegionPriorityScoreDoc = async (id: string, data: Partial<RegionPriorityScore>) => {
  return await updateDocument(COLLECTION, id, {
    ...data,
    lastUpdated: serverTimestamp(),
  });
};

/**
 * Aggregates needs for a region and updates the priority score document.
 */
export const updateRegionPriorityScore = async (regionName: string, mlPriorityLevel?: PriorityLevel) => {
  try {
    // 1. Fetch all needs for this region
    const needs = await getAllCommunityNeeds([where("locationName", "==", regionName)]);
    
    if (needs.length === 0) return;

    const totalNeeds = needs.length;
    const averageUrgencyScore = needs.reduce((sum, n) => sum + (n.urgencyScore || 0), 0) / totalNeeds;

    // 2. Determine priority level (ML override or Rule-based)
    let priorityLevel = mlPriorityLevel || PriorityLevel.LOW;
    
    if (!mlPriorityLevel) {
      if (averageUrgencyScore >= 9) priorityLevel = PriorityLevel.CRITICAL;
      else if (averageUrgencyScore >= 7) priorityLevel = PriorityLevel.HIGH;
      else if (averageUrgencyScore >= 4) priorityLevel = PriorityLevel.MEDIUM;
    }

    // 3. Find if region doc exists
    const regionQuery = query(collection(db, COLLECTION), where("regionName", "==", regionName));
    const querySnapshot = await getDocs(regionQuery);
    
    const updateData = {
      totalNeeds,
      averageUrgencyScore,
      priorityLevel,
      lastUpdated: serverTimestamp() as any,
    };

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDocument(COLLECTION, docId, updateData);
    } else {
      // Create new if doesn't exist (using coordinates from first need)
      await addDocument(COLLECTION, {
        regionName,
        latitude: needs[0].latitude,
        longitude: needs[0].longitude,
        ...updateData
      });
    }

    console.log("Region priority pipeline working");
  } catch (err) {
    console.error("Error in region priority pipeline:", err);
  }
};
