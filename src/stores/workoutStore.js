import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
          exercises: [...state.exercises, { ...exercise, id: uuidv4() }],
        })),
      
      removeExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),
      
      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, { ...routine, id: uuidv4() }],
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
                id: uuidv4(),
                exerciseId,
                name: exercise?.name || 'Ejercicio',
                sets: [],
              };
            })
          : [];
        
        set({
          activeWorkout: {
            id: uuidv4(),
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
                id: uuidv4(),
                exerciseId,
                name: exercise.name,
                sets: [],
              },
            ],
          },
        }));
      },
      
      addSet: (exerciseId, set) =>
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map((ex) =>
              ex.id === exerciseId
                ? { ...ex, sets: [...ex.sets, { ...set, id: uuidv4() }] }
                : ex
            ),
          },
        })),
      
      removeSet: (exerciseId, setId) =>
        set((state) => ({
          activeWorkout: {
            ...state.activeWorkout,
            exercises: state.activeWorkout.exercises.map((ex) =>
              ex.id === exerciseId
                ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
                : ex
            ),
          },
        })),
      
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
        set((state) => ({
          activeWorkout: { ...state.activeWorkout, notes },
        })),
      
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
    }
  )
);
