'use client';
import React, { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    name: 'Rahul',
    action: 'Assigned.',
    task: 'Food Mission',
    priority: 'High Priority',
    priorityColor: 'text-orange-500',
    sub: '/Brm.  Notified',
    time: 'Now',
    read: false,
    avatar: 'Ra',
    color: 'bg-blue-400',
  },
  {
    id: 2,
    name: 'Riya',
    action: 'Notified.',
    task: 'Evacuation Mission',
    priority: 'Critical',
    priorityColor: 'text-red-500',
    sub: '6 min ago ◌',
    time: '6 mo',
    read: false,
    avatar: 'Ri',
    color: 'bg-pink-400',
  },
  {
    id: 3,
    name: 'Sita',
    action: 'Reported your stogl.',
    task: 'Medical Help',
    priority: 'High',
    priorityColor: 'text-orange-500',
    sub: '10 min ago ◌',
    time: '10 mo',
    read: false,
    avatar: 'Si',
    color: 'bg-purple-400',
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800">Notifications</h2>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Mark All Read
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors cursor-pointer group ${
              n.read ? 'bg-white' : 'bg-blue-50/50 hover:bg-blue-50'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 ${n.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
              {n.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-800 leading-tight">
                <span className="font-bold">{n.name}</span>{' '}
                <span className="text-gray-600">{n.action}</span>{' '}
                <span className="font-semibold">{n.task}</span>{' '}
                <span className={`font-bold ${n.priorityColor}`}>({n.priority})</span>{' '}
                <span className="text-gray-300">›</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">{n.sub}</div>
            </div>

            {/* Time + Unread dot */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-gray-400">{n.time}</span>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
