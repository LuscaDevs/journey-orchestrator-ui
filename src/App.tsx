import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard'
import JourneyEditorWithControls from './components/JourneyEditorWithControls'
import './App.css'

// Placeholder for JourneyDetailsPage - will be implemented in later tasks
const JourneyDetailsPage = () => <div>Journey Details Page</div>

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/editor" element={<JourneyEditorWithControls />} />
            <Route path="/journeys/:journeyCode" element={<JourneyDetailsPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App
