import { v4 as uuidv4 } from 'uuid';
import type { Node, Edge } from 'reactflow';
import type { JourneyDefinition, JourneyNode, JourneyEdge } from '../types/journey';

export const toJourneyDefinition = (
  nodes: Node[],
  edges: Edge[],
  name: string,
  existingDefinition?: JourneyDefinition,
  isSavedDefinition?: boolean
): JourneyDefinition => {
  const now = new Date().toISOString();

  const journeyNodes: JourneyNode[] = nodes.map(node => ({
    id: node.id,
    name: node.data.name,
    type: node.data.type,
    position: {
      x: node.position.x,
      y: node.position.y
    }
  }));

  const journeyEdges: JourneyEdge[] = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    event: edge.data?.event || 'transition',
    condition: edge.data?.condition
  }));

  return {
    id: existingDefinition?.id || uuidv4(),
    name,
    version: isSavedDefinition && existingDefinition ? existingDefinition.version + 1 : (existingDefinition?.version || 1),
    nodes: journeyNodes,
    edges: journeyEdges,
    metadata: {
      createdAt: existingDefinition?.metadata.createdAt || now,
      updatedAt: now
    },
    active: existingDefinition?.active ?? false
  };
};

export const fromJourneyDefinition = (definition: JourneyDefinition): {
  nodes: Node[];
  edges: Edge[];
} => {
  const nodes: Node[] = definition.nodes.map(journeyNode => ({
    id: journeyNode.id,
    type: 'stateNode',
    position: {
      x: journeyNode.position.x,
      y: journeyNode.position.y
    },
    data: {
      name: journeyNode.name,
      type: journeyNode.type
    }
  }));

  const edges: Edge[] = definition.edges.map(journeyEdge => ({
    id: journeyEdge.id,
    source: journeyEdge.source,
    target: journeyEdge.target,
    type: 'transition',
    data: {
      event: journeyEdge.event,
      condition: journeyEdge.condition
    }
  }));

  return { nodes, edges };
};
