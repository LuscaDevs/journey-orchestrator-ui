import { JourneyDefinitionsApi } from "../api";
import { apiConfig } from "./apiConfig";
import type { JourneyDefinitionResponse, CreateJourneyDefinitionRequest } from "../api/models";
import type { CreateJourneyDefinitionOperationRequest } from "../api/apis/JourneyDefinitionsApi";

const api = new JourneyDefinitionsApi(apiConfig);

export const createJourneyDefinition = (data: CreateJourneyDefinitionRequest) => {
    const request: CreateJourneyDefinitionOperationRequest = {
        createJourneyDefinitionRequest: data
    };
    return api.createJourneyDefinition(request);
};

export const listJourneyDefinitions = async (): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await api.listJourneyDefinitions();
        return response;
    } catch (error) {
        console.error('Error listing journey definitions:', error);
        throw error;
    }
};

export const getJourneyDefinitionsByCode = async (journeyCode: string): Promise<JourneyDefinitionResponse[]> => {
    try {
        const response = await api.getJourneyDefinitionsByCode({ journeyCode });
        return response;
    } catch (error) {
        console.error('Error getting journey definitions by code:', error);
        throw error;
    }
};