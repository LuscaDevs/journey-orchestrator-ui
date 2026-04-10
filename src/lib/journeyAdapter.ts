import type { JourneyDefinition } from '../types/journey';

export type JourneyStatus = "draft" | "published";

export interface Journey {
  id: string;
  code: string;
  name: string;
  version: string;
  status: JourneyStatus;
  createdAt: string;
  updatedAt: string;
  statesCount: number;
  transitionsCount: number;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function generateJourneyCode(index: number): string {
  return `JRN-${String(index + 1).padStart(3, "0")}`;
}

export function journeyDefinitionToJourney(definition: JourneyDefinition, index: number): Journey {
  const isDraft = definition.name.includes('(Cópia)');
  
  return {
    id: definition.id,
    code: generateJourneyCode(index),
    name: definition.name,
    version: `v${definition.version}.0.0`,
    status: isDraft ? "draft" : "published" as JourneyStatus,
    createdAt: definition.metadata.createdAt,
    updatedAt: definition.metadata.updatedAt,
    statesCount: definition.nodes.length,
    transitionsCount: definition.edges.length,
  };
}

export function journeyToJourneyDefinition(journey: Journey): Partial<JourneyDefinition> {
  return {
    id: journey.id,
    name: journey.name,
    version: parseInt(journey.version.split('.')[0]) || 1,
    metadata: {
      createdAt: journey.createdAt,
      updatedAt: journey.updatedAt,
    },
  };
}
