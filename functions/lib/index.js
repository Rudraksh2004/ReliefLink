"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateUrgencyScoring = exports.triggerAutoAssignmentOnTask = exports.updateRegionHeatmap = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
const db = admin.firestore();
const AI_SERVICE_URL = "http://localhost:8000";
// ----------------------------------------------------------------------------
// 1. HEATMAP GENERATOR PIPELINE
// ----------------------------------------------------------------------------
exports.updateRegionHeatmap = functions.firestore
    .document("community_needs/{needId}")
    .onWrite(async (change, context) => {
    const data = change.after.exists ? change.after.data() : null;
    if (!data || !data.location || !data.location.geohash)
        return null;
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
        }
        else if (change.before.exists && change.after.exists) {
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
                const forecastRes = await axios_1.default.get(`${AI_SERVICE_URL}/forecast-demand/${regionId}`);
                regionData.future_priority_score = forecastRes.data.predicted_priority_score || 0;
            }
        }
        catch (e) {
            console.error("Forecast service unreachable");
        }
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
exports.triggerAutoAssignmentOnTask = functions.firestore
    .document("tasks/{taskId}")
    .onCreate(async (snapshot, context) => {
    const taskId = context.params.taskId;
    try {
        const response = await axios_1.default.post(`${AI_SERVICE_URL}/match-volunteer/${taskId}`);
        const bestMatches = response.data.best_matches || [];
        const batch = db.batch();
        bestMatches.forEach((match) => {
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
    }
    catch (error) {
        return null;
    }
});
exports.calculateUrgencyScoring = functions.firestore
    .document("community_needs/{needId}")
    .onCreate(async (snapshot) => {
    const data = snapshot.data();
    if (!data)
        return null;
    const score = Math.min(100, Math.round((data.severity || 1) * 3 + Math.log10(data.peopleAffected || 1) * 10));
    const priority = score >= 80 ? "Critical" : score >= 60 ? "High" : "Low";
    return snapshot.ref.update({ urgency_score: score, priority_level: priority });
});
//# sourceMappingURL=index.js.map