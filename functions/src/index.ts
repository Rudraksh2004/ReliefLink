import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { distanceBetween } from "geofire-common";

admin.initializeApp();
const db = admin.firestore();

// ----------------------------------------------------------------------------
// STEP 2: Needs Analytics Trigger
// ----------------------------------------------------------------------------
export const onNeedWriteAnalytics = functions.firestore
  .document("community_needs/{needId}")
  .onWrite(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const date = new Date().toISOString().split('T')[0];

    // References
    const dailyRef = db.collection("analytics_cache").doc(`daily_stats_${date}`);
    const distRef = db.collection("analytics_cache").doc("priority_distribution");
    
    // 1. Handle Creation
    if (!before && after) {
      const batch = db.batch();
      batch.set(dailyRef, {
        totalNeeds: admin.firestore.FieldValue.increment(1),
        totalUrgency: admin.firestore.FieldValue.increment(after.urgency_score || 0)
      }, { merge: true });

      if (after.priority_level) {
        batch.set(distRef, {
          [after.priority_level]: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
      }

      // Handle Region Aggregation for Heatmap
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

    // 2. Handle Deletion
    if (before && !after) {
       // Logic to decrement if needed (skipped for brevity unless requested)
       return null;
    }

    // 3. Handle Updates (Specifically priority changes)
    if (before && after && before.priority_level !== after.priority_level) {
      const batch = db.batch();
      if (before.priority_level) {
        batch.set(distRef, { [before.priority_level]: admin.firestore.FieldValue.increment(-1) }, { merge: true });
      }
      if (after.priority_level) {
        batch.set(distRef, { [after.priority_level]: admin.firestore.FieldValue.increment(1) }, { merge: true });
      }
      return batch.commit();
    }

    return null;
  });

// ----------------------------------------------------------------------------
// STEP 3: Volunteer Matching Analytics Trigger
// ----------------------------------------------------------------------------
export const onMatchCreatedAnalytics = functions.firestore
  .document("matches/{matchId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data || !data.volunteer_id) return null;

    const vMetricRef = db.collection("analytics_cache").doc(`volunteer_${data.volunteer_id}`);

    return vMetricRef.set({
      total_matches: admin.firestore.FieldValue.increment(1),
      last_match_score: data.match_score,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// ----------------------------------------------------------------------------
// STEP 4: Task Completion Metrics Trigger
// ----------------------------------------------------------------------------
export const onTaskCompletedAnalytics = functions.firestore
  .document("tasks/{taskId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== "completed" && after.status === "completed") {
      const date = new Date().toISOString().split('T')[0];
      const taskMetricRef = db.collection("analytics_cache").doc(`task_metrics_${date}`);

      // Calculate time taken if timestamps exist
      let completionTimeHrs = 0;
      if (after.createdAt && after.completedAt) {
        const start = after.createdAt.toDate().getTime();
        const end = after.completedAt.toDate().getTime();
        completionTimeHrs = (end - start) / (1000 * 60 * 60);
      }

      return taskMetricRef.set({
        completed_today: admin.firestore.FieldValue.increment(1),
        total_completion_time: admin.firestore.FieldValue.increment(completionTimeHrs),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    return null;
  });

// (Existing Logic for Scoring and Matching should remain or be merged)
// Implementation of AI Urgency (Triggered on create)
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
