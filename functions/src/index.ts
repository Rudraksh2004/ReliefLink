import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

// API Base URL (Change to your deployed FastAPI URL or use ngrok for local testing)
const AI_SERVICE_URL = "http://localhost:8000"; 

// ----------------------------------------------------------------------------
// 1. AI Auto-Assignment Triggers
// ----------------------------------------------------------------------------

export const triggerAutoAssignmentOnTask = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snapshot, context) => {
    const taskId = context.params.taskId;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/match-volunteer/${taskId}`);
      const bestMatches = response.data.best_matches || [];
      const batch = db.batch();
      bestMatches.forEach((match: any) => {
        const recRef = db.collection("recommendations").doc();
        batch.set(recRef, {
          task_id: taskId,
          volunteer_id: match.volunteer_id,
          match_score: match.match_score,
          semantic_score: match.semantic_score,
          distance_score: match.distance_km,
          explanation: match.explanation,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          type: "TASK_TO_VOLUNTEER"
        });
      });
      return batch.commit();
    } catch (error) {
      console.error("AI Service Error (Task Match):", error);
      return null;
    }
  });

export const triggerAutoAssignmentOnVolunteer = functions.firestore
  .document("volunteers/{volunteerId}")
  .onCreate(async (snapshot, context) => {
    const volunteerId = context.params.volunteerId;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/match-task/${volunteerId}`);
      const bestTasks = response.data.best_tasks || [];
      const batch = db.batch();
      bestTasks.forEach((task: any) => {
        const recRef = db.collection("recommendations").doc();
        batch.set(recRef, {
          task_id: task.task_id,
          volunteer_id: volunteerId,
          match_score: task.match_score,
          semantic_score: task.semantic_score,
          distance_score: task.distance_km,
          explanation: task.explanation,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          type: "VOLUNTEER_TO_TASK"
        });
      });
      return batch.commit();
    } catch (error) {
      console.error("AI Service Error (Volunteer Match):", error);
      return null;
    }
  });

// ----------------------------------------------------------------------------
// 2. Analytics Aggregation Triggers
// ----------------------------------------------------------------------------

export const onNeedWriteAnalytics = functions.firestore
  .document("community_needs/{needId}")
  .onWrite(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const date = new Date().toISOString().split('T')[0];
    const dailyRef = db.collection("analytics_cache").doc(`daily_stats_${date}`);
    const distRef = db.collection("analytics_cache").doc("priority_distribution");

    if (!before && after) {
      const batch = db.batch();
      batch.set(dailyRef, {
        totalNeeds: admin.firestore.FieldValue.increment(1),
        totalUrgency: admin.firestore.FieldValue.increment(after.urgency_score || 0)
      }, { merge: true });

      if (after.priority_level) {
        batch.set(distRef, { [after.priority_level]: admin.firestore.FieldValue.increment(1) }, { merge: true });
      }

      if (after.location && after.location.geohash) {
        const regionPrefix = after.location.geohash.substring(0, 5);
        const regionRef = db.collection("analytics_cache").doc(`region_${regionPrefix}`);
        batch.set(regionRef, {
          city_zone: after.city_zone || "Unknown",
          lat: after.location.lat,
          lng: after.location.lng,
          density: admin.firestore.FieldValue.increment(1),
          totalUrgency: admin.firestore.FieldValue.increment(after.urgency_score || 0),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
      return batch.commit();
    }

    if (before && after && before.priority_level !== after.priority_level) {
      const batch = db.batch();
      if (before.priority_level) batch.set(distRef, { [before.priority_level]: admin.firestore.FieldValue.increment(-1) }, { merge: true });
      if (after.priority_level) batch.set(distRef, { [after.priority_level]: admin.firestore.FieldValue.increment(1) }, { merge: true });
      return batch.commit();
    }
    return null;
  });

// ----------------------------------------------------------------------------
// 3. AI Urgency Scoring Trigger
// ----------------------------------------------------------------------------

export const calculateUrgencyScoring = functions.firestore
  .document("community_needs/{needId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data) return null;
    const score = Math.round((data.severity || 1) * 3 + Math.log10(data.peopleAffected || 1) * 10);
    const urgency_score = Math.min(100, score);
    let priority_level = "Low";
    if (urgency_score >= 80) priority_level = "Critical";
    else if (urgency_score >= 60) priority_level = "High";
    return snapshot.ref.update({ urgency_score, priority_level });
  });
