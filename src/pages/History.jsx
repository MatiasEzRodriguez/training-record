import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Dumbbell, Clock } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function History() {
  const navigate = useNavigate();
  const workouts = useWorkoutStore((state) => state.workouts);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Historial</h1>
        </div>
      </div>

      {/* Workouts List */}
      <div className="p-4 space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No hay entrenamientos registrados</p>
            <button
              onClick={() => navigate('/workout')}
              className="mt-4 text-blue-500 font-medium"
            >
              Iniciar tu primer entrenamiento
            </button>
          </div>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{workout.name}</h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(workout.date), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatDuration(workout.duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{workout.exercises.length} ejercicios</span>
                </div>
                <div>
                  {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} series
                </div>
              </div>

              {/* Exercises Preview */}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <div className="space-y-2">
                  {workout.exercises.slice(0, 3).map((ex) => (
                    <div key={ex.id}>
                      <p className="text-sm font-medium text-gray-300">{ex.name}</p>
                      {ex.sets.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {ex.sets.map((set, idx) => (
                            <span key={set.id}>
                              {set.weight}kg×{set.reps}{set.isSingleDumbbell ? '(1)' : ''}
                              {idx < ex.sets.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{workout.exercises.length - 3} ejercicios más
                    </p>
                  )}
                </div>
              </div>

              {workout.notes && (
                <p className="mt-3 text-sm text-gray-500 italic">
                  &ldquo;{workout.notes}&rdquo;
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
