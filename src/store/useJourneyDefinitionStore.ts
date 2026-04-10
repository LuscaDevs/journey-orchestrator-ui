import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { JourneyDefinition } from '../types/journey';
import { toJourneyDefinition, fromJourneyDefinition } from '../utils/journeyConversion';
import type { Node, Edge } from 'reactflow';

interface JourneyDefinitionState {
  currentDefinition: JourneyDefinition | null;
  definitions: JourneyDefinition[];
  canvasNodes: Node[];
  canvasEdges: Edge[];
  hasUnsavedChanges: boolean;
}

interface JourneyDefinitionActions {
  setCurrentDefinition: (definition: JourneyDefinition | null) => void;
  createDefinition: (name: string) => void;
  updateDefinition: (name: string) => void;
  deleteDefinition: (id: string) => void;
  loadDefinitionIntoCanvas: (definition: JourneyDefinition) => void;
  updateCanvasState: (nodes: Node[], edges: Edge[]) => void;
  saveCurrentDefinition: () => void;
  discardChanges: () => void;
}

export const useJourneyDefinitionStore = create<JourneyDefinitionState & JourneyDefinitionActions>((set, get) => ({
  currentDefinition: null,
  definitions: [],
  canvasNodes: [],
  canvasEdges: [],
  hasUnsavedChanges: false,

  setCurrentDefinition: (definition) => {
    set({ 
      currentDefinition: definition,
      hasUnsavedChanges: false 
    });
  },

  createDefinition: (name) => {
    const newDefinition: JourneyDefinition = {
      id: uuidv4(),
      name,
      version: 1,
      nodes: [],
      edges: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    set((state) => ({
      currentDefinition: newDefinition,
      canvasNodes: [],
      canvasEdges: [],
      hasUnsavedChanges: true // Mark as unsaved since it's not in the list yet
    }));
  },

  updateDefinition: (name) => {
    const { currentDefinition, canvasNodes, canvasEdges, definitions } = get();
    if (!currentDefinition) return;

    // Check if this is the first time saving (not in definitions list yet)
    const isNewDefinition = !definitions.some(def => def.id === currentDefinition.id);
    
    const updatedDefinition = toJourneyDefinition(
      canvasNodes,
      canvasEdges,
      name,
      currentDefinition,
      !isNewDefinition // Only increment version if it's not a new definition
    );

    set((state) => ({
      definitions: isNewDefinition 
        ? [...state.definitions, updatedDefinition] // Add to list if new
        : state.definitions.map(def => // Update existing if not new
            def.id === updatedDefinition.id ? updatedDefinition : def
          ),
      currentDefinition: updatedDefinition,
      hasUnsavedChanges: false
    }));
  },

  deleteDefinition: (id) => {
    set((state) => {
      const newDefinitions = state.definitions.filter(def => def.id !== id);
      const shouldClearCurrent = state.currentDefinition?.id === id;
      
      return {
        definitions: newDefinitions,
        currentDefinition: shouldClearCurrent ? null : state.currentDefinition,
        canvasNodes: shouldClearCurrent ? [] : state.canvasNodes,
        canvasEdges: shouldClearCurrent ? [] : state.canvasEdges,
        hasUnsavedChanges: false
      };
    });
  },

  loadDefinitionIntoCanvas: (definition) => {
    const { nodes, edges } = fromJourneyDefinition(definition);
    set({
      currentDefinition: definition,
      canvasNodes: nodes,
      canvasEdges: edges,
      hasUnsavedChanges: false
    });
  },

  updateCanvasState: (nodes, edges) => {
    const { canvasNodes, canvasEdges } = get();
    
    // Simple comparison to detect changes
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(canvasNodes);
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(canvasEdges);
    
    set({
      canvasNodes: nodes,
      canvasEdges: edges,
      hasUnsavedChanges: nodesChanged || edgesChanged
    });
  },

  saveCurrentDefinition: () => {
    const { currentDefinition, canvasNodes, canvasEdges } = get();
    if (!currentDefinition) return;

    const updatedDefinition = toJourneyDefinition(
      canvasNodes,
      canvasEdges,
      currentDefinition.name,
      currentDefinition
    );

    set((state) => ({
      definitions: state.definitions.map(def =>
        def.id === updatedDefinition.id ? updatedDefinition : def
      ),
      currentDefinition: updatedDefinition,
      hasUnsavedChanges: false
    }));
  },

  discardChanges: () => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    set({
      canvasNodes: nodes,
      canvasEdges: edges,
      hasUnsavedChanges: false
    });
  }
}));
