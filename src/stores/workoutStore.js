import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple ID generator to replace uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Set
 * @property {string} id
 * @property {number} reps
 * @property {number} weight
 * @property {boolean} completed
 * @property {string} [notes]
 */

/**
 * @typedef {Object} WorkoutExercise
 * @property {string} id
 * @property {string} exerciseId
 * @property {string} name
 * @property {Set[]} sets
 */

/**
 * @typedef {Object} Workout
 * @property {string} id
 * @property {string} name
 * @property {Date} date
 * @property {WorkoutExercise[]} exercises
 * @property {number} duration
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Routine
 * @property {string} id
 * @property {string} name
 * @property {string[]} exerciseIds
 * @property {string} [notes]
 */

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      // State
      workouts: [],
      routines: [],
      exercises: [],
      activeWorkout: null,
      
      // Actions
      addExercise: (exercise) =>
        set((state) => ({
          exercises: [...state.exercises, { ...exercise, id: generateId() }],
        })),
      
      removeExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),
      
      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, { ...routine, id: generateId() }],
        })),
      
      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),
      
      startWorkout: (name = 'Entrenamiento Libre', routineId = null) => {
        const routine = routineId 
          ? get().routines.find((r) => r.id === routineId)
          : null;
        
        const workoutExercises = routine
          ? routine.exerciseIds.map((exerciseId) => {
              const exercise = get().exercises.find((e) => e.id === exerciseId);
              return {
                id: generateId(),
                exerciseId,
                name: exercise?.name || 'Ejercicio',
                sets: [],
              };
            })
          : [];
        
        set({
          activeWorkout: {
            id: generateId(),
            name,
            date: new Date(),
            exercises: workoutExercises,
            duration: 0,
            notes: '',
          },
        });
      },
      
      addExerciseToWorkout: (exerciseId) => {
        const exercise = get().exercises.find((e) => e.id === exerciseId);
        if (!exercise || !get().activeWorkout) return;
        
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [
              ...state.activeWorkout.exercises,
              {
                id: generateId(),
                exerciseId,
                name: exercise.name,
                sets: [],
              },
            ],
          },
        }));
      },
      
      removeExerciseFromWorkout: (exerciseId) => {
        if (!get().activeWorkout) return;
        
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.filter((ex) => ex.id !== exerciseId),
          },
        }));
      },
      
      addSet: (exerciseId, set) => {
        set((state) => {
          if (!state.activeWorkout || !Array.isArray(state.activeWorkout.exercises)) {
            return state;
          }
          
          const updatedExercises = state.activeWorkout.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            return {
              ...ex,
              sets: Array.isArray(ex.sets) 
                ? [...ex.sets, { ...set, id: generateId() }]
                : [{ ...set, id: generateId() }]
            };
          });
          
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: updatedExercises,
            },
          };
        });
      },
      
      removeSet: (exerciseId, setId) =>
        set((state) => {
          if (!state.activeWorkout || !Array.isArray(state.activeWorkout.exercises)) {
            return state;
          }
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.id === exerciseId && Array.isArray(ex.sets)
                  ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
                  : ex
              ),
            },
          };
        }),
      
      completeWorkout: () => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        
        const duration = Math.floor(
          (new Date() - new Date(activeWorkout.date)) / 1000 / 60
        );
        
        const completedWorkout = {
          ...activeWorkout,
          duration,
        };
        
        set((state) => ({
          workouts: [completedWorkout, ...state.workouts],
          activeWorkout: null,
        }));
      },
      
      cancelWorkout: () =>
        set({ activeWorkout: null }),
      
      updateWorkoutNotes: (notes) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: { ...state.activeWorkout, notes },
          };
        }),
      
      // Data export/import
      exportData: () => {
        const data = {
          workouts: get().workouts,
          routines: get().routines,
          exercises: get().exercises,
          exportDate: new Date().toISOString(),
        };
        return JSON.stringify(data, null, 2);
      },
      
      importData: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          if (data.workouts) set({ workouts: data.workouts });
          if (data.routines) set({ routines: data.routines });
          if (data.exercises) set({ exercises: data.exercises });
          return true;
        } catch (error) {
          console.error('Failed to import data:', error);
          return false;
        }
      },
      
      // Getters
      getLastWorkout: () => {
        const { workouts } = get();
        return workouts.length > 0 ? workouts[0] : null;
      },
      
      getWorkoutCount: () => get().workouts.length,
      
      getTotalVolume: () => {
        return get().workouts.reduce((total, workout) => {
          const workoutVolume = workout.exercises.reduce((exTotal, ex) => {
            return exTotal + ex.sets.reduce((setTotal, set) => {
              return setTotal + (set.weight * set.reps);
            }, 0);
          }, 0);
          return total + workoutVolume;
        }, 0);
      },
    }),
    {
      name: 'workout-storage',
      onRehydrateStorage: () => (state) => {
        // Convert date strings back to Date objects
        if (state && state.workouts) {
          state.workouts = state.workouts.map(workout => ({
            ...workout,
            date: new Date(workout.date),
          }));
        }
      },
    }
  )
);
