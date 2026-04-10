import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { JourneyDefinition } from '../types/journey';
import { toJourneyDefinition, fromJourneyDefinition } from '../utils/journeyConversion';
import type { Node, Edge } from 'reactflow';

interface JourneyDefinitionState {
  currentDefinition: JourneyDefinition | null;
  definitions: JourneyDefinition[];
  hasUnsavedChanges: boolean;
}

interface JourneyDefinitionActions {
  setCurrentDefinition: (definition: JourneyDefinition | null) => void;
  createDefinition: (name: string) => void;
  updateDefinition: (name: string) => void;
  deleteDefinition: (id: string) => void;
  loadDefinition: (definition: JourneyDefinition) => void;
  updateCurrentDefinition: (nodes: Node[], edges: Edge[]) => void;
  saveCurrentDefinition: () => void;
  discardChanges: () => void;
  // Derived state helpers
  getNodes: () => Node[];
  getEdges: () => Edge[];
  getSelectedNode: () => string | null;
  getSelectedEdge: () => string | null;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  addNode: (name?: string, nodeType?: 'INITIAL' | 'INTERMEDIATE' | 'FINAL') => void;
  removeNode: (nodeId: string) => void;
  addEdge: (source: string, target: string, event?: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNodeName: (nodeId: string, newName: string) => void;
}

export const useJourneyDefinitionStore = create<JourneyDefinitionState & JourneyDefinitionActions>((set, get) => ({
  currentDefinition: null,
  definitions: [],
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
      hasUnsavedChanges: true // Mark as unsaved since it's not in the list yet
    }));
  },

  updateDefinition: (name) => {
    const { currentDefinition, definitions } = get();
    if (!currentDefinition) return;

    // Get current nodes and edges from currentDefinition
    const { nodes, edges } = fromJourneyDefinition(currentDefinition);

    // Check if this is the first time saving (not in definitions list yet)
    const isNewDefinition = !definitions.some(def => def.id === currentDefinition.id);
    
    const updatedDefinition = toJourneyDefinition(
      nodes,
      edges,
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
        hasUnsavedChanges: false
      };
    });
  },

  loadDefinition: (definition) => {
    set({
      currentDefinition: definition,
      hasUnsavedChanges: false
    });
  },

  updateCurrentDefinition: (nodes, edges) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const updatedDefinition = toJourneyDefinition(
      nodes,
      edges,
      currentDefinition.name,
      currentDefinition,
      false // Don't increment version for canvas updates
    );

    set((state) => ({
      currentDefinition: updatedDefinition,
      hasUnsavedChanges: true
    }));
  },

  saveCurrentDefinition: () => {
    const { currentDefinition, definitions } = get();
    if (!currentDefinition) return;

    set((state) => ({
      definitions: state.definitions.some(def => def.id === currentDefinition.id)
        ? state.definitions.map(def => def.id === currentDefinition.id ? currentDefinition : def)
        : [...state.definitions, currentDefinition],
      hasUnsavedChanges: false
    }));
  },

  discardChanges: () => {
    const { currentDefinition, definitions } = get();
    if (!currentDefinition) return;

    const originalDefinition = definitions.find(def => def.id === currentDefinition.id);
    if (originalDefinition) {
      set({
        currentDefinition: originalDefinition,
        hasUnsavedChanges: false
      });
    }
  },

  // Derived state helpers
  getNodes: () => {
    const { currentDefinition } = get();
    if (!currentDefinition) return [];
    return fromJourneyDefinition(currentDefinition).nodes;
  },

  getEdges: () => {
    const { currentDefinition } = get();
    if (!currentDefinition) return [];
    return fromJourneyDefinition(currentDefinition).edges;
  },

  getSelectedNode: () => {
    // This would need to be tracked in currentDefinition metadata or separate state
    return null; // Simplified for now
  },

  getSelectedEdge: () => {
    // This would need to be tracked in currentDefinition metadata or separate state
    return null; // Simplified for now
  },

  setSelectedNode: (nodeId) => {
    // Store selection in currentDefinition metadata or separate state
    // Simplified for now
  },

  setSelectedEdge: (edgeId) => {
    // Store selection in currentDefinition metadata or separate state
    // Simplified for now
  },

  addNode: (name = 'Novo Estado', nodeType: 'INITIAL' | 'INTERMEDIATE' | 'FINAL' = 'INTERMEDIATE') => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    // Check for existing initial or final states
    if (nodeType === 'INITIAL') {
      const existingInitial = currentDefinition.nodes.some(node => node.type === 'INITIAL');
      if (existingInitial) {
        console.warn('Já existe um estado inicial. Apenas um estado inicial é permitido.');
        return;
      }
    }

    if (nodeType === 'FINAL') {
      const existingFinal = currentDefinition.nodes.some(node => node.type === 'FINAL');
      if (existingFinal) {
        console.warn('Já existe um estado final. Apenas um estado final é permitido.');
        return;
      }
    }

    const newNode = {
      id: uuidv4(),
      type: 'stateNode' as const,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { 
        name,
        type: nodeType 
      },
    };

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const updatedNodes = [...nodes, newNode];
    
    get().updateCurrentDefinition(updatedNodes, edges);
  },

  removeNode: (nodeId) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const filteredNodes = nodes.filter((node) => node.id !== nodeId);
    const filteredEdges = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
    
    get().updateCurrentDefinition(filteredNodes, filteredEdges);
  },

  addEdge: (source, target, event = 'transition') => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const newEdge = {
      id: uuidv4(),
      source,
      target,
      type: 'smoothstep' as const,
      data: {
        event,
      },
    };

    const updatedEdges = [...edges, newEdge];
    get().updateCurrentDefinition(nodes, updatedEdges);
  },

  removeEdge: (edgeId) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const filteredEdges = edges.filter((edge) => edge.id !== edgeId);
    
    get().updateCurrentDefinition(nodes, filteredEdges);
  },

  updateNodeName: (nodeId, newName) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, name: newName } }
        : node
    );
    
    get().updateCurrentDefinition(updatedNodes, edges);
  },
}));
