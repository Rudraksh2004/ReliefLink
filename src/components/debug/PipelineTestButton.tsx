"use client";

import React, { useState } from "react";
import { createCommunityNeed } from "@/services/communityNeedsService";
import { CommunityNeedCategory, CommunityNeedStatus } from "@/types/communityNeed";
import { calculateUrgencyScore } from "@/lib/algorithms/urgencyScore";
import { updateCommunityNeed } from "@/services/communityNeedsService";
import { findBestVolunteer } from "@/lib/algorithms/volunteerMatcher";
import { createAssignment } from "@/services/assignmentService";
import { updateVolunteer } from "@/services/volunteerService";
import { updateRegionPriorityScore } from "@/services/regionPriorityService";
import { AssignmentStatus } from "@/types/assignment";
import { Play, CheckCircle2, Loader2 } from "lucide-react";

export const PipelineTestButton = () => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<string[]>([]);

  const runTest = async () => {
    setTesting(true);
    setStatus([]);
    
    const addStatus = (msg: string) => setStatus(prev => [...prev, msg]);

    try {
      // 1. Create Test Need
      const testNeed = {
        title: "TEST PIPELINE NEED",
        description: "Automated end-to-end verification test.",
        category: CommunityNeedCategory.MEDICAL,
        peopleAffected: 75,
        locationName: "Test Region Alpha",
        latitude: 22.5726,
        longitude: 88.3639,
        urgencyScore: 0,
        status: CommunityNeedStatus.PENDING,
      };

      addStatus("Creating test community need...");
      const result = await createCommunityNeed(testNeed);
      const needId = result.id;
      addStatus(`Need created ID: ${needId}`);

      // 2. Urgency Scoring
      addStatus("Calculating urgency score...");
      const score = calculateUrgencyScore(testNeed as any);
      await updateCommunityNeed(needId, { urgencyScore: score });
      addStatus(`Urgency score updated: ${score}`);
      console.log("Urgency scoring pipeline working");

      // 3. Volunteer Matching
      addStatus("Searching for best volunteer match...");
      const needWithId = { id: needId, ...testNeed, urgencyScore: score } as any;
      const match = await findBestVolunteer(needWithId);

      if (match) {
        const { volunteer, score: matchScore } = match;
        addStatus(`Match found: ${volunteer.name} (Score: ${matchScore})`);

        // 4. Create Assignment
        addStatus("Creating assignment...");
        await createAssignment({
          needId: needId,
          volunteerId: volunteer.id!,
          assignmentScore: matchScore,
          status: AssignmentStatus.ASSIGNED,
        });

        // 5. Update Statuses
        addStatus("Updating document statuses...");
        await updateCommunityNeed(needId, { status: CommunityNeedStatus.MATCHED });
        await updateVolunteer(volunteer.id!, {
          assignedTaskIds: [needId]
        });

        // 6. Region Priority
        addStatus("Updating regional heatmap aggregation...");
        await updateRegionPriorityScore("Test Region Alpha");
        console.log("Region priority pipeline working");
        console.log("Volunteer matching pipeline working");

        addStatus("PIPELINE TEST COMPLETE - SUCCESS");
      } else {
        addStatus("PIPELINE TEST COMPLETE - No volunteers found for matching.");
      }
    } catch (err) {
      console.error(err);
      addStatus("PIPELINE TEST FAILED - Check console for details.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-blue-900 dark:text-blue-300">Pipeline Verification</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">Trigger a full automated end-to-end test.</p>
        </div>
        <button
          onClick={runTest}
          disabled={testing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
        >
          {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          Run Pipeline Test
        </button>
      </div>

      {status.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-blue-100 dark:border-blue-900/30">
          {status.map((msg, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
