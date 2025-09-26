// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Welcome from "./pages/Welcome";
import ProjectCreation from "./pages/ProjectCreation";
import Preview from "./pages/Preview";
import ChatLLM from "./pages/ChatLLM";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection par défaut vers login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Pages d'authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Pages principales */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project-creation" element={<ProjectCreation />} />
        <Route path="/ChatLLM" element={<ChatLLM />} />
        <Route path="/preview" element={<Preview />} />
        
        {/* Routes alternatives pour compatibilité */}
        <Route path="/create-project" element={<Navigate to="/project-creation" replace />} />
        
        {/* Route 404 - rediriger vers login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;