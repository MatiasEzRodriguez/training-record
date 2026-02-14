import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useWorkoutStore } from '@/stores/workoutStore';
import { Dashboard } from '@/pages/Dashboard';
import { WorkoutLogger } from '@/pages/WorkoutLogger';
import { History } from '@/pages/History';
import { Routines } from '@/pages/Routines';
import { Login } from '@/pages/Login';
import { BottomNav } from '@/components/BottomNav';

function AppContent() {
  const { user, loading } = useAuth();
  const initializeFirestore = useWorkoutStore((state) => state.initializeFirestore);
  const cleanup = useWorkoutStore((state) => state.cleanup);

  // Inicializar Firestore cuando hay usuario autenticado
  useEffect(() => {
    if (user?.uid) {
      initializeFirestore(user.uid);
    }
    return () => cleanup();
  }, [user?.uid, initializeFirestore, cleanup]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
