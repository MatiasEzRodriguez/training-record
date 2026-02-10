/**
 * Storage utilities for data export/import
 */

/**
 * Export all app data to JSON file
 * @param {Object} data - The data to export
 * @param {string} filename - The filename for the download
 */
export function exportToFile(data, filename = 'workout-backup.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 * @param {File} file - The file to read
 * @returns {Promise<Object>} - The parsed JSON data
 */
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Validate imported data structure
 * @param {Object} data - The data to validate
 * @returns {boolean} - Whether the data is valid
 */
export function validateImportData(data) {
  if (!data || typeof data !== 'object') return false;
  
  // Check required fields exist (even if empty arrays)
  const hasWorkouts = Array.isArray(data.workouts);
  const hasRoutines = Array.isArray(data.routines);
  const hasExercises = Array.isArray(data.exercises);
  
  return hasWorkouts && hasRoutines && hasExercises;
}
