import type { Node, Edge } from 'reactflow';
import type { NodeData, EdgeData } from '../store/useJourneyStore';

// DSL structure matching backend journey-orchestrator
interface JourneyDefinition {
  journeyCode: string;
  name: string;
  version: number;
  states: State[];
  transitions: Transition[];
  initialState: State;
}

interface State {
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
}

interface Transition {
  from: string;
  to: string;
  event: string;
  condition?: string;
}

export const toDSL = (nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): JourneyDefinition => {
  // Find initial state
  const initialNode = nodes.find(node => node.data.type === 'INITIAL');
  if (!initialNode) {
    throw new Error('No initial state found in journey');
  }

  // Convert nodes to states
  const states: State[] = nodes.map(node => ({
    name: node.data.name,
    type: node.data.type
  }));

  // Convert edges to transitions
  const transitions: Transition[] = edges.map(edge => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);
    
    if (!sourceNode || !targetNode) {
      throw new Error('Invalid edge: source or target node not found');
    }

    if (!edge.data) {
      throw new Error('Edge data is undefined');
    }

    return {
      from: sourceNode.data.name,
      to: targetNode.data.name,
      event: edge.data.event || 'transition',
      condition: edge.data.condition
    };
  });

  const initialState: State = {
    name: initialNode.data.name,
    type: initialNode.data.type
  };

  return {
    journeyCode: `journey-${Date.now()}`,
    name: 'Visual Journey',
    version: 1,
    states,
    transitions,
    initialState
  };
};
