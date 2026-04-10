import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Node, Edge } from 'reactflow';

// Enhanced node data structure
export interface NodeData {
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
}

// Enhanced edge data structure  
export interface EdgeData {
  event: string;
  condition?: string;
}

interface JourneyState {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  selectedNode: string | null;
  selectedEdge: string | null;
}

interface JourneyActions {
  addNode: (name?: string, nodeType?: 'INITIAL' | 'INTERMEDIATE' | 'FINAL') => void;
  removeNode: (nodeId: string) => void;
  addEdge: (source: string, target: string, event?: string) => void;
  removeEdge: (edgeId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  updateNodeName: (nodeId: string, newName: string) => void;
}

export const useJourneyStore = create<JourneyState & JourneyActions>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,

  addNode: (name = 'Novo Estado', nodeType: 'INITIAL' | 'INTERMEDIATE' | 'FINAL' = 'INTERMEDIATE') => {
    // Check for existing initial or final states
    if (nodeType === 'INITIAL') {
      const existingInitial = get().nodes.some(node => node.data.type === 'INITIAL');
      if (existingInitial) {
        console.warn('Já existe um estado inicial. Apenas um estado inicial é permitido.');
        return;
      }
    }

    if (nodeType === 'FINAL') {
      const existingFinal = get().nodes.some(node => node.data.type === 'FINAL');
      if (existingFinal) {
        console.warn('Já existe um estado final. Apenas um estado final é permitido.');
        return;
      }
    }

    const newNode: Node<NodeData> = {
      id: uuidv4(),
      type: 'stateNode',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { 
        name,
        type: nodeType 
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  removeNode: (nodeId: string) => {
    set((state) => {
      const filteredNodes = state.nodes.filter((node) => node.id !== nodeId);
      const filteredEdges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      
      return {
        nodes: filteredNodes,
        edges: filteredEdges,
        selectedNode: state.selectedNode === nodeId ? null : state.selectedNode,
        selectedEdge: state.selectedEdge && 
          filteredEdges.some(edge => edge.id === state.selectedEdge) 
          ? state.selectedEdge 
          : null,
      };
    });
  },

  addEdge: (source: string, target: string, event = 'transition') => {
    const newEdge: Edge<EdgeData> = {
      id: uuidv4(),
      source,
      target,
      type: 'smoothstep',
      data: {
        event,
      },
    };

    set((state) => ({
      edges: [...state.edges, newEdge],
    }));
  },

  removeEdge: (edgeId: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
      selectedEdge: state.selectedEdge === edgeId ? null : state.selectedEdge,
    }));
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  selectNode: (nodeId: string | null) => {
    console.log('selectNode called with:', nodeId);
    set({ selectedNode: nodeId, selectedEdge: null });
  },

  selectEdge: (edgeId: string | null) => {
    set({ selectedEdge: edgeId, selectedNode: null });
  },

  updateNodeName: (nodeId: string, newName: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, name: newName } }
          : node
      ),
    }));
  },
}));
