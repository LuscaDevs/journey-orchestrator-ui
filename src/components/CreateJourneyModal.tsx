import { useState } from 'react';
import { JourneyForm } from '../components/JourneyForm';
import type { CreateJourneyFormData } from '../types/journey.types';

interface CreateJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJourneyFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  initialData?: Partial<CreateJourneyFormData>;
}

export function CreateJourneyModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error,
  initialData,
}: CreateJourneyModalProps) {
  const [formData, setFormData] = useState<CreateJourneyFormData>({
    journeyCode: initialData?.journeyCode || '',
    name: initialData?.name || '',
    initialState: initialData?.initialState || '',
  });

  const handleSubmit = async (data: CreateJourneyFormData) => {
    try {
      await onSubmit(data);
      // Reset form on successful submission
      setFormData({
        journeyCode: '',
        name: '',
        initialState: '',
      });
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">Create Journey Definition</h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="modal-error">
              <p>{error}</p>
            </div>
          )}

          <JourneyForm
            data={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
