import React, { useState, useMemo } from 'react';
import { VideoInsight } from '../types';
import { VideoCard } from './VideoCard';
import { TagBadge } from './TagBadge';
import { Search, Filter } from 'lucide-react';

interface LibraryProps {
  insights: VideoInsight[];
  onSelect: (insight: VideoInsight) => void;
}

export const Library: React.FC<LibraryProps> = ({ insights, onSelect }) => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    insights.forEach(i => i.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [insights]);

  // Filter logic
  const filteredInsights = useMemo(() => {
    return insights.filter(item => {
      const matchesSearch = 
        item.videoTitle.toLowerCase().includes(search.toLowerCase()) || 
        item.summary.toLowerCase().includes(search.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => item.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [insights, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-slate-100 rounded-full p-6 inline-block mb-6">
          <Search className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">No insights saved yet</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Analyze your first video to start building your library of knowledge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filters Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search titles, summaries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
            />
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Filter className="w-4 h-4 mr-2" />
            <span>{filteredInsights.length} results</span>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider self-center mr-2">Filter by:</span>
            {allTags.map(tag => (
              <TagBadge 
                key={tag} 
                label={tag} 
                isActive={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInsights.map(insight => (
          <VideoCard 
            key={insight.id} 
            insight={insight} 
            onClick={() => onSelect(insight)} 
          />
        ))}
      </div>
      
      {filteredInsights.length === 0 && (
        <div className="text-center py-12">
            <p className="text-slate-500">No videos match your search.</p>
        </div>
      )}
    </div>
  );
};