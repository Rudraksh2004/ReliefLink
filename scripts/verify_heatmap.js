const admin = require('firebase-admin');

// Initialization
try {
    const serviceAccount = require('../serviceAccount.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'carecompass-f6890'
    });
} catch (e) {
    console.log("Firebase Init via Project ID...");
    admin.initializeApp({
        projectId: 'carecompass-f6890'
    });
}

const db = admin.firestore();

async function testHeatmapPipeline() {
    console.log("--- ReliefLink Heatmap Verification ---");
    
    // 1. Create dummy data
    const testGeohash = "tumbv"; // Central Kolkata area
    const needRef = db.collection('community_needs').doc('test_heat_1');
    
    console.log("Pushing test need...");
    await needRef.set({
        title: "Test Heatmap Report",
        location: {
            lat: 22.57,
            lng: 88.36,
            geohash: testGeohash
        },
        urgency_score: 90,
        severity: 9,
        peopleAffected: 100,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Need created. Waiting 5 seconds for Cloud Function trigger...");
    await new Promise(r => setTimeout(r, 5000));

    // 2. Check region_priority_scores
    const regionRef = db.collection('region_priority_scores').doc(testGeohash.substring(0, 5));
    const regionDoc = await regionRef.get();

    if (regionDoc.exists) {
        const data = regionDoc.data();
        console.log("✅ SUCCESS: Region heatmap document found!");
        printRegionStats(data);
    } else {
        console.log("❌ FAILURE: Region document not created. Is your Cloud Function deployed?");
    }
}

function printRegionStats(data) {
    console.log("-----------------------------------------");
    console.log(`Region ID: ${data.region_id}`);
    console.log(`Task Density: ${data.task_density}`);
    console.log(`Avg Urgency Score: ${data.average_urgency_score}`);
    console.log(`Heat Intensity Value: ${data.heat_intensity_value}`);
    console.log(`Last Updated: ${data.last_updated.toDate()}`);
    console.log("-----------------------------------------");
}

testHeatmapPipeline().catch(console.error);
