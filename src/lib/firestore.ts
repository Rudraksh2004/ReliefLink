import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  QueryConstraint,
  DocumentData,
  WithFieldValue
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Reusable helper to add a document to a collection
 */
export const addDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionName: string, 
  data: T
) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Reusable helper to get a single document by ID
 */
export const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/**
 * Reusable helper to get all documents from a collection with optional constraints
 */
export const getCollection = async (
  collectionName: string, 
  constraints: QueryConstraint[] = []
) => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Reusable helper to update a document
 */
export const updateDocument = async (
  collectionName: string, 
  id: string, 
  data: Partial<DocumentData>
) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};
