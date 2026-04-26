const ML_BASE_URL = "http://localhost:8000";

export const predictCategory = async (description: string): Promise<string | null> => {
  try {
    const response = await fetch(`${ML_BASE_URL}/predict-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.predictedCategory;
  } catch (err) {
    console.error("ML Category Prediction Failed, using fallback.");
    return null;
  }
};

export const predictUrgency = async (
  description: string, 
  peopleAffected: number, 
  category: string
): Promise<number | null> => {
  try {
    const response = await fetch(`${ML_BASE_URL}/predict-urgency`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, peopleAffected, category }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.urgencyScore;
  } catch (err) {
    console.error("ML Urgency Prediction Failed, using fallback.");
    return null;
  }
};

export const predictMatch = async (
  needCategory: string,
  urgencyScore: number,
  volunteerSkills: string[],
  availability: string,
  distanceKm: number
): Promise<number | null> => {
  try {
    const response = await fetch(`${ML_BASE_URL}/predict-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needCategory,
        urgencyScore,
        volunteerSkills: volunteerSkills.join(", "),
        availability,
        distanceKm
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.matchProbability;
  } catch (err) {
    console.error("ML Match Prediction Failed, using fallback.");
    return null;
  }
};

export const predictRegionPriority = async (
  latitude: number,
  longitude: number,
  urgencyScore: number,
  totalNeeds: number
): Promise<string | null> => {
  try {
    const response = await fetch(`${ML_BASE_URL}/predict-region-priority`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude, longitude, urgencyScore, totalNeeds }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.priorityLevel;
  } catch (err) {
    console.error("ML Region Priority Prediction Failed, using fallback.");
    return null;
  }
};
