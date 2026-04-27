"use client";

import React, { useState } from "react";
import { 
  CommunityNeedCategory, 
  CommunityNeedStatus 
} from "@/types/communityNeed";
import { createCommunityNeed, updateCommunityNeed, getCommunityNeedById } from "@/services/communityNeedsService";
import { createAssignment } from "@/services/assignmentService";
import { updateVolunteer, getAllVolunteers } from "@/services/volunteerService";
import { updateRegionPriorityScore } from "@/services/regionPriorityService";
import { calculateUrgencyScore } from "@/lib/algorithms/urgencyScore";
import { findBestVolunteer } from "@/lib/algorithms/volunteerMatcher";
import { predictCategory, predictUrgency, predictMatch, predictRegionPriority } from "@/services/mlService";
import { AssignmentStatus } from "@/types/assignment";
import { PriorityLevel } from "@/types/regionPriorityScore";
import { Button } from "@/components/ui/Button";
import { MapPin, Loader2, Camera, X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface FormState {
  title: string;
  description: string;
  category: CommunityNeedCategory;
  peopleAffected: number;
  locationName: string;
  latitude: number;
  longitude: number;
  reporterName?: string;
  reporterPhone?: string;
}

const initialState: FormState = {
  title: "",
  description: "",
  category: CommunityNeedCategory.OTHER,
  peopleAffected: 0,
  locationName: "",
  latitude: 0,
  longitude: 0,
  reporterName: "",
  reporterPhone: "",
};

export const CommunityNeedForm = () => {
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));

        try {
          // Reverse Geocoding using OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setFormData(prev => ({
              ...prev,
              locationName: data.display_name
            }));
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          // We still have coordinates, so we don't treat this as a fatal error
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location access denied. Please enter coordinates manually.");
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${imageFile.name}`;
      const storageRef = ref(storage, `community_needs/${fileName}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error("Image upload error:", err);
      throw new Error("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVolunteerMatching = async (needId: string) => {
    try {
      const need = await getCommunityNeedById(needId);
      if (!need) return;

      // --- STEP 3: ML-POWERED VOLUNTEER MATCHING ---
      let bestMatch: { volunteerId: string, score: number, name: string, assignedTaskIds: string[] } | null = null;
      
      const volunteers = await getAllVolunteers();
      
      if (volunteers.length > 0) {
        // Try ML Prediction for each volunteer
        for (const volunteer of volunteers) {
          const mlScore = await predictMatch(
            need.category,
            need.urgencyScore,
            volunteer.skills,
            volunteer.availability,
            // Calculate distance for ML input
            Math.sqrt(Math.pow(need.latitude - volunteer.latitude, 2) + Math.pow(need.longitude - volunteer.longitude, 2)) * 111
          );

          const finalScore = mlScore !== null ? mlScore : 0; // Fallback score 0 if ML fails for individual

          if (!bestMatch || finalScore > bestMatch.score) {
            bestMatch = { 
              volunteerId: volunteer.id!, 
              score: finalScore, 
              name: volunteer.name,
              assignedTaskIds: volunteer.assignedTaskIds || []
            };
          }
        }
      }

      // If ML matching found nothing or failed, fallback to rule-based algorithm
      if (!bestMatch || bestMatch.score === 0) {
        const fallbackMatch = await findBestVolunteer(need);
        if (fallbackMatch) {
          bestMatch = { 
            volunteerId: fallbackMatch.volunteer.id!, 
            score: fallbackMatch.score, 
            name: fallbackMatch.volunteer.name,
            assignedTaskIds: fallbackMatch.volunteer.assignedTaskIds || []
          };
          console.log("Using rule-based volunteer matching fallback.");
        }
      }
      
      if (bestMatch) {
        console.log(`Best volunteer matched: ${bestMatch.name} (Score: ${bestMatch.score})`);

        // 1. Create Assignment
        await createAssignment({
          needId: needId,
          volunteerId: bestMatch.volunteerId,
          assignmentScore: bestMatch.score,
          status: AssignmentStatus.ASSIGNED,
        });

        // 2. Update Community Need Status
        await updateCommunityNeed(needId, { status: CommunityNeedStatus.MATCHED });

        // 3. Update Volunteer Assigned Tasks
        await updateVolunteer(bestMatch.volunteerId, {
          assignedTaskIds: [...bestMatch.assignedTaskIds, needId]
        });

        // --- STEP 4: ML-POWERED REGION PRIORITY ---
        const totalNeedsInRegion = (await getCommunityNeedById(needId)) ? 1 : 1; // Simplified for prototype
        const mlPriority = await predictRegionPriority(
          need.latitude,
          need.longitude,
          need.urgencyScore,
          totalNeedsInRegion
        );

        // Update Region Priority Score with ML override if available
        await updateRegionPriorityScore(need.locationName, mlPriority as PriorityLevel);

        console.log("Volunteer matching pipeline working");
        console.log(`Successfully matched volunteer ${bestMatch.name} to need ${needId}`);
      } else {
        console.log("No volunteers available for matching at this time.");
      }
    } catch (err) {
      console.error("Error in volunteer matching:", err);
    }
  };

  const handleAfterSubmit = async (docId: string, data: FormState) => {
    try {
      // --- STEP 2: ML-POWERED URGENCY SCORING ---
      let urgencyScore = await predictUrgency(data.description, data.peopleAffected, data.category);
      
      if (urgencyScore === null) {
        // Fallback to rule-based
        urgencyScore = calculateUrgencyScore(data as any);
        console.log("Using rule-based urgency scoring fallback.");
      }

      console.log(`Urgency score calculated: ${urgencyScore}`);
      await updateCommunityNeed(docId, { urgencyScore });
      console.log("Urgency scoring pipeline working");

      // Trigger volunteer matching
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
      // --- STEP 0: IMAGE UPLOAD ---
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage() || "";
      }

      // --- STEP 1: ML-POWERED CATEGORY PREDICTION ---
      const predictedCategory = await predictCategory(formData.description);
      const finalData = {
        ...formData,
        category: (predictedCategory as CommunityNeedCategory) || formData.category
      };

      const result = await createCommunityNeed({
        ...finalData,
        urgencyScore: 0,
        status: CommunityNeedStatus.PENDING,
        reporterId: user?.uid || "anonymous",
        submittedByRole: userProfile?.role || "community_user",
        imageUrl,
      } as any);

      setSuccess(true);
      const submittedData = { ...finalData, imageUrl }; // Capture data before reset
      setFormData(initialState);
      setImageFile(null);
      setImagePreview(null);
      await handleAfterSubmit(result.id, submittedData as any);
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
      <h2 className="text-2xl font-black mb-6">Report Community Need</h2>
      
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
              rows={4}
              placeholder="Describe the situation in detail..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category (Auto-predicted)</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
            >
              {Object.values(CommunityNeedCategory).map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estimated People Affected</label>
            <input
              type="number"
              name="peopleAffected"
              value={formData.peopleAffected}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Visual Documentation (Optional)</h3>
            <div className="space-y-4">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={clearImage}
                        className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-neutral-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2 transition-colors" />
                      <p className="text-xs font-bold text-gray-500 group-hover:text-blue-600 uppercase tracking-widest">Upload Photo</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              {uploadingImage && (
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  UPLOADING IMAGE...
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Location Details</h3>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all disabled:opacity-50"
              >
                {detectingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    Use My Current Location
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                disabled={detectingLocation}
                placeholder="e.g., Central District Shelter B"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-neutral-800/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  disabled={detectingLocation}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-neutral-800/50"
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
                  disabled={detectingLocation}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-neutral-800/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Reporter Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reporter Name</label>
                <input
                  type="text"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reporter Phone</label>
                <input
                  type="tel"
                  name="reporterPhone"
                  value={formData.reporterPhone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              Optional: Provide contact details so volunteers can reach you.
            </p>
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
          {loading ? "Submitting..." : "Report Community Need"}
        </Button>
      </form>
    </div>
  );
};
