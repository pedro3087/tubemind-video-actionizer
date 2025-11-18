import React, { useState, useEffect } from 'react';
import { VideoInsight, ViewState } from './types';
import { getSavedInsights } from './services/storageService';
import { Analyzer } from './components/Analyzer';
import { Library } from './components/Library';
import { DetailView } from './components/DetailView';
import { Button } from './components/Button';
import { Plus, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('library');
  const [insights, setInsights] = useState<VideoInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<VideoInsight | null>(null);

  const refreshData = () => {
    const data = getSavedInsights();
    setInsights(data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleViewDetail = (insight: VideoInsight) => {
    setSelectedInsight(insight);
    setView('detail');
  };

  const handleBackToLibrary = () => {
    refreshData();
    setView('library');
    setSelectedInsight(null);
  };

  const handleSaveSuccess = () => {
    refreshData();
    setView('library');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={handleBackToLibrary}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Tube<span className="text-indigo-600">Mind</span>
            </span>
          </div>
          
          {view === 'library' && (
            <Button onClick={() => setView('analyze')} icon={<Plus className="w-4 h-4"/>}>
              New Analysis
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'library' && (
          <Library 
            insights={insights} 
            onSelect={handleViewDetail} 
          />
        )}

        {view === 'analyze' && (
          <Analyzer 
            onBack={() => setView('library')} 
            onSaveSuccess={handleSaveSuccess} 
          />
        )}

        {view === 'detail' && selectedInsight && (
          <DetailView 
            insight={selectedInsight} 
            onBack={handleBackToLibrary} 
            onUpdate={refreshData}
          />
        )}
      </main>
    </div>
  );
};

export default App;