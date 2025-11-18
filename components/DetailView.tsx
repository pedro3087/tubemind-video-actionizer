import React, { useState, useEffect } from 'react';
import { VideoInsight } from '../types';
import { toggleActionItem, deleteInsight } from '../services/storageService';
import { Button } from './Button';
import { TagBadge } from './TagBadge';
import { ArrowLeft, ExternalLink, Trash2, CheckCircle2, Circle, Calendar, Share2 } from 'lucide-react';

interface DetailViewProps {
  insight: VideoInsight;
  onBack: () => void;
  onUpdate: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ insight, onBack, onUpdate }) => {
  const [localInsight, setLocalInsight] = useState(insight);

  const handleToggle = (actionId: string) => {
    toggleActionItem(localInsight.id, actionId);
    
    // Optimistic update
    const updatedActions = localInsight.actionItems.map(item => 
        item.id === actionId ? { ...item, completed: !item.completed } : item
    );
    setLocalInsight({ ...localInsight, actionItems: updatedActions });
    
    // Notify parent after small delay to sync state if needed
    setTimeout(onUpdate, 0);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteInsight(localInsight.id);
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft className="w-4 h-4"/>}>
          Library
        </Button>
        <div className="flex gap-2">
            <Button variant="danger" onClick={handleDelete} icon={<Trash2 className="w-4 h-4"/>}>
            Delete
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4">
                {localInsight.tags.map(tag => (
                    <TagBadge key={tag} label={tag} />
                ))}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                {localInsight.videoTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <a 
                    href={localInsight.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-indigo-600 transition-colors"
                >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    Open Original Video
                </a>
                <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(localInsight.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-2 p-8 border-r border-slate-100">
                <section className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Summary</h3>
                    <p className="text-slate-700 leading-relaxed text-lg">
                        {localInsight.summary}
                    </p>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Key Highlights</h3>
                    <ul className="space-y-4">
                        {localInsight.highlights.map((hl, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 mr-4 flex-shrink-0"></span>
                                <span className="text-slate-700 leading-relaxed">{hl}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Sidebar / Actions */}
            <div className="bg-indigo-50/30 p-8">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6 flex items-center">
                    Action Plan
                    <span className="ml-2 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs normal-case">
                        {localInsight.actionItems.filter(i => i.completed).length} / {localInsight.actionItems.length}
                    </span>
                </h3>
                <div className="space-y-3">
                    {localInsight.actionItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleToggle(item.id)}
                            className={`w-full flex items-start text-left p-3 rounded-xl transition-all duration-200 group border ${
                                item.completed 
                                ? 'bg-indigo-100/50 border-indigo-200' 
                                : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'
                            }`}
                        >
                            <div className={`mt-0.5 mr-3 flex-shrink-0 ${item.completed ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'}`}>
                                {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </div>
                            <span className={`text-sm ${item.completed ? 'text-indigo-800 line-through opacity-70' : 'text-slate-700'}`}>
                                {item.text}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};