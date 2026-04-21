import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { JourneyDefinition } from '../types/journey';
import { toJourneyDefinition, fromJourneyDefinition } from '../utils/journeyConversion';
import { toApiRequest, fromApiResponse } from '../utils/journeyApiMapper';
import { createJourneyDefinition, updateJourneyDefinition, deleteJourneyDefinition, listJourneyDefinitions, getJourneyDefinitionById } from '../services/journeyService';
import type { Node, Edge } from 'reactflow';

interface JourneyDefinitionState {
  currentDefinition: JourneyDefinition | null;
  initialDefinition: JourneyDefinition | null; // Store initial state for comparison
  definitions: JourneyDefinition[];
  hasUnsavedChanges: boolean;
  isInitializing: boolean; // Flag to prevent updates during initialization
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isNewJourney: boolean; // Track if this is a newly created journey not yet persisted
}

interface JourneyDefinitionActions {
  setCurrentDefinition: (definition: JourneyDefinition | null) => void;
  createDefinition: (name: string) => void;
  updateDefinition: (name: string) => void;
  deleteDefinition: (id: string) => void;
  loadDefinition: (definition: JourneyDefinition) => void;
  loadDefinitionsFromAPI: () => Promise<void>;
  updateCurrentDefinition: (nodes: Node[], edges: Edge[]) => void;
  saveCurrentDefinition: () => void;
  discardChanges: () => void;
  clearError: () => void;
  clearSuccess: () => void;
  hasActualChanges: () => boolean;
  // Derived state helpers
  getNodes: () => Node[];
  getEdges: () => Edge[];
  getSelectedNode: () => Node | null;
  getSelectedEdge: () => Edge | null;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  addNode: (name?: string, nodeType?: 'INITIAL' | 'INTERMEDIATE' | 'FINAL') => void;
  removeNode: (nodeId: string) => void;
  addEdge: (source: string, target: string, event?: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNodeName: (nodeId: string, newName: string) => void;
  updateEdgeName: (edgeId: string, newName: string) => void;
  updateEdgeConditions: (edgeId: string, conditions: string) => void;
}

export const useJourneyDefinitionStore = create<JourneyDefinitionState & JourneyDefinitionActions>((set, get) => ({
  currentDefinition: null,
  initialDefinition: null,
  definitions: [],
  hasUnsavedChanges: false,
  isInitializing: false,
  selectedNodeId: null,
  selectedEdgeId: null,
  isLoading: false,
  error: null,
  success: null,
  isNewJourney: false,

  setCurrentDefinition: (definition) => {
    set({ 
      currentDefinition: definition,
      hasUnsavedChanges: false 
    });
  },

  createDefinition: async (name) => {
    set({ isLoading: true, error: null });
    try {
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
        hasUnsavedChanges: true, // Mark as unsaved since it's not persisted yet
        isNewJourney: true, // Mark as new journey that needs to be persisted
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create definition',
        isLoading: false 
      });
    }
  },

  updateDefinition: async (name) => {
    const { currentDefinition, definitions } = get();
    if (!currentDefinition) return;

    set({ isLoading: true, error: null });
    try {
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

      // Convert to API request and call API
      const apiRequest = toApiRequest(updatedDefinition);
      const apiResponse = isNewDefinition 
        ? await createJourneyDefinition(apiRequest)
        : await updateJourneyDefinition(currentDefinition.id, apiRequest);

      // Convert API response back to domain model
      const persistedDefinition = fromApiResponse(apiResponse);

      set((state) => ({
        definitions: isNewDefinition 
          ? [...state.definitions, persistedDefinition] // Add to list if new
          : state.definitions.map(def => // Update existing if not new
              def.id === persistedDefinition.id ? persistedDefinition : def
            ),
        currentDefinition: persistedDefinition,
        initialDefinition: JSON.parse(JSON.stringify(persistedDefinition)),
        hasUnsavedChanges: false,
        isLoading: false
      }));
    } catch (error: any) {
      // Extract error code and message from API response if available
      let errorMessage = 'Failed to update definition';
      if (error.response?.data?.errorCode) {
        errorMessage = error.response.data.errorCode;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  deleteDefinition: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteJourneyDefinition(id);
      set((state) => {
        const newDefinitions = state.definitions.filter(def => def.id !== id);
        const shouldClearCurrent = state.currentDefinition?.id === id;
        
        return {
          definitions: newDefinitions,
          currentDefinition: shouldClearCurrent ? null : state.currentDefinition,
          hasUnsavedChanges: false,
          isLoading: false
        };
      });
    } catch (error: any) {
      // Extract error code and message from API response if available
      let errorMessage = 'Failed to delete definition';
      if (error.response?.data?.errorCode) {
        errorMessage = error.response.data.errorCode;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  loadDefinition: (definition) => {
    set({
      currentDefinition: definition,
      initialDefinition: JSON.parse(JSON.stringify(definition)),
      hasUnsavedChanges: false,
      isNewJourney: false, // This is an existing journey, not new
      isInitializing: true // Set to true to prevent sync changes during load
    });
    
    // Clear initialization flag after a short delay to allow React Flow to settle
    setTimeout(() => {
      set({ isInitializing: false });
    }, 100);
  },

  loadDefinitionsFromAPI: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiResponses = await listJourneyDefinitions();
      const definitions = apiResponses.map(fromApiResponse);
      
      set({
        definitions,
        isLoading: false
      });
    } catch (error: any) {
      // Extract error code and message from API response if available
      let errorMessage = 'Failed to load definitions';
      if (error.response?.data?.errorCode) {
        errorMessage = error.response.data.errorCode;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
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
    
    // Create copies for comparison without metadata that might change on selection
    const currentCopy = {
      ...currentDefinition,
      metadata: {
        ...currentDefinition.metadata,
        updatedAt: initialDefinition.metadata.updatedAt // Ignore updatedAt differences
      }
    };
    
    const initialCopy = {
      ...initialDefinition,
      metadata: {
        ...initialDefinition.metadata,
        updatedAt: initialDefinition.metadata.updatedAt
      }
    };
    
    // Deep comparison ignoring selection-related changes
    const currentStr = JSON.stringify(currentCopy);
    const initialStr = JSON.stringify(initialCopy);
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

    // Get current React Flow nodes/edges for comparison
    const currentReactFlowNodes = fromJourneyDefinition(currentDefinition).nodes;
    const currentReactFlowEdges = fromJourneyDefinition(currentDefinition).edges;
    
    // Compare React Flow format nodes/edges to detect actual changes
    const nodesEqual = JSON.stringify(currentReactFlowNodes) === JSON.stringify(nodes);
    const edgesEqual = JSON.stringify(currentReactFlowEdges) === JSON.stringify(edges);
    
    if (nodesEqual && edgesEqual) {
      console.log('updateCurrentDefinition: skipping - only selection changed');
      return;
    }

    const updatedDefinition = toJourneyDefinition(
      nodes,
      edges,
      currentDefinition.name,
      currentDefinition,
      false // Don't increment version on real-time updates
    );

    set({
      currentDefinition: updatedDefinition,
      hasUnsavedChanges: true
    });
  },

  saveCurrentDefinition: async () => {
    const { currentDefinition, isNewJourney } = get();
    if (!currentDefinition) return;

    set({ isLoading: true, error: null, success: null });
    try {
      const apiRequest = toApiRequest(currentDefinition);
      
      // Use isNewJourney flag to determine if we should create or update
      const apiResponse = isNewJourney 
        ? await createJourneyDefinition(apiRequest)
        : await updateJourneyDefinition(currentDefinition.id, apiRequest);
      
      const persistedDefinition = fromApiResponse(apiResponse);

      set((state) => ({
        definitions: isNewJourney 
          ? [...state.definitions, persistedDefinition]
          : state.definitions.map(def => def.id === persistedDefinition.id ? persistedDefinition : def),
        currentDefinition: persistedDefinition,
        initialDefinition: JSON.parse(JSON.stringify(persistedDefinition)),
        hasUnsavedChanges: false,
        isLoading: false,
        success: 'Jornada salva com sucesso!',
        isNewJourney: false // Journey is now persisted
      }));
    } catch (error: any) {
      // Extract error code and message from API response if available
      let errorMessage = 'Failed to save definition';
      if (error.response?.data?.errorCode) {
        // Include both error code and detail for better error handling
        errorMessage = error.response.data.errorCode;
        if (error.response.data.detail) {
          errorMessage = `${error.response.data.errorCode}|${error.response.data.detail}`;
        }
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
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

  clearError: () => {
    set({ error: null });
  },

  clearSuccess: () => {
    set({ success: null });
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
    const { selectedNodeId, getNodes } = get();
    if (!selectedNodeId) return null;
    const nodes = getNodes();
    return nodes.find(node => node.id === selectedNodeId) || null;
  },

  getSelectedEdge: () => {
    const { selectedEdgeId, getEdges } = get();
    if (!selectedEdgeId) return null;
    const edges = getEdges();
    return edges.find(edge => edge.id === selectedEdgeId) || null;
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  setSelectedEdge: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
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
      type: 'transition' as const,
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

  updateEdgeName: (edgeId, newName) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const updatedEdges = edges.map((edge) =>
      edge.id === edgeId
        ? { ...edge, data: { ...edge.data, event: newName } }
        : edge
    );
    
    get().updateCurrentDefinition(nodes, updatedEdges);
  },

  updateEdgeConditions: (edgeId, conditions) => {
    const { currentDefinition } = get();
    if (!currentDefinition) return;

    const { nodes, edges } = fromJourneyDefinition(currentDefinition);
    const updatedEdges = edges.map((edge) =>
      edge.id === edgeId
        ? { ...edge, data: { ...edge.data, condition: conditions } }
        : edge
    );
    
    get().updateCurrentDefinition(nodes, updatedEdges);
  },
}));
