import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import GrammarCorrectionApp from "./pages/Grammer-correct/GrammerPage";
import AudioRecorder from "./pages/AudioToText";
import CalendarPage from "./pages/calendar/CalendarPage";
import DataSummarizer from './pages/data summarizer/DataSummarizer';
import Login from "./pages/auth/Login";
import Signup from './pages/auth/SignUp';
import Dashboardd from './pages/dashboard/Dashboard';
// import HomePage from "./pages/HomePage"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Require Authentication) */}
        <Route element={<ProtectedRoute />}>
        {/* <Route path="/" element={<DataSummarizer />} /> */}
        <Route path="/dashboard" element={<Dashboardd />} />
          {/* <Route path="/grammar-correction" element={<GrammarCorrectionApp />} />
          <Route path="/audio-recorder" element={<AudioRecorder />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/data-summarizer" element={<DataSummarizer />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
