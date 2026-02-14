import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, History, Plus, Trophy, X, Zap, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Dashboard() {
  const navigate = useNavigate();
  const [showPRs, setShowPRs] = useState(false);
  const [showWorkoutOptions, setShowWorkoutOptions] = useState(false);

  const lastWorkout = useWorkoutStore((state) => state.getLastWorkout());
  const topPR = useWorkoutStore((state) => state.getTopPersonalRecord());
  const personalRecords = useWorkoutStore((state) => state.getPersonalRecords());
  const routines = useWorkoutStore((state) => state.routines);

  const handleStartWorkout = (routineId = null) => {
    setShowWorkoutOptions(false);
    if (routineId) {
      navigate(`/workout/${routineId}`);
    } else {
      navigate('/workout');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-white">Workout Tracker</h1>
        <p className="text-gray-400 mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Start Workout Button */}
      <button
        onClick={() => setShowWorkoutOptions(true)}
        className="w-full py-6 px-8 bg-blue-600 rounded-2xl font-bold text-lg
          active:scale-95 transition-transform min-h-[80px] flex items-center 
          justify-center gap-3 shadow-lg shadow-blue-900/50"
      >
        <Dumbbell className="w-6 h-6" />
        Iniciar Entrenamiento
      </button>

      {/* Personal Records */}
      <button
        onClick={() => setShowPRs(true)}
        className="w-full bg-gray-900 rounded-xl p-4 border border-gray-800 text-left
          active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-2 text-yellow-500 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">Personal Records</span>
        </div>
        {topPR ? (
          <div>
            <p className="text-xl font-bold">{topPR.exerciseName}</p>
            <p className="text-2xl font-bold text-yellow-500">
              {topPR.weight} kg × {topPR.reps} reps
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Sin registros aún</p>
        )}
      </button>

      {/* Last Workout */}
      {lastWorkout && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Último Entrenamiento</h2>
          <div className="space-y-2">
            <p className="font-medium">{lastWorkout.name}</p>
            <p className="text-sm text-gray-400">
              {format(new Date(lastWorkout.date), "d 'de' MMMM, HH:mm", { locale: es })}
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-400">
                {lastWorkout.exercises.length} ejercicios
              </span>
              <span className="text-gray-400">
                {lastWorkout.duration} min
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/routines')}
            className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-left
              active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 mb-2 text-blue-500" />
            <p className="font-medium">Nueva Rutina</p>
            <p className="text-xs text-gray-400 mt-1">Crear rutina personalizada</p>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-left
              active:scale-95 transition-transform"
          >
            <History className="w-5 h-5 mb-2 text-green-500" />
            <p className="font-medium">Ver Historial</p>
            <p className="text-xs text-gray-400 mt-1">Revisar entrenamientos</p>
          </button>
        </div>
      </div>

      {/* Workout Options Modal */}
      {showWorkoutOptions && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Iniciar Entrenamiento</h2>
              <button
                onClick={() => setShowWorkoutOptions(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Free Workout Option */}
              <button
                onClick={() => handleStartWorkout()}
                className="w-full bg-blue-600 rounded-xl p-4 flex items-center justify-between
                  active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-200" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">Entrenamiento Libre</p>
                    <p className="text-sm text-blue-200">Sin rutina predefinida</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-blue-200" />
              </button>

              {/* Divider */}
              {routines.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-gray-400 mb-3 px-1">Tus Rutinas</p>
                  <div className="space-y-2">
                    {routines.map((routine) => (
                      <button
                        key={routine.id}
                        onClick={() => handleStartWorkout(routine.id)}
                        className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between
                          active:scale-95 transition-transform border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{routine.name}</p>
                            <p className="text-sm text-gray-400">
                              {routine.exerciseIds?.length || 0} ejercicios
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No routines message */}
              {routines.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p className="text-sm">No tienes rutinas guardadas</p>
                  <button
                    onClick={() => {
                      setShowWorkoutOptions(false);
                      navigate('/routines');
                    }}
                    className="mt-2 text-blue-500 text-sm font-medium"
                  >
                    Crear tu primera rutina →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRs Modal */}
      {showPRs && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold">Personal Records</h2>
              </div>
              <button
                onClick={() => setShowPRs(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {personalRecords.length > 0 ? (
              <div className="space-y-3">
                {personalRecords.map((pr, index) => (
                  <div
                    key={pr.exerciseName}
                    className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-600/20 text-orange-600' :
                          'bg-gray-700 text-gray-500'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{pr.exerciseName}</p>
                        <p className="text-sm text-gray-400">
                          {format(new Date(pr.date), "d MMM yyyy", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-500">
                        {pr.weight} kg
                      </p>
                      <p className="text-sm text-gray-400">{pr.reps} reps</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Aún no tienes personal records</p>
                <p className="text-sm mt-2">Completa tu primer entrenamiento</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
