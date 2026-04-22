import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { geohashForLocation } from 'geofire-common';

// Initialization (Assumes GOOGLE_APPLICATION_CREDENTIALS env var is set)
admin.initializeApp();
const db = admin.firestore();

interface CSVRow {
  title: string;
  category: string;
  lat: string;
  lng: string;
  peopleAffected: string;
  severity: string;
  resourceShortage: string;
  deadlineUrgency: string;
  locationPriority: string;
}

async function ingestCSV(filePath: string) {
  const records: CSVRow[] = [];
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));

  for await (const record of parser) {
    records.push(record);
  }

  console.log(`Parsed ${records.length} records. Starting batch upload...`);

  const batchSize = 500;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = db.batch();
    const chunk = records.slice(i, i + batchSize);

    chunk.forEach((row) => {
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Skipping row with invalid coordinates: ${row.title}`);
        return;
      }

      const hash = geohashForLocation([lat, lng]);

      const docRef = db.collection('community_needs').doc();
      batch.set(docRef, {
        title: row.title,
        category: row.category,
        location: { lat, lng, geohash: hash },
        peopleAffected: parseInt(row.peopleAffected) || 0,
        severity: parseInt(row.severity) || 1,
        resourceShortage: parseInt(row.resourceShortage) || 1,
        deadlineUrgency: parseInt(row.deadlineUrgency) || 1,
        locationPriority: parseInt(row.locationPriority) || 1,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        hoursWaiting: 0
      });
    });

    await batch.commit();
    console.log(`Uploaded batch ${i / batchSize + 1}`);
  }

  console.log('Ingestion complete!');
}

const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: npx ts-node csv_ingest.ts <path_to_csv>');
} else {
  ingestCSV(filePath).catch(console.error);
}
