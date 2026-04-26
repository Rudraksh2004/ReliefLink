import { CommunityNeed } from "@/types/communityNeed";
import { Volunteer, VolunteerAvailability } from "@/types/volunteer";
import { getAllVolunteers } from "@/services/volunteerService";

/**
 * Calculates a matching score between a community need and a volunteer.
 */
const calculateMatchingScore = (need: CommunityNeed, volunteer: Volunteer): number => {
  let score = 0;

  // Factor 1: Skill Match (highest weight)
  // Check if any of the volunteer's skills match the need category
  if (volunteer.skills.includes(need.category.toLowerCase())) {
    score += 5;
  }

  // Factor 2: Availability Match
  if (volunteer.availability === VolunteerAvailability.ANYTIME) {
    score += 3;
  } else {
    score += 2;
  }

  // Factor 3: Distance Score (Proximity)
  // Simplified distance calculation for prototyping
  const latDiff = Math.abs(need.latitude - volunteer.latitude);
  const lngDiff = Math.abs(need.longitude - volunteer.longitude);
  // Approx distance in degrees to km: 1 degree ~ 111km
  const approxDistanceKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;

  if (approxDistanceKm < 5) {
    score += 5;
  } else if (approxDistanceKm < 15) {
    score += 3;
  } else if (approxDistanceKm < 30) {
    score += 1;
  }

  // Factor 4: Need Urgency Multiplier
  score += need.urgencyScore;

  return Math.round(score);
};

/**
 * Fetches all volunteers and finds the best match for a given community need.
 */
export const findBestVolunteer = async (need: CommunityNeed): Promise<{ volunteer: Volunteer; score: number } | null> => {
  const volunteers = await getAllVolunteers();
  
  if (volunteers.length === 0) return null;

  let bestMatch: { volunteer: Volunteer; score: number } | null = null;

  volunteers.forEach((volunteer) => {
    const score = calculateMatchingScore(need, volunteer);
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { volunteer, score };
    }
  });

  return bestMatch;
};
