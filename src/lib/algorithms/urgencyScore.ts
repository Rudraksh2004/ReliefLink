import { CommunityNeed, CommunityNeedCategory } from "@/types/communityNeed";

/**
 * Calculates the urgency score for a community need based on weighted factors.
 * This simulates AI-assisted prioritization.
 */
export const calculateUrgencyScore = (need: Partial<CommunityNeed>): number => {
  let score = 0;

  // Factor 1: Category Priority Weight
  const categoryWeights: Record<string, number> = {
    [CommunityNeedCategory.MEDICAL]: 5,
    [CommunityNeedCategory.RESCUE]: 5,
    [CommunityNeedCategory.SHELTER]: 4,
    [CommunityNeedCategory.FOOD]: 3,
    [CommunityNeedCategory.LOGISTICS]: 2,
    [CommunityNeedCategory.OTHER]: 1,
  };

  const categoryWeight = categoryWeights[need.category || CommunityNeedCategory.OTHER] || 1;
  score += categoryWeight;

  // Factor 2: People Affected Weight
  const affected = need.peopleAffected || 0;
  if (affected > 100) {
    score += 5;
  } else if (affected > 50) {
    score += 4;
  } else if (affected > 20) {
    score += 3;
  } else if (affected > 5) {
    score += 2;
  } else if (affected >= 1) {
    score += 1;
  }

  // Factor 3: Base Emergency Multiplier
  if (
    need.category === CommunityNeedCategory.MEDICAL || 
    need.category === CommunityNeedCategory.RESCUE
  ) {
    score *= 1.5;
  }

  // Final Score: Rounded integer between 1 and 10
  const finalScore = Math.round(score);
  
  // Clamp between 1 and 10
  return Math.max(1, Math.min(10, finalScore));
};
