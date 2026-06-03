import React, { useState } from 'react';
import { History, Sparkles, AlertTriangle, Send, User } from 'lucide-react';
import { ActivityFeedItem } from '../types';

interface RightSidebarProps {
  activities: ActivityFeedItem[];
  incidentId: string;
  onAddComment: (comment: string) => void;
}

export default function RightSidebar({ activities, incidentId, onAddComment }: RightSidebarProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddComment(comment);
    setComment('');
  };

  const incidentActivities = activities.filter(act => act.incidentId === incidentId);

  return (
    <aside className="w-80 border-l border-[#c2c6d6] bg-white flex flex-col h-full overflow-y-auto shrink-0 font-sans">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#c2c6d6] bg-[#eceef0]/50 sticky top-0 z-10">
        <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
          <History className="w-4 h-4 text-[#474f65]" />
          Activity Feed
        </h3>
      </div>

      {/* Timeline Items */}
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="relative border-l-2 border-[#e2e8f0] ml-3.5 space-y-6 pb-4">
          {incidentActivities.map((activity, idx) => (
            <div key={activity.id || idx} className="relative pl-6">
              {/* Icon/Avatar positioning */}
              <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                {activity.isAi ? (
                  <div className="w-full h-full bg-[#0062d6]/10 text-[#0062d6] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                ) : activity.isError ? (
                  <div className="w-full h-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : activity.avatarUrl ? (
                  <img src={activity.avatarUrl} alt={activity.user} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#e2e8f0] text-[#474f65] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-[#191c1e] leading-snug">
                  {activity.isAi || activity.isError ? (
                    <span className="font-sans text-[#191c1e]">{activity.action}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-[#191c1e]">{activity.user}</span>{' '}
                      <span className="text-[#424754]">{activity.action}</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-[#727785] mt-1 font-mono">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}

          {incidentActivities.length === 0 && (
            <p className="text-xs text-[#727785] italic pl-4">No activities logged yet.</p>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-[#c2c6d6] bg-[#f8fafc]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add update or team message..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 bg-white border border-[#c2c6d6] rounded py-1.5 px-2.5 text-xs focus:outline-none focus:border-[#004ba7] text-[#191c1e]"
          />
          <button
            type="submit"
            className="bg-[#0062d6] text-white hover:bg-[#004ba7] p-1.5 rounded transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
}
