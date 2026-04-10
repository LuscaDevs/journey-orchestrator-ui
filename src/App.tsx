import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { JourneyDefinitionsPage } from './pages/JourneyDefinitionsPage'
import JourneyEditorWithControls from './components/JourneyEditorWithControls'
import './App.css'

// Placeholder for JourneyDetailsPage - will be implemented in later tasks
const JourneyDetailsPage = () => <div>Journey Details Page</div>

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="app-nav">
          <h1>Journey Orchestrator</h1>
          <a href="/journey-definitions">Journey Definitions</a>
          <a href="/editor">Visual Editor</a>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/journey-definitions" element={<JourneyDefinitionsPage />} />
            <Route path="/editor" element={<JourneyEditorWithControls />} />
            <Route path="/journeys/:journeyCode" element={<JourneyDetailsPage />} />
            <Route path="/" element={<JourneyDefinitionsPage />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
