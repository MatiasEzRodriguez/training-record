import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function SetInput({ onSubmit }) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = () => {
    const repsNum = parseInt(reps, 10);
    const weightNum = parseFloat(weight);
    
    if (repsNum > 0 && weightNum >= 0) {
      onSubmit(repsNum, weightNum);
      setReps('');
      setWeight('');
    }
  };

  const adjustValue = (value, delta, setter) => {
    const num = parseInt(value, 10) || 0;
    setter(Math.max(0, num + delta).toString());
  };

  return (
    <div className="flex items-center gap-3">
      {/* Weight Input */}
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">Peso (kg)</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustValue(weight, -2.5, setWeight)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="flex-1 bg-gray-800 rounded-lg p-3 text-center text-lg
              focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[48px]"
          />
          <button
            onClick={() => adjustValue(weight, 2.5, setWeight)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reps Input */}
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">Reps</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustValue(reps, -1, setReps)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="flex-1 bg-gray-800 rounded-lg p-3 text-center text-lg
              focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[48px]"
          />
          <button
            onClick={() => adjustValue(reps, 1, setReps)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!reps || !weight}
        className="mt-5 p-3 bg-blue-600 rounded-xl active:scale-95 transition-transform
          disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px]
          flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
