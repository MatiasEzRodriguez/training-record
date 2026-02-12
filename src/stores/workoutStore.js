import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const id = () => Math.random().toString(36).substr(2, 9);

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
      workouts: [],
      routines: [],
      exercises: [],
      activeWorkout: null,
      
      addExercise: (exercise) =>
        set((state) => ({
          exercises: [...state.exercises, { ...exercise, id: id() }],
        })),
      
      removeExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),
      
      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, { ...routine, id: id() }],
        })),
      
      removeRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        })),
      
      startWorkout: (name = 'Entrenamiento Libre', routineId = null) => {
        const routine = routineId ? get().routines.find((r) => r.id === routineId) : null;
        
        const workoutExercises = routine
          ? routine.exerciseIds.map((exerciseId) => {
              const exercise = get().exercises.find((e) => e.id === exerciseId);
              return {
                id: id(),
                exerciseId,
                name: exercise?.name || 'Ejercicio',
                sets: [],
              };
            })
          : [];
        
        set({
          activeWorkout: {
            id: id(),
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
                id: id(),
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
      
      addSet: (exerciseId, newSet) => {
        set((state) => {
          if (!state.activeWorkout) return state;
          
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                return {
                  ...ex,
                  sets: [...(ex.sets || []), { ...newSet, id: id() }],
                };
              }),
            },
          };
        });
      },
      
      removeSet: (exerciseId, setId) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: state.activeWorkout.exercises.map((ex) =>
                ex.id === exerciseId
                  ? { ...ex, sets: (ex.sets || []).filter((s) => s.id !== setId) }
                  : ex
              ),
            },
          };
        }),
      
      completeWorkout: () => {
        const { activeWorkout } = get();
        if (!activeWorkout) return;
        
        const duration = Math.floor((new Date() - new Date(activeWorkout.date)) / 1000 / 60);
        
        set((state) => ({
          workouts: [{ ...activeWorkout, duration }, ...state.workouts],
          activeWorkout: null,
        }));
      },
      
      cancelWorkout: () => set({ activeWorkout: null }),
      
      updateWorkoutNotes: (notes) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          return { activeWorkout: { ...state.activeWorkout, notes } };
        }),
      
      exportData: () => JSON.stringify({
        workouts: get().workouts,
        routines: get().routines,
        exercises: get().exercises,
        exportDate: new Date().toISOString(),
      }, null, 2),
      
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
      
      getLastWorkout: () => {
        const { workouts } = get();
        return workouts.length > 0 ? workouts[0] : null;
      },
      
      getWorkoutCount: () => get().workouts.length,
      
      getTotalVolume: () => {
        return get().workouts.reduce((total, workout) => {
          const workoutVolume = workout.exercises.reduce((exTotal, ex) => {
            return exTotal + (ex.sets || []).reduce((setTotal, set) => {
              return setTotal + (set.weight * set.reps);
            }, 0);
          }, 0);
          return total + workoutVolume;
        }, 0);
      },
      
      getPersonalRecords: () => {
        const { workouts } = get();
        const records = {};
        
        workouts.forEach((workout) => {
          workout.exercises.forEach((ex) => {
            (ex.sets || []).forEach((set) => {
              if (!records[ex.name] || 
                  set.weight > records[ex.name].weight ||
                  (set.weight === records[ex.name].weight && set.reps > records[ex.name].reps)) {
                records[ex.name] = {
                  exerciseName: ex.name,
                  weight: set.weight,
                  reps: set.reps,
                  date: workout.date,
                };
              }
            });
          });
        });
        
        return Object.values(records).sort((a, b) => b.weight - a.weight);
      },
      
      getTopPersonalRecord: () => {
        const records = get().getPersonalRecords();
        return records.length > 0 ? records[0] : null;
      },
    }),
    {
      name: 'workout-storage-v3',
    }
  )
);
