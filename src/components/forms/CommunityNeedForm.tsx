"use client";

import React, { useState } from "react";
import { 
  CommunityNeedCategory, 
  CommunityNeedStatus 
} from "@/types/communityNeed";
import { createCommunityNeed, updateCommunityNeed, getCommunityNeedById } from "@/services/communityNeedsService";
import { createAssignment } from "@/services/assignmentService";
import { updateVolunteer } from "@/services/volunteerService";
import { calculateUrgencyScore } from "@/lib/algorithms/urgencyScore";
import { findBestVolunteer } from "@/lib/algorithms/volunteerMatcher";
import { AssignmentStatus } from "@/types/assignment";
import { Button } from "@/components/ui/Button";

interface FormState {
  title: string;
  description: string;
  category: CommunityNeedCategory;
  peopleAffected: number;
  locationName: string;
  latitude: number;
  longitude: number;
}

const initialState: FormState = {
  title: "",
  description: "",
  category: CommunityNeedCategory.OTHER,
  peopleAffected: 0,
  locationName: "",
  latitude: 0,
  longitude: 0,
};

export const CommunityNeedForm = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVolunteerMatching = async (needId: string) => {
    try {
      const need = await getCommunityNeedById(needId);
      if (!need) return;

      const match = await findBestVolunteer(need);
      
      if (match) {
        const { volunteer, score } = match;
        console.log(`Best volunteer matched: ${volunteer.name} (Score: ${score})`);

        // 1. Create Assignment
        await createAssignment({
          needId: needId,
          volunteerId: volunteer.id!,
          assignmentScore: score,
          status: AssignmentStatus.ASSIGNED,
        });

        // 2. Update Community Need Status
        await updateCommunityNeed(needId, { status: CommunityNeedStatus.MATCHED });

        // 3. Update Volunteer Assigned Tasks
        await updateVolunteer(volunteer.id!, {
          assignedTaskIds: [...(volunteer.assignedTaskIds || []), needId]
        });

        console.log(`Successfully matched volunteer ${volunteer.name} to need ${needId}`);
      } else {
        console.log("No volunteers available for matching at this time.");
      }
    } catch (err) {
      console.error("Error in volunteer matching:", err);
    }
  };

  const handleAfterSubmit = async (docId: string, data: FormState) => {
    try {
      // 1. Calculate and update urgency score
      const urgencyScore = calculateUrgencyScore(data as any);
      console.log(`Urgency score calculated: ${urgencyScore}`);
      await updateCommunityNeed(docId, { urgencyScore });

      // 2. Trigger volunteer matching
      await handleVolunteerMatching(docId);
      
    } catch (err) {
      console.error("Error in post-submission workflow:", err);
    }
  };

  const validate = () => {
    if (!formData.title) return "Title is required";
    if (!formData.description) return "Description is required";
    if (!formData.locationName) return "Location name is required";
    if (formData.peopleAffected < 0) return "People affected cannot be negative";
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
      const result = await createCommunityNeed({
        ...formData,
        urgencyScore: 0,
        status: CommunityNeedStatus.PENDING,
      });

      setSuccess(true);
      const submittedData = { ...formData }; // Capture data before reset
      setFormData(initialState);
      await handleAfterSubmit(result.id, submittedData);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit request. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "peopleAffected" || name === "latitude" || name === "longitude" 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-gray-100 dark:border-neutral-800 shadow-sm max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit Community Need</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Urgent Water Supply Needed"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the current situation and specific resources required..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {Object.values(CommunityNeedCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">People Affected</label>
              <input
                type="number"
                name="peopleAffected"
                value={formData.peopleAffected}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location Name</label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="e.g., Central District Shelter B"
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
            Need submitted successfully! Our team will prioritize it shortly.
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 text-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
        >
          {loading ? "Submitting..." : "Submit Community Need"}
        </Button>
      </form>
    </div>
  );
};
