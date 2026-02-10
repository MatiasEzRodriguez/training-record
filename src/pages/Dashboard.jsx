import { useNavigate } from 'react-router-dom';
import { Dumbbell, History, Plus, TrendingUp } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Dashboard() {
  const navigate = useNavigate();
  const lastWorkout = useWorkoutStore((state) => state.getLastWorkout());
  const workoutCount = useWorkoutStore((state) => state.getWorkoutCount());
  const totalVolume = useWorkoutStore((state) => state.getTotalVolume());

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
        onClick={() => navigate('/workout')}
        className="w-full py-6 px-8 bg-blue-600 rounded-2xl font-bold text-lg
          active:scale-95 transition-transform min-h-[80px] flex items-center 
          justify-center gap-3 shadow-lg shadow-blue-900/50"
      >
        <Dumbbell className="w-6 h-6" />
        Iniciar Entrenamiento
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <History className="w-4 h-4" />
            <span className="text-sm">Entrenamientos</span>
          </div>
          <p className="text-2xl font-bold">{workoutCount}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Volumen Total</span>
          </div>
          <p className="text-2xl font-bold">{totalVolume.toLocaleString()} kg</p>
        </div>
      </div>

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
    </div>
  );
}
