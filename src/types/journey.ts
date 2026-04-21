import { v4 as uuidv4 } from 'uuid';

export interface JourneyNode {
  id: string;
  name: string;
  type: 'INITIAL' | 'INTERMEDIATE' | 'FINAL';
  position: {
    x: number;
    y: number;
  };
}

export interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  event: string;
  condition?: string;
}

export interface JourneyDefinitionMetadata {
  createdAt: string;
  updatedAt: string;
}

export interface JourneyDefinition {
  id: string;
  journeyCode: string;
  name: string;
  version: number;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  metadata: JourneyDefinitionMetadata;
  status: 'ATIVA' | 'INATIVA' | 'RASCUNHO';
  isNew?: boolean; // Flag to indicate if this is a new journey not yet persisted
}
