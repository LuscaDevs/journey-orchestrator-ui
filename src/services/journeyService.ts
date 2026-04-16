import { JourneyDefinitionsApi } from "../api";
import { apiConfig } from "./apiConfig";
import type { JourneyDefinitionResponse, CreateJourneyDefinitionRequest } from "../api";

const api = new JourneyDefinitionsApi(apiConfig);

export const createJourneyDefinition = async (data: CreateJourneyDefinitionRequest): Promise<JourneyDefinitionResponse> => {
    try {
        const response = await api.createJourneyDefinition(data);
        return response.data;
    } catch (error) {
        console.error('Error creating journey definition:', error);
        throw error;
    }
};

export const listJourneyDefinitions = async (): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await api.listJourneyDefinitions();
        return response.data;
    } catch (error) {
        console.error('Error listing journey definitions:', error);
        throw error;
    }
};

export const getJourneyDefinitionsByCode = async (journeyCode: string): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await api.getJourneyDefinitionsByCode(journeyCode);
        return response.data;
    } catch (error) {
        console.error('Error getting journey definitions by code:', error);
        throw error;
    }
};

/**
 * Update a journey definition by calling the PUT endpoint
 */
export const updateJourneyDefinition = async (id: string, data: CreateJourneyDefinitionRequest): Promise<JourneyDefinitionResponse> => {
    try {
        const response = await api.updateJourneyDefinition(id, data);
        return response.data;
    } catch (error) {
        console.error('Error updating journey definition:', error);
        throw error;
    }
};

/**
 * Delete a journey definition
 */
export const deleteJourneyDefinition = async (id: string): Promise<void> => {
    try {
        const response = await api.deleteJourneyDefinition(id);
        return response.data;
    } catch (error) {
        console.error('Error deleting journey definition:', error);
        throw error;
    }
};

/**
 * Get a specific journey definition by ID
 * Fallback: Use list + filter
 */
export const getJourneyDefinitionById = async (id: string): Promise<JourneyDefinitionResponse | null> => {
    try {
        const allDefinitions = await listJourneyDefinitions();
        const definition = allDefinitions.find(def => def.id === id);
        return definition || null;
    } catch (error) {
        console.error('Error getting journey definition by ID:', error);
        throw error;
    }
};

/**
 * Publish a journey definition by setting active to true
 */
export const publishJourneyDefinition = async (id: string): Promise<JourneyDefinitionResponse> => {
    try {
        // First get the current definition
        const currentDefinition = await getJourneyDefinitionById(id);
        if (!currentDefinition) {
            throw new Error('Journey definition not found');
        }

        // Create update request with active set to true
        const updateRequest: CreateJourneyDefinitionRequest = {
            journeyCode: currentDefinition.journeyCode || '',
            name: currentDefinition.name || '',
            version: currentDefinition.version || 1,
            states: currentDefinition.states || [],
            transitions: (currentDefinition.transitions || []).map(transition => ({
                source: transition.source || '',
                target: transition.target || '',
                sourceStateId: transition.sourceStateId,
                targetStateId: transition.targetStateId,
                event: transition.event || 'transition',
                condition: transition.condition
            }))
        };

        // Update the definition
        const response = await api.updateJourneyDefinition(id, updateRequest);

        // The backend should set active to true by default when updating
        // If not, we might need a specific endpoint for this
        return response.data;
    } catch (error) {
        console.error('Error publishing journey definition:', error);
        throw error;
    }
};