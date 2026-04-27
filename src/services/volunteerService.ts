import { 
  addDocument, 
  getDocument, 
  getCollection, 
  updateDocument 
} from "@/lib/firestore";
import { Volunteer } from "@/types/volunteer";
import { serverTimestamp, QueryConstraint } from "firebase/firestore";

const COLLECTION = "volunteers";

export const createVolunteer = async (volunteerData: Omit<Volunteer, "id" | "createdAt" | "submittedByRole"> & { submittedByRole?: Volunteer["submittedByRole"] }) => {
  const { submittedByRole = "volunteer", ...rest } = volunteerData;
  return await addDocument(COLLECTION, {
    ...rest,
    submittedByRole,
    createdAt: serverTimestamp(),
  });
};

export const getVolunteerById = async (id: string) => {
  return await getDocument(COLLECTION, id) as Volunteer | null;
};

export const getAllVolunteers = async (constraints: QueryConstraint[] = []) => {
  return await getCollection(COLLECTION, constraints) as Volunteer[];
};

export const updateVolunteer = async (id: string, data: Partial<Volunteer>) => {
  return await updateDocument(COLLECTION, id, data);
};
