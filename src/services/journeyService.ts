import { JourneyDefinitionsApi, JourneyInstancesApi } from "../api";
import { apiConfig } from "./apiConfig";
import type { JourneyDefinitionResponse, CreateJourneyDefinitionRequest, JourneyInstanceResponse, UpdateStatusRequest } from "../api";

const definitionsApi = new JourneyDefinitionsApi(apiConfig);
const instancesApi = new JourneyInstancesApi(apiConfig);

export const createJourneyDefinition = async (data: CreateJourneyDefinitionRequest): Promise<JourneyDefinitionResponse> => {
    try {
        const response = await definitionsApi.createJourneyDefinition(data);
        return response.data;
    } catch (error) {
        console.error('Error creating journey definition:', error);
        throw error;
    }
};

export const listJourneyDefinitions = async (): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await definitionsApi.listJourneyDefinitions();
        return response.data;
    } catch (error) {
        console.error('Error listing journey definitions:', error);
        throw error;
    }
};

export const getJourneyDefinitionsByCode = async (journeyCode: string): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await definitionsApi.getJourneyDefinitionsByCode(journeyCode);
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
        const response = await definitionsApi.updateJourneyDefinition(id, data);
        return response.data;
    } catch (error) {
        console.error('Error updating journey definition:', error);
        throw error;
    }
};

/**
 * Update journey definition status by calling the PATCH endpoint
 */
export const updateJourneyDefinitionStatus = async (id: string, data: UpdateStatusRequest): Promise<JourneyDefinitionResponse> => {
    try {
        const response = await definitionsApi.updateJourneyDefinitionStatus(id, data);
        return response.data;
    } catch (error) {
        console.error('Error updating journey definition status:', error);
        throw error;
    }
};

/**
 * Delete a journey definition
 */
export const deleteJourneyDefinition = async (id: string): Promise<void> => {
    try {
        const response = await definitionsApi.deleteJourneyDefinition(id);
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
 * List all journey instances
 */
export const listJourneyInstances = async (): Promise<JourneyInstanceResponse[]> => {
    try {
        const response = await instancesApi.listJourneyInstances();
        return response.data;
    } catch (error) {
        console.error('Error listing journey instances:', error);
        throw error;
    }
};

/**
 * Get a specific journey instance by ID
 */
export const getJourneyInstance = async (instanceId: string): Promise<JourneyInstanceResponse> => {
    try {
        const response = await instancesApi.getJourneyInstance(instanceId);
        return response.data;
    } catch (error) {
        console.error('Error getting journey instance:', error);
        throw error;
    }
};