import VolunteerDatabase from "./VolunteerDatabase";
import { UserPlus } from "lucide-react";

export default function VolunteersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Manage and track all registered volunteers</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <UserPlus size={15} />
          Add Volunteer
        </button>
      </div>
      <VolunteerDatabase />
    </div>
  );
}
