// Loading States
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
}

// Error States
export interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  errorCode?: string;
  retryable: boolean;
  retryCount: number;
}

// Component State Types
export interface JourneyDefinitionsPageState {
  journeys: any[];
  loading: boolean;
  error?: string;
  createModalOpen: boolean;
  searchQuery: string;
}

export interface CreateJourneyModalState {
  isOpen: boolean;
  loading: boolean;
  error?: string;
  formData: {
    journeyCode: string;
    name: string;
    initialState: string;
  };
  validationErrors: Record<string, string>;
}

export interface JourneyDetailsPageState {
  journey: any;
  loading: boolean;
  error?: string;
}

// Modal Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Form Field Props
export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}

// Button Props
export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

// Card Props
export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

// List Props
export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRetry?: () => void;
}

// Navigation Props
export interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  items: NavigationItem[];
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}
