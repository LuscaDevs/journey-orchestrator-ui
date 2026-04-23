# Journey Orchestrator UI

A modern web application for managing and executing journey workflows in the Journey Orchestrator backend. The UI provides a visual interface for creating, editing, and monitoring journey definitions and instances with a powerful graph-based editor.

## 🏗️ Architecture

This project follows modern frontend architecture principles:

- **Specification-Driven Development (Spec First)**: Features defined in specifications before implementation
- **API Contract First**: All API integrations strictly follow the OpenAPI specification
- **Layered Architecture**: Page → Component → Service → API Client
- **Feature-Based Structure**: Source code organized by feature instead of technical layers
- **State Management**: Centralized state management with Zustand
- **Component Reusability**: Modular component architecture with Radix UI primitives

### Project Structure

```
journey-orchestrator-ui
├── src/
│   ├── api/                      # Generated API client from OpenAPI spec
│   ├── assets/                   # Static assets (images, fonts)
│   ├── components/               # Reusable UI components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── editor/              # Journey editor components
│   │   ├── ui/                  # UI primitives (buttons, inputs, etc.)
│   │   ├── CreateJourneyModal.tsx
│   │   ├── CustomNode.tsx
│   │   ├── JourneyDefinitionCard.tsx
│   │   ├── JourneyDefinitionList.tsx
│   │   ├── JourneyEditor.tsx
│   │   ├── JourneyForm.tsx
│   │   ├── StateNode.tsx
│   │   └── ...
│   ├── hooks/                    # Custom React hooks
│   ├── pages/                    # Page-level components
│   ├── services/                 # API service layer
│   │   ├── apiConfig.ts
│   │   └── journeyService.ts
│   ├── store/                    # Zustand state management
│   │   ├── useEditorStore.ts
│   │   ├── useJourneyDefinitionStore.ts
│   │   └── useJourneyStore.ts
│   ├── test/                     # Test utilities and mocks
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
├── api-contract/                 # OpenAPI specification (shared with backend)
├── docs/                         # Documentation
│   ├── constitution.md           # Project constitution
│   └── ui-architecture.md.md     # UI architecture documentation
├── features/                     # Feature specifications
│   └── journey-definitions-management/
│       ├── spec.md              # Feature specification
│       ├── plan.md              # Implementation plan
│       ├── tasks.md             # Actionable tasks
│       ├── research.md          # Research findings
│       └── quickstart.md        # Quick start guide
├── frontend-spec/                # Frontend-specific specifications
│   ├── journey-definitions.md
│   ├── instances/
│   └── journeys/
├── public/                       # Public static files
├── .env                          # Environment variables
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🚀 Features

### Journey Definitions Management
- **List Journey Definitions**: Browse all available journey definitions with filtering
- **Create Journey Definition**: Create new journey definitions with required fields
- **View Journey Details**: Navigate to detailed journey information
- **Empty State Handling**: Clear visual indication when no journeys exist
- **Error Handling**: User-friendly error messages with retry mechanisms

### Visual Journey Editor
- **Graph-Based Editor**: Visual workflow editor using React Flow
- **State Management**: Add, edit, and delete states with visual representation
- **Transition Creation**: Create transitions between states with drag-and-drop
- **Conditional Transitions**: Define conditions using SpEL expressions
- **Position Data**: Save and restore node positions for visual consistency
- **Real-time Validation**: Validate journey structure as you edit

### State Management
- **Journey Definition Store**: Centralized state for journey definitions
- **Editor Store**: Editor-specific state (nodes, edges, selection)
- **Journey Store**: Journey execution state and context
- **Reactive Updates**: Automatic UI updates on state changes

### API Integration
- **OpenAPI Generated Client**: Type-safe API client generated from OpenAPI spec
- **Service Layer**: Abstracted API calls through service layer
- **Error Handling**: Centralized error handling with toast notifications
- **Loading States**: Visual feedback during API operations

## 🛠️ Technology Stack

### Core Framework
- **React 19.2.4**: Latest React with concurrent features
- **TypeScript ~5.9.3**: Type-safe development
- **Vite 8.0.1**: Fast build tool and dev server

### UI Components & Styling
- **TailwindCSS 4.2.0**: Utility-first CSS framework
- **Radix UI**: Accessible UI component primitives
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-slot
- **Lucide React 1.8.0**: Icon library
- **React Hot Toast 2.6.0**: Toast notifications

### Graph Editor
- **React Flow 11.11.4**: Graph editor for journey visualization
- Custom node components for state representation
- Edge creation and management
- Layout persistence with position data

### State Management
- **Zustand 5.0.12**: Lightweight state management
- Multiple stores for different concerns
- DevTools integration

### Routing
- **React Router DOM 7.14.0**: Client-side routing
- Route-based code splitting
- Navigation guards

### API Integration
- **OpenAPI Generator CLI**: Generate TypeScript API client
- Axios-based HTTP client (generated)
- Type-safe API calls

### Development Tools
- **ESLint 9.39.4**: Code linting
- **Vitest 4.1.2**: Unit testing framework
- **@testing-library/react 16.3.2**: React component testing
- **PostCSS 8.5.9**: CSS processing
- **Autoprefixer 10.4.27**: CSS vendor prefixes

### Utilities
- **class-variance-authority 0.7.1**: Component variant management
- **clsx 2.1.1**: Conditional className utility
- **tailwind-merge 3.5.0**: Tailwind className merging
- **uuid 13.0.0**: UUID generation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn or pnpm
- Journey Orchestrator backend running on `http://localhost:8080`

### Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd journey-orchestrator-ui

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_JOURNEY_DEFINITIONS=true
```

### Generate API Client

```bash
# Generate TypeScript API client from OpenAPI spec
npm run generate-api
```

This generates the API client in `src/api/` from the backend's OpenAPI specification.

### Run Development Server

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build production bundle
npm run build
# or
yarn build
# or
pnpm build
```

The production files will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview production build
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 🧪 Testing

### Run Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📚 API Documentation

### Generated API Client

The API client is automatically generated from the OpenAPI specification located in the backend project at `api-spec/openapi.yaml`. The generated client provides:

- Type-safe API methods
- Request/response type definitions
- Automatic serialization/deserialization
- Error handling integration

### Service Layer

The service layer (`src/services/`) provides a clean abstraction over the generated API client:

```typescript
// Example service usage
import { journeyService } from './services/journeyService'

const journeys = await journeyService.listJourneyDefinitions()
```

## 🎯 Development Workflow

### Spec-Driven Development

All features follow specification-driven development:

1. **Create Specification**: Define feature in `features/` directory
2. **Design Contracts**: Define API contracts and data models
3. **Implement**: Build components and services
4. **Test**: Write unit and integration tests
5. **Validate**: Ensure compliance with specification

### Component Development

1. **Create Component**: Add component to appropriate directory
2. **Define Props**: Use TypeScript interfaces for props
3. **Implement Logic**: Follow Page → Component → Service → API pattern
4. **Add Tests**: Write unit tests with React Testing Library
5. **Document**: Add JSDoc comments for complex logic

### State Management

Use Zustand stores for state that:
- Needs to be shared across components
- Requires complex logic or transformations
- Should persist across route changes

For local component state, use React's `useState` and `useReducer` hooks.

### API Integration

1. **Update OpenAPI Spec**: Modify backend OpenAPI specification
2. **Regenerate Client**: Run `npm run generate-api`
3. **Update Service Layer**: Add service methods if needed
4. **Handle Errors**: Use toast notifications for user feedback
5. **Loading States**: Show loading indicators during API calls

## 🔧 Configuration

### Vite Configuration

Configuration is in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### TailwindCSS Configuration

Configuration is in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### TypeScript Configuration

TypeScript configuration uses project references:
- `tsconfig.json`: Root configuration
- `tsconfig.app.json`: Application code configuration
- `tsconfig.node.json`: Build tool configuration

## 📄 Documentation

### Project Documentation
- `docs/constitution.md` - Project constitution and principles
- `docs/ui-architecture.md.md` - UI architecture documentation

### Feature Specifications
- `features/journey-definitions-management/spec.md` - Journey definitions management specification
- `features/journey-definitions-management/plan.md` - Implementation plan
- `features/journey-definitions-management/tasks.md` - Actionable tasks

### Frontend Specifications
- `frontend-spec/journey-definitions.md` - Journey definitions UI specification
- `frontend-spec/journeys/` - Journey editor specifications
- `frontend-spec/instances/` - Journey instances specifications

## 🎨 UI Components

### Dashboard
Main landing page with:
- Journey definitions overview
- Quick actions
- Statistics and metrics

### Journey Editor
Visual graph editor with:
- State nodes (INITIAL, INTERMEDIATE, FINAL)
- Transition edges with conditions
- Drag-and-drop interface
- Zoom and pan controls
- Save and load functionality

### Journey Form
Form for creating/editing journeys:
- Journey name and code
- Version management
- Status selection
- State and transition management

### UI Primitives
Reusable components:
- FormField
- Button
- Input
- Select
- Modal
- LoadingSpinner
- EmptyState
- ErrorState

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Ensure the following environment variables are set in production:
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_ENABLE_JOURNEY_DEFINITIONS`: Feature flag

## 🤝 Contributing

This project follows specification-driven development. All features must:

1. Start with a specification in `features/`
2. Follow the layered architecture (Page → Component → Service → API)
3. Use TypeScript for type safety
4. Include comprehensive tests
5. Update documentation

See `docs/constitution.md` for detailed guidelines.

## 🔐 Security

- API client generated from OpenAPI specification ensures type safety
- Environment variables for sensitive configuration
- No hardcoded credentials in source code
- Input validation on forms
- Error messages don't expose sensitive information

## 📝 License

This project is licensed under the terms specified in the LICENSE file.

## 🔗 Related Projects

- **Journey Orchestrator Backend**: https://github.com/luscadevs/journey-orchestrator
- **OpenAPI Specification**: Located in backend project at `api-spec/openapi.yaml`

## 🙏 Acknowledgments

Built with modern React practices and best practices for scalable frontend applications.