import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WorkoutLogger } from './pages/WorkoutLogger';
import { History } from './pages/History';
import { Routines } from './pages/Routines';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-32">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<WorkoutLogger />} />
        <Route path="/workout/:routineId" element={<WorkoutLogger />} />
        <Route path="/history" element={<History />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
