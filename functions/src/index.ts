import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { distanceBetween } from "geofire-common";

admin.initializeApp();
const db = admin.firestore();

/**
 * 1) Firebase Cloud Function for Urgency Scoring
 * Trigger: When a community_need document is created.
 */
export const calculateUrgencyScoring = functions.firestore
  .document("community_needs/{needId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data) return null;

    // Inputs
    const severity = data.severity || 1; // 1-10 scale
    const peopleAffected = data.peopleAffected || 1;
    const resourceShortage = data.resourceShortage || 1; // 1-10 scale
    const deadlineUrgency = data.deadlineUrgency || 1; // 1-10 scale
    const locationPriority = data.locationPriority || 1; // 1-5 scale

    // Urgency Score Formula (Normalized to 0-100)
    // Weights: Severity (30%), People (20%), Shortage (20%), Deadline (20%), Location (10%)
    let score = (severity * 3);
    score += (Math.log10(Math.max(1, peopleAffected)) * 10);
    score += (resourceShortage * 2);
    score += (deadlineUrgency * 2);
    score += (locationPriority * 2);

    const urgency_score = Math.min(100, Math.round(score));

    // Determine Priority Level
    let priority_level = "Low";
    if (urgency_score >= 80) priority_level = "Critical";
    else if (urgency_score >= 60) priority_level = "High";
    else if (urgency_score >= 40) priority_level = "Medium";

    // Store back inside Firestore document
    return snapshot.ref.update({
      urgency_score,
      priority_level,
      status: "analyzed"
    });
  });

/**
 * 2) Firebase Cloud Function for Volunteer-Task Matching
 * Trigger: Can be called manually or triggered by a Task creation.
 * We'll set it to trigger when a task is created for a specific need.
 */
export const matchVolunteersToTask = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snapshot, context) => {
    const taskData = snapshot.data();
    const taskLocation = taskData.location; // Expected: { lat, lng }
    const requiredSkills = taskData.requiredSkills || [];
    const taskUrgency = taskData.taskUrgency || 50;

    // Fetch active volunteers (limit for performance)
    const volunteersSnapshot = await db.collection("volunteers")
      .where("isActive", "==", true)
      .limit(100)
      .get();

    const matches: any[] = [];

    volunteersSnapshot.forEach((doc) => {
      const vData = doc.data();
      const vLocation = vData.location;

      // 1. Distance (Using geofire-common)
      let distanceScore = 0;
      if (vLocation && taskLocation) {
        const distanceKm = distanceBetween(
          [vLocation.lat, vLocation.lng],
          [taskLocation.lat, taskLocation.lng]
        );
        // Normalize distance score (inverse - closer is better)
        distanceScore = Math.max(0, 100 - (distanceKm * 5)); 
      }

      // 2. Skill Overlap
      const vSkills = vData.skills || [];
      const overlaps = requiredSkills.filter((s: string) => vSkills.includes(s)).length;
      const skillScore = requiredSkills.length > 0 ? (overlaps / requiredSkills.length) * 100 : 100;

      // 3. Availability & Past Participation
      const availabilityScore = vData.isAvailable ? 100 : 0;
      const participationScore = vData.pastParticipationScore || 50;

      // Total Match Score (Weighted)
      // Skill (40%), Distance (30%), Urgency (10%), Availability (10%), Participation (10%)
      const match_score = Math.round(
        (skillScore * 0.4) + 
        (distanceScore * 0.3) + 
        (taskUrgency * 0.1) + 
        (availabilityScore * 0.1) + 
        (participationScore * 0.1)
      );

      matches.push({
        volunteer_id: doc.id,
        volunteer_name: vData.name || "Anonymous",
        match_score
      });
    });

    // Sort by match score and save top 3 to matches collection
    const topMatches = matches.sort((a, b) => b.match_score - a.match_score).slice(0, 3);

    const batch = db.batch();
    topMatches.forEach((m) => {
      const matchRef = db.collection("matches").doc();
      batch.set(matchRef, {
        task_id: context.params.taskId,
        volunteer_id: m.volunteer_id,
        match_score: m.match_score,
        status: "suggested",
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return batch.commit();
  });
