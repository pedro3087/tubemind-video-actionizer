import React from 'react';
import { VideoInsight } from '../types';
import { TagBadge } from './TagBadge';
import { PlayCircle, CheckSquare, Calendar, ExternalLink } from 'lucide-react';

interface VideoCardProps {
  insight: VideoInsight;
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ insight, onClick }) => {
  const completedActions = insight.actionItems.filter(i => i.completed).length;
  const totalActions = insight.actionItems.length;
  const progress = totalActions === 0 ? 0 : (completedActions / totalActions) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full group"
    >
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-xs text-slate-500 space-x-2">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(insight.createdAt).toLocaleDateString()}
            </span>
          </div>
          <a 
            href={insight.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {insight.videoTitle}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {insight.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {insight.tags.slice(0, 3).map(tag => (
            <TagBadge key={tag} label={tag} />
          ))}
          {insight.tags.length > 3 && (
            <span className="text-xs text-slate-500 self-center">+{insight.tags.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <CheckSquare className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">{completedActions}/{totalActions}</span>
            <span>actions done</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <PlayCircle className="w-4 h-4" />
            <span>Highlights</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};