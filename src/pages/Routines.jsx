import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Trash2, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAuth } from '@/hooks/useAuth';
import { DEFAULT_EXERCISES } from '@/constants/exercises';

export function Routines() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const { 
    routines, 
    exercises, 
    addRoutine, 
    addExercise, 
    removeRoutine 
  } = useWorkoutStore();

  // Initialize default exercises if empty (only once after Firestore loads)
  useEffect(() => {
    // Esperar un momento para que Firestore cargue los datos primero
    const timer = setTimeout(() => {
      if (exercises.length === 0 && user?.uid && !isInitializing) {
        setIsInitializing(true);
        DEFAULT_EXERCISES.forEach((ex) => {
          addExercise(ex, user.uid);
        });
      }
    }, 1000); // Esperar 1 segundo para que Firestore cargue

    return () => clearTimeout(timer);
  }, [exercises.length, user?.uid, addExercise, isInitializing]);

  const handleCreateRoutine = () => {
    if (routineName.trim() && selectedExercises.length > 0 && user?.uid) {
      addRoutine({
        name: routineName.trim(),
        exerciseIds: selectedExercises,
      }, user.uid);
      setRoutineName('');
      setSelectedExercises([]);
      setShowNewRoutine(false);
    }
  };

  const handleCreateExercise = () => {
    if (exerciseName.trim() && exerciseCategory.trim() && user?.uid) {
      addExercise({
        name: exerciseName.trim(),
        category: exerciseCategory.trim(),
      }, user.uid);
      setExerciseName('');
      setExerciseCategory('');
      setShowNewExercise(false);
    }
  };

  const handleRemoveRoutine = (routineId) => {
    if (user?.uid) {
      removeRoutine(routineId, user.uid);
    }
  };

  const toggleExercise = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Agrupar ejercicios por categoría
  const exercisesByCategory = exercises.reduce((acc, exercise) => {
    const category = exercise.category || 'Otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(exercise);
    return acc;
  }, {});

  // Ordenar categorías alfabéticamente
  const sortedCategories = Object.keys(exercisesByCategory).sort();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Rutinas y Ejercicios</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Start Section */}
        <button
          onClick={() => navigate('/workout')}
          className="w-full py-4 px-6 bg-blue-600 rounded-xl font-semibold
            active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Entrenamiento Libre
        </button>

        {/* My Routines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Mis Rutinas</h2>
            <button
              onClick={() => setShowNewRoutine(true)}
              className="p-2 bg-blue-600 rounded-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {routines.length === 0 ? (
            <p className="text-gray-400 text-sm">No tienes rutinas guardadas</p>
          ) : (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-gray-900 rounded-xl p-4 border border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{routine.name}</h3>
                      <p className="text-sm text-gray-400">
                        {routine.exerciseIds?.length || 0} ejercicios
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/workout/${routine.id}`)}
                        className="p-3 bg-blue-600 rounded-xl active:scale-95 transition-transform"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveRoutine(routine.id)}
                        className="p-3 bg-red-600/20 text-red-400 rounded-xl 
                          active:scale-95 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Database */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Base de Ejercicios</h2>
            <button
              onClick={() => setShowNewExercise(true)}
              className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center gap-3 bg-gray-900 rounded-xl p-3 
                  border border-gray-800"
              >
                <Dumbbell className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-sm text-gray-400">{exercise.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Routine Modal */}
      {showNewRoutine && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-gray-900 rounded-t-2xl p-4 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Nueva Rutina</h2>
            
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Nombre de la rutina"
              className="w-full bg-gray-800 rounded-xl p-4 mb-4 text-lg
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <h3 className="font-semibold mb-2">Selecciona ejercicios:</h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-auto">
              {sortedCategories.map((category) => {
                const categoryExercises = exercisesByCategory[category];
                const selectedInCategory = categoryExercises.filter((ex) =>
                  selectedExercises.includes(ex.id)
                ).length;

                return (
                  <div key={category} className="bg-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full p-4 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
                    >
                      <span className="font-semibold">{category}</span>
                      <div className="flex items-center gap-2">
                        {selectedInCategory > 0 && (
                          <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                            {selectedInCategory}
                          </span>
                        )}
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
                        {categoryExercises
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((exercise) => (
                            <button
                              key={exercise.id}
                              onClick={() => toggleExercise(exercise.id)}
                              className={`w-full p-4 text-left transition-colors border-b border-gray-700/50 last:border-b-0
                                ${selectedExercises.includes(exercise.id)
                                  ? 'bg-blue-600/40 hover:bg-blue-600/50'
                                  : 'bg-gray-800 hover:bg-gray-750'
                                }`}
                            >
                              <p className="font-medium">{exercise.name}</p>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewRoutine(false);
                  setRoutineName('');
                  setSelectedExercises([]);
                }}
                className="flex-1 py-4 bg-gray-800 rounded-xl font-medium
                  active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRoutine}
                disabled={!routineName.trim() || selectedExercises.length === 0}
                className="flex-1 py-4 bg-blue-600 rounded-xl font-medium
                  active:scale-95 transition-transform disabled:opacity-50 
                  disabled:cursor-not-allowed"
              >
                Crear Rutina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Exercise Modal */}
      {showNewExercise && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">Nuevo Ejercicio</h2>
            
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Nombre del ejercicio"
              className="w-full bg-gray-800 rounded-xl p-4 mb-3
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <select
              value={exerciseCategory}
              onChange={(e) => setExerciseCategory(e.target.value)}
              className="w-full bg-gray-800 rounded-xl p-4 mb-4
                focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Pecho">Pecho</option>
              <option value="Espalda">Espalda</option>
              <option value="Piernas">Piernas</option>
              <option value="Hombros">Hombros</option>
              <option value="Bíceps">Bíceps</option>
              <option value="Tríceps">Tríceps</option>
              <option value="Core">Core</option>
              <option value="Cardio">Cardio</option>
              <option value="Otro">Otro</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewExercise(false);
                  setExerciseName('');
                  setExerciseCategory('');
                }}
                className="flex-1 py-4 bg-gray-800 rounded-xl font-medium
                  active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateExercise}
                disabled={!exerciseName.trim() || !exerciseCategory}
                className="flex-1 py-4 bg-blue-600 rounded-xl font-medium
                  active:scale-95 transition-transform disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
