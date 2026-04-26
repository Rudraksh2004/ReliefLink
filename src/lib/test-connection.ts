import { addDocument } from "./firestore";

/**
 * Temporary test function to verify Firestore connection.
 * Writes a test document to the 'system_test' collection.
 */
export const testFirestoreConnection = async () => {
  try {
    const result = await addDocument("system_test", {
      status: "connected",
      timestamp: new Date().toISOString(),
      testLabel: "ReliefLink Initial Setup"
    });
    console.log("Firestore connected successfully! Doc ID:", result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Firestore connection failed:", error);
    return { success: false, error };
  }
};
