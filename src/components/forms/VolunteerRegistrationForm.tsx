"use client";

import React, { useState } from "react";
import { 
  VolunteerAvailability 
} from "@/types/volunteer";
import { createVolunteer } from "@/services/volunteerService";
import { Button } from "@/components/ui/Button";

interface FormState {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: VolunteerAvailability;
  locationName: string;
  latitude: number;
  longitude: number;
}

const skillOptions = [
  "medical",
  "rescue",
  "logistics",
  "food distribution",
  "transport",
  "coordination",
  "general support"
];

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  skills: [],
  availability: VolunteerAvailability.ANYTIME,
  locationName: "",
  latitude: 0,
  longitude: 0,
};

export const VolunteerRegistrationForm = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAfterVolunteerCreated = async (volunteerId: string) => {
    // TODO: Trigger volunteer-task matching algorithm automatically
    console.log(`Volunteer created with ID: ${volunteerId}. Ready for matching.`);
  };

  const validate = () => {
    if (!formData.name) return "Name is required";
    if (!formData.email) return "Email is required";
    if (!formData.phone) return "Phone number is required";
    if (formData.skills.length === 0) return "Please select at least one skill";
    if (!formData.locationName) return "Location name is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await createVolunteer({
        ...formData,
        assignedTaskIds: [],
      });

      setSuccess(true);
      setFormData(initialState);
      await handleAfterVolunteerCreated(result.id);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills (Select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                    formData.skills.includes(skill)
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                      : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  {skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {Object.values(VolunteerAvailability).map((avail) => (
                <option key={avail} value={avail}>
                  {avail.charAt(0).toUpperCase() + avail.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Home Location Name</label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="e.g., North Hill Resident"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
            Registration successful! Thank you for volunteering.
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 text-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
        >
          {loading ? "Registering..." : "Register as Volunteer"}
        </Button>
      </form>
    </div>
  );
};
