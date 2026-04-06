import { useState } from 'react';
import { FormField } from '../components/FormField';
import type { CreateJourneyFormData } from '../types/journey.types';

interface JourneyFormProps {
  data: CreateJourneyFormData;
  onChange: (data: CreateJourneyFormData) => void;
  onSubmit: (data: CreateJourneyFormData) => void;
  loading?: boolean;
}

export function JourneyForm({ data, onChange, onSubmit, loading = false }: JourneyFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'journeyCode':
        if (!value.trim()) return 'Journey code is required';
        if (!/^[A-Z0-9_]+$/.test(value)) {
          return 'Journey code must contain only uppercase letters, numbers, and underscores';
        }
        if (value.length < 3) return 'Journey code must be at least 3 characters';
        if (value.length > 50) return 'Journey code must not exceed 50 characters';
        break;

      case 'name':
        if (!value.trim()) return 'Journey name is required';
        if (value.length < 3) return 'Journey name must be at least 3 characters';
        if (value.length > 200) return 'Journey name must not exceed 200 characters';
        break;

      case 'initialState':
        if (!value.trim()) return 'Initial state is required';
        if (!/^[A-Z0-9_]+$/.test(value)) {
          return 'State name must contain only uppercase letters, numbers, and underscores';
        }
        if (value.length > 100) return 'State name must not exceed 100 characters';
        break;

      default:
        return '';
    }

    return '';
  };

  const handleFieldChange = (name: string, value: string) => {
    const newFormData = { ...data, [name]: value };
    onChange(newFormData);
  };

  const handleFieldBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(data).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="journey-form">
      <FormField
        label="Journey Code"
        name="journeyCode"
        value={data.journeyCode}
        onChange={(value: string) => handleFieldChange('journeyCode', value)}
        onBlur={(value: string) => handleFieldBlur('journeyCode', value)}
        error={errors.journeyCode}
        required
        disabled={loading}
        placeholder="e.g., CUSTOMER_ONBOARDING"
        helperText="Unique identifier for the journey. Use uppercase letters, numbers, and underscores."
      />

      <FormField
        label="Journey Name"
        name="name"
        value={data.name}
        onChange={(value: string) => handleFieldChange('name', value)}
        onBlur={(value: string) => handleFieldBlur('name', value)}
        error={errors.name}
        required
        disabled={loading}
        placeholder="e.g., Customer Onboarding Process"
        helperText="Human-readable name for the journey."
      />

      <FormField
        label="Initial State"
        name="initialState"
        value={data.initialState}
        onChange={(value: string) => handleFieldChange('initialState', value)}
        onBlur={(value: string) => handleFieldBlur('initialState', value)}
        error={errors.initialState}
        required
        disabled={loading}
        placeholder="e.g., START"
        helperText="Name of the starting state for the journey. Use uppercase letters, numbers, and underscores."
      />

      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Journey'}
        </button>
      </div>
    </form>
  );
}
