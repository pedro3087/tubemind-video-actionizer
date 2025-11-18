import React from 'react';
import { X } from 'lucide-react';

interface TagBadgeProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  isActive?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ label, onRemove, onClick, isActive }) => {
  const activeClasses = isActive 
    ? "bg-indigo-100 text-indigo-800 border-indigo-200" 
    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${activeClasses}`}
      onClick={onClick}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-indigo-200 hover:text-indigo-900 focus:outline-none"
        >
          <span className="sr-only">Remove tag</span>
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};