import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Clock,
  Timer,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { SetInput } from '@/components/SetInput';

export function WorkoutLogger() {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const [restTime, setRestTime] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Group exercises by category
  const exercisesByCategory = exercises.reduce((acc, exercise) => {
    const category = exercise.category || 'Otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(exercise);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const {
    activeWorkout,
    exercises,
    startWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSet,
    removeSet,
    completeWorkout,
    cancelWorkout,
    updateWorkoutNotes,
  } = useWorkoutStore();

  // Start workout if not active
  if (!activeWorkout) {
    startWorkout('Entrenamiento Libre', routineId);
    return null;
  }

  const handleAddSet = (exerciseId, reps, weight, isSingleDumbbell) => {
    console.log('handleAddSet called:', { exerciseId, reps, weight, isSingleDumbbell });
    addSet(exerciseId, { reps, weight, isSingleDumbbell, completed: true });
    
    // Show success feedback
    setShowSuccessFeedback(true);
    setTimeout(() => setShowSuccessFeedback(false), 1500);
    
    // Start rest timer
    if (restTime > 0) {
      setIsTimerRunning(true);
      let timeLeft = restTime;
      const timer = setInterval(() => {
        timeLeft -= 1;
        setRestTimer(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timer);
          setIsTimerRunning(false);
          setRestTimer(null);
        }
      }, 1000);
    }
  };

  const handleRemoveExercise = (exerciseId) => {
    if (confirm('¿Estás seguro de eliminar este ejercicio?')) {
      removeExerciseFromWorkout(exerciseId);
    }
  };

  const handleComplete = () => {
    completeWorkout();
    navigate('/');
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de cancelar este entrenamiento?')) {
      cancelWorkout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-lg truncate">{activeWorkout.name}</h1>
            <p className="text-sm text-gray-400">
              {activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} series
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 -mr-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Success Feedback */}
      {showSuccessFeedback && (
        <div className="bg-green-900/30 border-y border-green-800 px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400 font-medium">Serie agregada</span>
          </div>
        </div>
      )}

      {/* Rest Timer */}
      {isTimerRunning && restTimer !== null && (
        <div className="bg-blue-900/30 border-y border-blue-800 px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-mono font-bold text-blue-400">
              {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="p-4 space-y-6">
        {activeWorkout.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">
                    {exercise.sets.length} series completadas
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveExercise(exercise.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Eliminar ejercicio"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Sets List */}
            {exercise.sets.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-800">
                {exercise.sets.map((set, index) => (
                  <div 
                    key={set.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-gray-400 w-12">#{index + 1}</span>
                    <span className="flex-1 text-center">
                      {set.weight} kg × {set.reps} {set.isSingleDumbbell && '(1 mancuerna)'}
                    </span>
                    <button
                      onClick={() => removeSet(exercise.id, set.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Set */}
            <div className="p-4">
              <SetInput onSubmit={(reps, weight, isSingleDumbbell) => handleAddSet(exercise.id, reps, weight, isSingleDumbbell)} />
            </div>
          </div>
        ))}

        {/* Add Exercise Button */}
        <button
          onClick={() => setShowAddExercise(true)}
          className="w-full py-4 px-6 bg-gray-800 rounded-xl font-medium
            active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Ejercicio
        </button>

        {/* Rest Timer Settings */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Timer de Descanso</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="300"
              step="15"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-16 text-right">
              {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <label className="block text-sm font-medium mb-2">Notas</label>
          <textarea
            value={activeWorkout.notes}
            onChange={(e) => updateWorkoutNotes(e.target.value)}
            placeholder="Añade notas sobre el entrenamiento..."
            className="w-full bg-gray-800 rounded-lg p-3 text-sm resize-none
              placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={3}
          />
        </div>

        {/* Complete Button */}
        <button
          onClick={handleComplete}
          className="w-full py-4 px-6 bg-green-600 rounded-xl font-bold text-lg
            active:scale-95 transition-transform min-h-[56px] flex items-center 
            justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Finalizar Entrenamiento
        </button>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Seleccionar Ejercicio</h2>
              <button
                onClick={() => setShowAddExercise(false)}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
                <div key={category} className="bg-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-4 flex items-center justify-between text-left
                      active:scale-[0.98] transition-transform"
                  >
                    <span className="font-semibold text-lg">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{categoryExercises.length}</span>
                      {expandedCategories[category] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedCategories[category] && (
                    <div className="border-t border-gray-700">
                      {categoryExercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => {
                            addExerciseToWorkout(exercise.id);
                            setShowAddExercise(false);
                          }}
                          className="w-full p-4 text-left bg-gray-800 hover:bg-gray-750
                            active:bg-gray-700 transition-colors border-b border-gray-700/50
                            last:border-b-0"
                        >
                          <p className="font-medium">{exercise.name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
