import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const needTypes = ['First Aid', 'Food Supply', 'Medical', 'Evacuation', 'Shelter'];
const priorities = ['High', 'Medium', 'Low', 'Critical'];

const EmergencyForm: React.FC = () => {
  const [location, setLocation] = useState('Vasai, Maharashtra');
  const [need, setNeed] = useState('First Aid');
  const [priority, setPriority] = useState('High');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4">
      <h2 className="text-base font-bold text-gray-800 mb-3">Emergency Request Form</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Location */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
          <MapPin size={15} className="text-red-500 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none flex-1"
            placeholder="Location..."
          />
        </div>

        {/* Need Type + Priority */}
        <div className="flex gap-2">
          {/* Need Type */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 flex-shrink-0"></div>
              <select
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none flex-1 appearance-none cursor-pointer"
              >
                {needTypes.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div className="relative">
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 min-w-[90px]">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-700 outline-none appearance-none cursor-pointer pr-4"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={13} className="text-gray-400 absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
            submitted
              ? 'bg-green-500 scale-95'
              : 'bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95'
          }`}
        >
          {submitted ? '✓ Request Submitted!' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default EmergencyForm;
