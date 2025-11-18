import { VideoInsight, ActionItem } from "../types";

const STORAGE_KEY = "tubemind_insights_v1";

export const getSavedInsights = (): VideoInsight[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load insights:", error);
    return [];
  }
};

export const saveInsight = (insight: VideoInsight): void => {
  const current = getSavedInsights();
  // Check if exists, update if so
  const index = current.findIndex(i => i.id === insight.id);
  if (index >= 0) {
    current[index] = insight;
  } else {
    current.unshift(insight); // Add to top
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const deleteInsight = (id: string): void => {
  const current = getSavedInsights();
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const toggleActionItem = (insightId: string, actionItemId: string): void => {
  const current = getSavedInsights();
  const insightIndex = current.findIndex(i => i.id === insightId);
  
  if (insightIndex >= 0) {
    const insight = current[insightIndex];
    const updatedActions = insight.actionItems.map(item => 
      item.id === actionItemId ? { ...item, completed: !item.completed } : item
    );
    current[insightIndex] = { ...insight, actionItems: updatedActions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
};