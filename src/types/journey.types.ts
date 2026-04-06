import type { JourneyDefinitionResponse } from "../api/models";

// Journey Definition List Item (for display in lists)
export interface JourneyDefinitionListItem {
  id: string;
  journeyCode: string;
  name: string;
  version: number;
  active: boolean;
  createdAt: string;
}

// Create Journey Form Data
export interface CreateJourneyFormData {
  journeyCode: string;
  name: string;
  initialState: string;
}

// Journey Details View Model
export interface JourneyDefinitionDetails extends JourneyDefinitionResponse {
  isEditable: boolean;
  hasInstances: boolean;
}

// State Types
export interface StateListItem {
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
}

// Transition Types
export interface TransitionListItem {
  source: string;
  event: string;
  target: string;
  condition?: string;
}

// Journey Summary for cards
export interface JourneySummary {
  id: string;
  journeyCode: string;
  name: string;
  version: number;
  stateCount: number;
  transitionCount: number;
  createdAt: string;
  active: boolean;
}
