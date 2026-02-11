import { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';

export function SetInput({ onSubmit }) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isSingleDumbbell, setIsSingleDumbbell] = useState(false);

  const handleSubmit = () => {
    const repsNum = parseInt(reps, 10);
    const weightNum = parseFloat(weight);
    
    if (repsNum > 0 && weightNum >= 0) {
      onSubmit(repsNum, weightNum, isSingleDumbbell);
      setReps('');
      setWeight('');
      setIsSingleDumbbell(false);
    }
  };

  const adjustValue = (value, delta, setter, isFloat = false) => {
    const num = isFloat ? parseFloat(value) || 0 : parseInt(value, 10) || 0;
    let result;
    if (isFloat) {
      result = Math.max(0, Math.round((num + delta) * 10) / 10);
    } else {
      result = Math.max(0, num + delta);
    }
    setter(result.toString());
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Weight Input */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Peso total (kg)</label>
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => adjustValue(weight, -2.5, setWeight, true)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-20 bg-gray-800 rounded-lg p-2 text-center text-lg font-semibold
              focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
          <button
            onClick={() => adjustValue(weight, 2.5, setWeight, true)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reps Input */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Reps</label>
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => adjustValue(reps, -1, setReps)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="w-16 bg-gray-800 rounded-lg p-2 text-center text-lg font-semibold
              focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
          />
          <button
            onClick={() => adjustValue(reps, 1, setReps)}
            className="p-2 bg-gray-800 rounded-lg active:scale-95 transition-transform min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Single Dumbbell Checkbox */}
      <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer active:scale-95 transition-transform">
        <div className={`
          w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
          ${isSingleDumbbell ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}
        `}>
          {isSingleDumbbell && <Check className="w-4 h-4 text-white" />}
        </div>
        <input
          type="checkbox"
          checked={isSingleDumbbell}
          onChange={(e) => setIsSingleDumbbell(e.target.checked)}
          className="sr-only"
        />
        <span className="text-sm text-gray-300">Una sola mancuerna</span>
      </label>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!reps || !weight}
        className="w-full py-4 bg-blue-600 rounded-xl active:scale-95 transition-transform
          disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]
          flex items-center justify-center gap-2 font-semibold"
      >
        <Plus className="w-6 h-6" />
        Agregar serie
      </button>
    </div>
  );
}
