'use client';
import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Wifi, Brain } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    orgName: 'Mumbai Relief NGO',
    email: 'admin@mumbairelief.org',
    region: 'Maharashtra, India',
    notifications: true,
    offlineSync: true,
    aiMatching: true,
    autoAssign: false,
    criticalAlerts: true,
    emailDigest: true,
    matchThreshold: 70,
    urgencyThreshold: 80,
    maxDistance: 15,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500">Configure your NGO platform preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Organization */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-800">Organization</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Organization Name', key: 'orgName' },
              { label: 'Admin Email', key: 'email' },
              { label: 'Region', key: 'region' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 font-medium">{label}</label>
                <input
                  type="text"
                  value={settings[key as keyof typeof settings] as string}
                  onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Push Notifications', key: 'notifications' as const },
              { label: 'Critical Alerts', key: 'criticalAlerts' as const },
              { label: 'Email Digest', key: 'emailDigest' as const },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <ToggleSwitch enabled={settings[key] as boolean} onToggle={() => toggle(key)} />
              </div>
            ))}
          </div>
        </div>

        {/* AI & Matching */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-purple-600" />
            <h3 className="text-sm font-bold text-gray-800">AI & Matching Engine</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">AI Auto Matching</span>
              <ToggleSwitch enabled={settings.aiMatching} onToggle={() => toggle('aiMatching')} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto Assign Tasks</span>
              <ToggleSwitch enabled={settings.autoAssign} onToggle={() => toggle('autoAssign')} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Match Threshold: {settings.matchThreshold}%</label>
              <input type="range" min={50} max={100} value={settings.matchThreshold}
                onChange={(e) => setSettings((p) => ({ ...p, matchThreshold: +e.target.value }))}
                className="w-full mt-1 accent-blue-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Max Distance: {settings.maxDistance} km</label>
              <input type="range" min={1} max={50} value={settings.maxDistance}
                onChange={(e) => setSettings((p) => ({ ...p, maxDistance: +e.target.value }))}
                className="w-full mt-1 accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Offline & Security */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={16} className="text-green-600" />
            <h3 className="text-sm font-bold text-gray-800">Offline & Security</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-700">Offline Sync</span>
                <div className="text-xs text-gray-400">Field workers can submit without internet</div>
              </div>
              <ToggleSwitch enabled={settings.offlineSync} onToggle={() => toggle('offlineSync')} />
            </div>
            <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">Data is end-to-end encrypted</span>
              </div>
              <p className="text-[10px] text-green-600 mt-1">156 offline entries pending sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
