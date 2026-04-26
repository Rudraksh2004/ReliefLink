export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availabilityStatus: "Available" | "Assigned" | "Offline";
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  preferredCategories: string[];
  lastActive: string;
}
