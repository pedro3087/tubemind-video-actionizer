import React, { useState, useEffect } from 'react';
import { analyzeVideoContent } from '../services/geminiService';
import { saveInsight } from '../services/storageService';
import { VideoInsight, ActionItem, GeminiResponse } from '../types';
import { Button } from './Button';
import { TagBadge } from './TagBadge';
import { ArrowLeft, Save, Youtube, Sparkles, Plus, Trash2 } from 'lucide-react';

interface AnalyzerProps {
  onBack: () => void;
  onSaveSuccess: () => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ onBack, onSaveSuccess }) => {
  // Form State
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result State
  const [result, setResult] = useState<VideoInsight | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newAction, setNewAction] = useState('');

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const rawData: GeminiResponse = await analyzeVideoContent(url, transcript);
      
      const insight: VideoInsight = {
        id: crypto.randomUUID(),
        url: url,
        videoTitle: rawData.videoTitle,
        summary: rawData.summary,
        highlights: rawData.highlights,
        actionItems: rawData.actionItems.map(text => ({
          id: crypto.randomUUID(),
          text,
          completed: false
        })),
        tags: rawData.suggestedTags,
        createdAt: Date.now()
      };

      setResult(insight);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    saveInsight(result);
    onSaveSuccess();
  };

  const addTag = () => {
    if (newTag.trim() && result) {
      setResult({
        ...result,
        tags: [...result.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (result) {
      setResult({
        ...result,
        tags: result.tags.filter(t => t !== tagToRemove)
      });
    }
  };

  const addActionItem = () => {
    if (newAction.trim() && result) {
        const newItem: ActionItem = {
            id: crypto.randomUUID(),
            text: newAction.trim(),
            completed: false
        }
        setResult({
            ...result,
            actionItems: [...result.actionItems, newItem]
        });
        setNewAction('');
    }
  };

  const removeActionItem = (id: string) => {
      if (result) {
          setResult({
              ...result,
              actionItems: result.actionItems.filter(item => item.id !== id)
          });
      }
  }

  // If we have a result, show the Edit/Preview UI
  if (result) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setResult(null)} icon={<ArrowLeft className="w-4 h-4"/>}>
            Back to Edit
          </Button>
          <Button onClick={handleSave} icon={<Save className="w-4 h-4"/>}>
            Save to Library
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Video Title</label>
                <input 
                    type="text" 
                    value={result.videoTitle}
                    onChange={(e) => setResult({...result, videoTitle: e.target.value})}
                    className="w-full text-2xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 placeholder-slate-400"
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Summary</label>
                <textarea 
                    value={result.summary}
                    onChange={(e) => setResult({...result, summary: e.target.value})}
                    rows={2}
                    className="w-full text-slate-600 bg-transparent border-none focus:ring-0 p-0 resize-none text-sm leading-relaxed"
                />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Highlights Column */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mr-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Highlights</h3>
              </div>
              <ul className="space-y-4">
                {result.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start group">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500 mr-3 mt-0.5">
                        {idx + 1}
                    </span>
                    <p className="text-slate-700 leading-relaxed">{highlight}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items Column */}
            <div className="p-8 bg-indigo-50/30">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                  <Youtube className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Action Items</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                {result.actionItems.map((item) => (
                  <div key={item.id} className="flex items-start group bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                    <input type="checkbox" disabled className="mt-1 h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-3 text-slate-700 flex-1">{item.text}</span>
                    <button onClick={() => removeActionItem(item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addActionItem()}
                    placeholder="Add new action item..."
                    className="flex-1 text-sm rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Button variant="secondary" onClick={addActionItem} className="p-2">
                      <Plus className="w-4 h-4" />
                  </Button>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="p-8 border-t border-slate-100 bg-white">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {result.tags.map(tag => (
                <TagBadge key={tag} label={tag} onRemove={() => removeTag(tag)} />
              ))}
            </div>
            <div className="flex items-center max-w-xs">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="block w-full text-sm rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              />
              <Button variant="ghost" onClick={addTag} className="ml-2 text-slate-500 hover:text-indigo-600">
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input Form UI
  return (
    <div className="max-w-2xl mx-auto pt-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Analyze New Video</h2>
        <p className="text-slate-600">
          Turn long YouTube videos into actionable checklists and concise summaries in seconds.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5 border"
              />
            </div>
          </div>

          <div>
            <label htmlFor="transcript" className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
              <span>Transcript / Context (Optional)</span>
              <span className="text-xs font-normal text-indigo-600">Recommended for accuracy</span>
            </label>
            <textarea
              id="transcript"
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste the video transcript, description, or your own notes here to help the AI generate better results..."
              className="block w-full sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 border"
            />
            <p className="mt-2 text-xs text-slate-500">
              Providing text helps Gemini extract specific details that might otherwise be missed from just the URL.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button variant="secondary" onClick={onBack} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAnalyze} 
              isLoading={isAnalyzing} 
              className="flex-[2]"
              disabled={!url}
            >
              Generate Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};