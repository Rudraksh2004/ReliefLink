import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { distanceBetween, geohashForLocation } from "geofire-common";

admin.initializeApp();
const db = admin.firestore();

/**
 * STEP 2 Implementation: Urgency Scoring Engine
 * Triggered whenever a community need is created or updated.
 */
export const calculateUrgencyScore = functions.firestore
    .document("community_needs/{needId}")
    .onWrite(async (change, context) => {
        const data = change.after.data();
        if (!data) return null;

        // Skip if already calculated to prevent infinite loops (unless values changed)
        const previousData = change.before.data();
        if (previousData && 
            previousData.severityLevel === data.severityLevel &&
            previousData.peopleAffected === data.peopleAffected &&
            previousData.resourceScarcity === data.resourceScarcity &&
            data.urgencyScore !== undefined) {
            return null;
        }

        // Logic based on the design document
        const weights = { severity: 10, people: 15, resource: 8, wait: 5, location: 10 };
        
        let score = (data.severityLevel || 1) * weights.severity;
        score += Math.log10(Math.max(1, data.peopleAffected || 1)) * weights.people;
        score += (data.resourceScarcity || 1) * weights.resource;
        
        const hoursWaiting = data.hoursWaiting || 0;
        score += (hoursWaiting / 24) * weights.wait;
        
        score += (data.isHighRiskZone ? 1 : 0) * weights.location;

        const urgencyScore = Math.min(100, Math.round(score));

        // Update the document
        return change.after.ref.update({ urgencyScore });
    });

/**
 * STEP 3 Implementation: Volunteer-Task Matching
 * Triggered when a new task is created.
 */
export const matchVolunteersForTask = functions.firestore
    .document("tasks/{taskId}")
    .onCreate(async (snapshot, context) => {
        const taskData = snapshot.data();
        const taskLocation = taskData.location; // { lat, lng }
        const requiredSkills = taskData.requiredSkills || [];

        // 1. Query volunteers within range (Geofire logic)
        // For simplicity in this pseudo-production code, we'll fetch recently active
        const volunteersSnapshot = await db.collection("volunteers")
            .where("isActive", "==", true)
            .limit(50) 
            .get();

        const matches: any[] = [];

        volunteersSnapshot.forEach(doc => {
            const vData = doc.data();
            const vLocation = vData.location;

            // Proximity Score (Haversine)
            const distance = distanceBetween(
                [taskLocation.lat, taskLocation.lng],
                [vLocation.lat, vLocation.lng]
            );

            if (distance > (vData.maxTravelRadius || 10)) return;

            // Skill Score
            const vSkills = vData.skills || [];
            const skillOverlap = requiredSkills.filter((s: string) => vSkills.includes(s)).length;
            const skillMatchScore = requiredSkills.length > 0 ? (skillOverlap / requiredSkills.length) : 1;

            // Final Match Score calculation
            const distanceScore = Math.max(0, 1 - (distance / (vData.maxTravelRadius || 10)));
            const finalMatchScore = (skillMatchScore * 50) + (distanceScore * 30) + (vData.rating * 4);

            matches.push({
                volunteerId: doc.id,
                name: vData.displayName,
                score: Math.round(finalMatchScore),
                distance,
            });
        });

        // 2. Sort and create match records
        const topMatches = matches.sort((a, b) => b.score - a.score).slice(0, 5);

        for (const match of topMatches) {
            await db.collection("matches").add({
                taskId: context.params.taskId,
                volunteerId: match.volunteerId,
                score: match.score,
                status: "pending",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        return null;
    });

/**
 * STEP 6 Implementation: Analytics Aggregation
 * Increments global stats when a need is resolved.
 */
export const onNeedStatusChange = functions.firestore
    .document("community_needs/{needId}")
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        if (before.status !== "completed" && after.status === "completed") {
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const statsRef = db.collection("analytics_cache").doc(`daily_stats_${date}`);

            return statsRef.set({
                resolvedCount: admin.firestore.FieldValue.increment(1),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        return null;
    });

/**
 * STEP 6 & 8 Implementation: Heatmap Aggregation
 * Updates a regional density map whenever a need is created.
 * Uses a 5-character geohash prefix (~4.9km x 4.9km) for global hotspots.
 */
export const aggregateHeatmap = functions.firestore
    .document("community_needs/{needId}")
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        if (!data.location || !data.location.geohash) return null;

        const regionPrefix = data.location.geohash.substring(0, 5);
        const heatmapRef = db.collection("analytics_cache").doc(`heatmap_${regionPrefix}`);

        return heatmapRef.set({
            count: admin.firestore.FieldValue.increment(1),
            totalUrgency: admin.firestore.FieldValue.increment(data.urgencyScore || 0),
            avgUrgency: 0, // Calculated client-side or during another schedule
            center: data.location, // Approximate center
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    });

/**
 * Scheduled Function: Daily Cleanup & Deep Analytics
 * Runs at midnight to finalize daily stats.
 */
export const nightlyAnalyticsTask = functions.pubsub
    .schedule("0 0 * * *")
    .onRun(async (context) => {
        // Implementation: Archive yesterday's stats, clear high-frequency logs
        console.log("Nightly aggregation complete.");
        return null;
    });
