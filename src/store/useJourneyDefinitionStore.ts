import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { JourneyDefinition } from '../types/journey';
import { toJourneyDefinition, fromJourneyDefinition } from '../utils/journeyConversion';
import type { Node, Edge } from 'reactflow';

interface JourneyDefinitionState {
  currentDefinition: JourneyDefinition | null;
  initialDefinition: JourneyDefinition | null; // Store initial state for comparison
  definitions: JourneyDefinition[];
  hasUnsavedChanges: boolean;
  isInitializing: boolean; // Flag to prevent updates during initialization
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
  hasActualChanges: () => boolean;
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
  initialDefinition: null,
  definitions: [],
  hasUnsavedChanges: false,
  isInitializing: false,

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
      },
      status: 'draft'
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
      initialDefinition: JSON.parse(JSON.stringify(definition)), // Deep copy
      hasUnsavedChanges: false,
      isInitializing: true // Set initialization flag
    });
    
    // Clear initialization flag after a short delay to allow React Flow to settle
    setTimeout(() => {
      set({ isInitializing: false });
    }, 100);
  },

  // Function to check if there are actual changes
  hasActualChanges: () => {
    const { currentDefinition, initialDefinition } = get();
    console.log('hasActualChanges called:', { 
      hasCurrent: !!currentDefinition, 
      hasInitial: !!initialDefinition,
      currentId: currentDefinition?.id,
      initialId: initialDefinition?.id
    });
    
    if (!currentDefinition || !initialDefinition) {
      console.log('hasActualChanges: missing definitions, returning false');
      return false;
    }
    
    // Deep comparison of current vs initial state
    const currentStr = JSON.stringify(currentDefinition);
    const initialStr = JSON.stringify(initialDefinition);
    const hasChanges = currentStr !== initialStr;
    
    console.log('hasActualChanges result:', hasChanges);
    console.log('Current length:', currentStr.length, 'Initial length:', initialStr.length);
    
    return hasChanges;
  },

  updateCurrentDefinition: (nodes, edges) => {
    const { currentDefinition, isInitializing } = get();
    console.log('updateCurrentDefinition called:', { 
      nodesCount: nodes.length, 
      edgesCount: edges.length,
      hasCurrentDefinition: !!currentDefinition,
      isInitializing
    });
    
    // Skip updates during initialization
    if (isInitializing) {
      console.log('updateCurrentDefinition: skipping due to initialization');
      return;
    }
    
    if (!currentDefinition) return;

    const updatedDefinition = toJourneyDefinition(
      nodes,
      edges,
      currentDefinition.name,
      currentDefinition,
      false // Don't increment version for canvas updates
    );

    console.log('updateCurrentDefinition: updating store');
    set((state) => ({
      currentDefinition: updatedDefinition,
      hasUnsavedChanges: true // Will be checked properly on exit
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
        alert('Já existe um estado inicial. Apenas um estado inicial é permitido.');
        return;
      }
    }

    if (nodeType === 'FINAL') {
      const existingFinal = currentDefinition.nodes.some(node => node.type === 'FINAL');
      if (existingFinal) {
        alert('Já existe um estado final. Apenas um estado final é permitido.');
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
