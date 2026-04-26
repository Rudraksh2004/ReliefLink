import { addDocument, updateDocument, getCollection } from "@/lib/firestore";
import { Volunteer } from "@/types/volunteer";

const COLLECTION = "volunteers";

export const registerVolunteer = async (volunteerData: Omit<Volunteer, "id" | "lastActive">) => {
  return await addDocument(COLLECTION, {
    ...volunteerData,
    availabilityStatus: "Available",
    lastActive: new Date().toISOString(),
  });
};

export const fetchAvailableVolunteers = async () => {
  return await getCollection(COLLECTION) as Volunteer[];
};

export const updateVolunteerAvailability = async (id: string, status: Volunteer["availabilityStatus"]) => {
  return await updateDocument(COLLECTION, id, { 
    availabilityStatus: status,
    lastActive: new Date().toISOString(),
  });
};
