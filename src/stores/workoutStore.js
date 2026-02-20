import { create } from 'zustand';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase';

const id = () => Math.random().toString(36).substr(2, 9);

const WORKOUT_DRAFT_KEY = 'workout_draft';

const saveDraft = (workout) => {
  if (workout) {
    localStorage.setItem(WORKOUT_DRAFT_KEY, JSON.stringify(workout));
  } else {
    localStorage.removeItem(WORKOUT_DRAFT_KEY);
  }
};

const loadDraft = () => {
  try {
    const draft = localStorage.getItem(WORKOUT_DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch {
    return null;
  }
};

const clearDraft = () => localStorage.removeItem(WORKOUT_DRAFT_KEY);

export const useWorkoutStore = create((set, get) => ({
  // Estado
  workouts: [],
  routines: [],
  exercises: [],
  activeWorkout: null,
  loading: false,
  error: null,
  
  // Referencias a unsubscribers
  _unsubscribers: [],

  // Inicializar listeners de Firestore
  initializeFirestore: (userId) => {
    if (!userId) return;

    // Limpiar listeners anteriores
    get()._unsubscribers.forEach((unsub) => unsub());
    set({ _unsubscribers: [] });

    const userRef = doc(db, 'users', userId);
    const workoutsRef = collection(userRef, 'workouts');
    const routinesRef = collection(userRef, 'routines');
    const exercisesRef = collection(userRef, 'exercises');

    // Listener para workouts
    const workoutsQuery = query(workoutsRef, orderBy('date', 'desc'));
    const unsubWorkouts = onSnapshot(
      workoutsQuery,
      (snapshot) => {
        const workouts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        }));
        set({ workouts });
      },
      (error) => {
        console.error('Error loading workouts:', error);
        set({ error: 'Error cargando entrenamientos' });
      }
    );

    // Listener para routines
    const unsubRoutines = onSnapshot(
      routinesRef,
      (snapshot) => {
        const routines = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set({ routines });
      },
      (error) => {
        console.error('Error loading routines:', error);
      }
    );

    // Listener para exercises
    const unsubExercises = onSnapshot(
      exercisesRef,
      (snapshot) => {
        const exercises = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        set({ exercises });
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );

    set({
      _unsubscribers: [unsubWorkouts, unsubRoutines, unsubExercises],
    });
  },

  // Limpiar listeners
  cleanup: () => {
    get()._unsubscribers.forEach((unsub) => unsub());
    set({
      _unsubscribers: [],
      workouts: [],
      routines: [],
      exercises: [],
      activeWorkout: null,
    });
  },

  // Ejercicios
  addExercise: async (exercise, userId) => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'users', userId);
      const exercisesRef = collection(userRef, 'exercises');
      await addDoc(exercisesRef, {
        ...exercise,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      set({ error: 'Error guardando ejercicio' });
    }
  },

  removeExercise: async (exerciseId, userId) => {
    if (!userId) return;
    try {
      const exerciseRef = doc(db, 'users', userId, 'exercises', exerciseId);
      await deleteDoc(exerciseRef);
    } catch (error) {
      console.error('Error removing exercise:', error);
    }
  },

  // Rutinas
  addRoutine: async (routine, userId) => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'users', userId);
      const routinesRef = collection(userRef, 'routines');
      await addDoc(routinesRef, {
        ...routine,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding routine:', error);
      set({ error: 'Error guardando rutina' });
    }
  },

  removeRoutine: async (routineId, userId) => {
    if (!userId) return;
    try {
      const routineRef = doc(db, 'users', userId, 'routines', routineId);
      await deleteDoc(routineRef);
    } catch (error) {
      console.error('Error removing routine:', error);
    }
  },

  // Workouts
  startWorkout: (name = 'Entrenamiento Libre', routineId = null) => {
    const { routines = [], exercises = [] } = get();
    const routine = routineId ? routines.find((r) => r.id === routineId) : null;

    const workoutExercises = routine
      ? routine.exerciseIds
          .map((exerciseId) => {
            const exercise = exercises.find((e) => e.id === exerciseId);
            if (!exercise) return null;
            return {
              id: id(),
              exerciseId,
              name: exercise.name,
              sets: [],
            };
          })
          .filter(Boolean)
      : [];

    const newWorkout = {
      id: id(),
      name: routine?.name || name,
      date: new Date(),
      exercises: workoutExercises,
      duration: 0,
      notes: '',
    };

    saveDraft(newWorkout);
    set({ activeWorkout: newWorkout });
  },

  addExerciseToWorkout: (exerciseId) => {
    const { exercises, activeWorkout } = get();
    if (!activeWorkout) return;

    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: [
        ...activeWorkout.exercises,
        {
          id: id(),
          exerciseId,
          name: exercise.name,
          sets: [],
        },
      ],
    };

    saveDraft(updatedWorkout);
    set({ activeWorkout: updatedWorkout });
  },

  removeExerciseFromWorkout: (exerciseInstanceId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updatedWorkout = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter(
        (ex) => ex.id !== exerciseInstanceId
      ),
    };

    saveDraft(updatedWorkout);
    set({ activeWorkout: updatedWorkout });
  },

  addSet: (exerciseId, newSet) => {
    set((state) => {
      if (!state.activeWorkout) return state;

      const updatedWorkout = {
        ...state.activeWorkout,
        exercises: state.activeWorkout.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: [...(ex.sets || []), { ...newSet, id: id() }],
          };
        }),
      };

      saveDraft(updatedWorkout);
      return { activeWorkout: updatedWorkout };
    });
  },

  removeSet: (exerciseId, setId) =>
    set((state) => {
      if (!state.activeWorkout) return state;

      const updatedWorkout = {
        ...state.activeWorkout,
        exercises: state.activeWorkout.exercises.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: (ex.sets || []).filter((s) => s.id !== setId),
              }
            : ex
        ),
      };

      saveDraft(updatedWorkout);
      return { activeWorkout: updatedWorkout };
    }),

  completeWorkout: async (userId) => {
    const { activeWorkout } = get();
    if (!activeWorkout || !userId) return;

    const duration = Math.floor(
      (new Date() - new Date(activeWorkout.date)) / 1000 / 60
    );

    try {
      const userRef = doc(db, 'users', userId);
      const workoutsRef = collection(userRef, 'workouts');
      await addDoc(workoutsRef, {
        ...activeWorkout,
        duration,
        completedAt: serverTimestamp(),
      });
      clearDraft();
      set({ activeWorkout: null });
    } catch (error) {
      console.error('Error saving workout:', error);
      set({ error: 'Error guardando entrenamiento' });
    }
  },

  cancelWorkout: () => {
    clearDraft();
    set({ activeWorkout: null });
  },

  updateWorkoutNotes: (notes) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      const updatedWorkout = { ...state.activeWorkout, notes };
      saveDraft(updatedWorkout);
      return { activeWorkout: updatedWorkout };
    }),

  hasDraft: () => {
    return localStorage.getItem(WORKOUT_DRAFT_KEY) !== null;
  },

  restoreDraft: () => {
    const draft = loadDraft();
    if (draft) {
      draft.date = new Date(draft.date);
      set({ activeWorkout: draft });
    }
  },

  discardDraft: () => {
    clearDraft();
  },

  // Exportar datos (para backup)
  exportData: () =>
    JSON.stringify(
      {
        workouts: get().workouts,
        routines: get().routines,
        exercises: get().exercises,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    ),

  // Importar datos (batch write)
  importData: async (jsonString, userId) => {
    if (!userId) return false;
    try {
      const data = JSON.parse(jsonString);
      const batch = writeBatch(db);
      const userRef = doc(db, 'users', userId);

      if (data.workouts?.length) {
        const workoutsRef = collection(userRef, 'workouts');
        data.workouts.forEach((workout) => {
          const newDoc = doc(workoutsRef);
          batch.set(newDoc, {
            ...workout,
            importedAt: serverTimestamp(),
          });
        });
      }

      if (data.routines?.length) {
        const routinesRef = collection(userRef, 'routines');
        data.routines.forEach((routine) => {
          const newDoc = doc(routinesRef);
          batch.set(newDoc, {
            ...routine,
            importedAt: serverTimestamp(),
          });
        });
      }

      if (data.exercises?.length) {
        const exercisesRef = collection(userRef, 'exercises');
        data.exercises.forEach((exercise) => {
          const newDoc = doc(exercisesRef);
          batch.set(newDoc, {
            ...exercise,
            importedAt: serverTimestamp(),
          });
        });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // Computed getters
  getLastWorkout: () => {
    const { workouts } = get();
    return workouts.length > 0 ? workouts[0] : null;
  },

  getWorkoutCount: () => get().workouts.length,

  getTotalVolume: () => {
    return get().workouts.reduce((total, workout) => {
      const workoutVolume = workout.exercises.reduce((exTotal, ex) => {
        return (
          exTotal +
          (ex.sets || []).reduce((setTotal, set) => {
            return setTotal + (set.weight * set.reps || 0);
          }, 0)
        );
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
          if (
            !records[ex.name] ||
            set.weight > records[ex.name].weight ||
            (set.weight === records[ex.name].weight &&
              set.reps > records[ex.name].reps)
          ) {
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
}));
