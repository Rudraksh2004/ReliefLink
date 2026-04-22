import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();

const AI_SERVICE_URL = "http://localhost:8000"; 

// ----------------------------------------------------------------------------
// 1. HEATMAP GENERATOR PIPELINE
// ----------------------------------------------------------------------------

export const updateRegionHeatmap = functions.firestore
  .document("community_needs/{needId}")
  .onWrite(async (change, context) => {
    const data = change.after.exists ? change.after.data() : null;
    if (!data || !data.location || !data.location.geohash) return null;

    const regionId = data.location.geohash.substring(0, 5); // ~5km zone
    const regionRef = db.collection("region_priority_scores").doc(regionId);

    return db.runTransaction(async (transaction) => {
      const regionDoc = await transaction.get(regionRef);
      const regionData = regionDoc.data() || {
        region_id: regionId,
        lat: data.location.lat,
        lng: data.location.lng,
        total_urgency: 0,
        task_density: 0,
        average_urgency_score: 0,
        future_priority_score: 0,
        heat_intensity_value: 0
      };

      // 1. Update Density & Totals
      const isNew = !change.before.exists;
      if (isNew) {
        regionData.task_density += 1;
        regionData.total_urgency += (data.urgency_score || 0);
      } else if (change.before.exists && change.after.exists) {
        // Handle Urgency Update
        const urgencyDiff = (data.urgency_score || 0) - (change.before.data()?.urgency_score || 0);
        regionData.total_urgency += urgencyDiff;
      }

      // 2. Average Urgency
      regionData.average_urgency_score = regionData.total_urgency / regionData.task_density;

      // 3. Get Demand Forecast (Optional/Hooked)
      // For performance, we fetch forecast only on major shifts or use a default
      try {
        if (regionData.task_density % 5 === 0) { // Every 5 reports
          const forecastRes = await axios.get(`${AI_SERVICE_URL}/forecast-demand/${regionId}`);
          regionData.future_priority_score = forecastRes.data.predicted_priority_score || 0;
        }
      } catch (e) { console.error("Forecast service unreachable"); }

      // 4. Calculate Intensity (Formula from Step 4)
      regionData.heat_intensity_value = 
        (0.5 * regionData.average_urgency_score) + 
        (0.3 * regionData.task_density) + 
        (0.2 * regionData.future_priority_score);

      regionData.last_updated = admin.firestore.FieldValue.serverTimestamp();

      transaction.set(regionRef, regionData, { merge: true });
    });
  });

// ----------------------------------------------------------------------------
// 2. OTHER AI TRIGGERS (Kept for completeness)
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
          explanation: match.explanation,
          type: "TASK_TO_VOLUNTEER",
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      return batch.commit();
    } catch (error) { return null; }
  });

export const calculateUrgencyScoring = functions.firestore
  .document("community_needs/{needId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data) return null;
    const score = Math.min(100, Math.round((data.severity || 1) * 3 + Math.log10(data.peopleAffected || 1) * 10));
    const priority = score >= 80 ? "Critical" : score >= 60 ? "High" : "Low";
    return snapshot.ref.update({ urgency_score: score, priority_level: priority });
  });
