# Agent Guidelines for Workout Tracker PWA

## Project Overview
React + Vite PWA for tracking workouts, optimized for mobile with dark theme.

## Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Run tests
npm test

# Run single test file
npm test -- src/components/ComponentName.test.jsx

# Run single test by name
npm test -- -t "test name pattern"
```

## Tech Stack
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (mobile-first)
- **Icons**: Lucide React
- **State**: Zustand
- **Storage**: localStorage
- **PWA**: vite-plugin-pwa

## Code Style

### Imports
```javascript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { create } from 'zustand';

// 3. Absolute imports from src
import { useWorkoutStore } from '@/stores/workoutStore';

// 4. Relative imports
import { ExerciseCard } from './ExerciseCard';

// 5. CSS last
import './WorkoutLogger.css';
```

### Component Structure
```javascript
// Functional components with named exports
export function ComponentName({ prop1, prop2 }) {
  // Hooks at top
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => { }, []);
  
  // Handlers
  const handleClick = () => { };
  
  // Render
  return (<div>...</div>);
}
```

### Naming Conventions
- **Components**: PascalCase (e.g., `WorkoutLogger.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWorkoutStore.js`)
- **Stores**: camelCase with `Store` suffix (e.g., `workoutStore.js`)
- **CSS**: Tailwind classes, no custom CSS files unless necessary
- **Constants**: UPPER_SNAKE_CASE

### Types (JSDoc)
```javascript
/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} [notes]
 */

/** @param {Exercise} exercise */
function displayExercise(exercise) { }
```

### Error Handling
```javascript
try {
  const data = JSON.parse(localStorage.getItem('workouts'));
} catch (error) {
  console.error('Failed to parse workouts:', error);
  return [];
}
```

## UI/UX Guidelines

### Mobile-First Design
- Minimum touch target: 44px x 44px
- Use `active:scale-95` for button feedback
- Bottom-safe padding for iOS: `pb-safe`

### Dark Theme (Default)
- Background: `bg-gray-950`
- Cards: `bg-gray-900`
- Primary: `bg-blue-600`
- Text: `text-gray-100`
- Secondary text: `text-gray-400`

### Tailwind Patterns
```jsx
// Card pattern
<div className="bg-gray-900 rounded-xl p-4 border border-gray-800">

// Button pattern (large touch target)
<button className="w-full py-4 px-6 bg-blue-600 rounded-xl font-semibold
  active:scale-95 transition-transform min-h-[56px]">

// Bottom nav pattern
<nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t 
  border-gray-800 pb-safe">
```

## State Management (Zustand)
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      workouts: [],
      
      // Actions
      addWorkout: (workout) => 
        set((state) => ({ workouts: [...state.workouts, workout] })),
      
      // Computed (use getters)
      getWorkoutCount: () => get().workouts.length,
    }),
    { name: 'workout-storage' }
  )
);
```

## File Structure
```
src/
  components/        # Reusable UI components
  pages/            # Route components
  stores/           # Zustand stores
  hooks/            # Custom hooks
  utils/            # Helpers
  constants/        # Static data
  assets/           # Images, icons
```

## PWA Requirements
- All icons in `/public/icons/`
- `manifest.json` configured
- Service worker for offline support
- `base: '/repo-name/'` in vite.config.js for GitHub Pages

## GitHub Pages Deployment
Ensure `vite.config.js` has:
```javascript
export default {
  base: '/training-record/',
  plugins: [/* ... */],
}
```
