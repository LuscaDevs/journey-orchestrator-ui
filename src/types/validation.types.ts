// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Validation Rule
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

// Field Validation Config
export interface FieldValidationConfig {
  [fieldName: string]: ValidationRule;
}

// Form Validation State
export interface FormValidationState {
  [fieldName: string]: {
    isValid: boolean;
    error?: string;
    touched: boolean;
  };
}

// Journey Code Validation
export interface JourneyCodeValidation {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

// Journey Name Validation
export interface JourneyNameValidation {
  isValid: boolean;
  error?: string;
  characterCount: number;
}

// State Name Validation
export interface StateNameValidation {
  isValid: boolean;
  error?: string;
  isUnique: boolean;
}

// Transition Validation
export interface TransitionValidation {
  isValid: boolean;
  error?: string;
  sourceStateExists: boolean;
  targetStateExists: boolean;
  eventNameUnique: boolean;
}

// Validation Error Codes
export const ValidationErrorCode = {
  REQUIRED: 'REQUIRED',
  INVALID_FORMAT: 'INVALID_FORMAT',
  TOO_SHORT: 'TOO_SHORT',
  TOO_LONG: 'TOO_LONG',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INVALID_CHARACTERS: 'INVALID_CHARACTERS',
  PATTERN_MISMATCH: 'PATTERN_MISMATCH',
  CUSTOM_ERROR: 'CUSTOM_ERROR',
} as const;

export type ValidationErrorCode = typeof ValidationErrorCode[keyof typeof ValidationErrorCode];
