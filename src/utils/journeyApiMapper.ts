import type { JourneyDefinition } from '../types/journey';
import type { CreateJourneyDefinitionRequest, JourneyDefinitionResponse, State, TransitionResponse, StatePosition } from '../api';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maps frontend JourneyDefinition to backend CreateJourneyDefinitionRequest
 */
export const toApiRequest = (definition: JourneyDefinition): CreateJourneyDefinitionRequest => {
  // Map nodes to states
  const states: State[] = definition.nodes.map(node => {
    const position: StatePosition | undefined = node.position ? {
      x: node.position.x,
      y: node.position.y
    } : undefined;

    return {
      id: node.id || undefined, // Allow API to auto-generate if not provided
      name: node.name,
      type: node.type as any, // Type matches between frontend and backend
      position
    };
  });

  // Create a map from node ID to node name for legacy field mapping
  const nodeIdToName = new Map<string, string>();
  definition.nodes.forEach(node => {
    if (node.id) {
      nodeIdToName.set(node.id, node.name);
    }
  });

  // Map edges to transitions
  const transitions = definition.edges.map(edge => ({
    source: nodeIdToName.get(edge.source) || edge.source, // Legacy name-based reference (use name if available)
    target: nodeIdToName.get(edge.target) || edge.target, // Legacy name-based reference (use name if available)
    sourceStateId: edge.source, // New ID-based reference
    targetStateId: edge.target, // New ID-based reference
    event: edge.event,
    condition: edge.condition
  }));

  return {
    journeyCode: definition.id, // Use definition id as journeyCode
    name: definition.name,
    version: definition.version,
    states,
    transitions
  };
};

/**
 * Maps backend JourneyDefinitionResponse to frontend JourneyDefinition
 */
export const fromApiResponse = (response: JourneyDefinitionResponse): JourneyDefinition => {
  // Map states to nodes
  const nodes = (response.states || []).map(state => ({
    id: state.id || uuidv4(), // Use backend ID or generate fallback
    name: state.name,
    type: (state.type as any) || 'INTERMEDIATE',
    position: state.position ? {
      x: state.position.x,
      y: state.position.y
    } : { x: 0, y: 0 } // Default position if not provided
  }));

  // Map transitions to edges
  const edges = (response.transitions || []).map(transition => ({
    id: uuidv4(), // Generate edge ID since backend doesn't provide one
    source: transition.sourceStateId || transition.source || '', // Prefer ID, fallback to name
    target: transition.targetStateId || transition.target || '', // Prefer ID, fallback to name
    event: transition.event || 'transition',
    condition: transition.condition
  }));

  return {
    id: response.id || uuidv4(),
    name: response.name || '',
    version: response.version || 1,
    nodes,
    edges,
    metadata: {
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    active: response.active || false
  };
};
