import React, { useState } from 'react';

interface Substance {
  name: string;
  formula: string;
  molarMass: number;
}

const SUBSTANCES: Substance[] = [
  { name: 'الكربون', formula: 'C', molarMass: 12.011 },
  { name: 'الحديد', formula: 'Fe', molarMass: 55.845 },
  { name: 'الماء', formula: 'H₂O', molarMass: 18.015 },
  { name: 'الأكسجين', formula: 'O₂', molarMass: 31.998 },
  { name: 'كلوريد الصوديوم', formula: 'NaCl', molarMass: 58.44 },
];

export default function MoleLabSim() {
  const [selectedSubstance, setSelectedSubstance] = useState<Substance>(SUBSTANCES[2]);
  const [moles, setMoles] = useState<number>(1);

  const mass = (moles * selectedSubstance.molarMass).toFixed(2);
  const particles = (moles * 6.022e23).toExponential(3);

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl" dir="rtl">
      <div className="text-center space-y-2 border-b border-slate-800 pb-4">
        <h2 className="text-3xl font-black text-red-500">مختبر المول والكتلة المولية ⚖️</h2>
        <p className="text-sm text-slate-400">احسب كميات المادة والكتلة وعدد الجسيمات وثابت أفوجادرو تفاعلياً.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">كمية المادة (عدد المولات):</span>
            <span className="px-3 py-1 bg-red-600 text-white rounded-lg font-mono font-bold">{moles} mol</span>
          </div>

          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={moles}
            onChange={(e) => setMoles(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">الكتلة الكلية (m):</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{mass} g</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">الكتلة المولية (M):</span>
              <span className="text-xl font-bold text-sky-400 font-mono">{selectedSubstance.molarMass} g/mol</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">عدد الجسيمات (N):</span>
              <span className="text-xl font-bold text-amber-400 font-mono">{particles}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 leading-relaxed text-center">
            💡 قانون الحساب: الكتلة <span className="font-mono text-emerald-400">(m = n × M)</span> وعدد الجسيمات <span className="font-mono text-amber-400">(N = n × N_A)</span> حيث ثابت أفوجادرو يساوي <span className="font-mono text-sky-400">6.022 × 10²³</span>.
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
          <span className="font-bold text-sm text-red-400 block mb-2">اختر المادة الكيميائية:</span>
          <div className="space-y-2">
            {SUBSTANCES.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubstance(sub)}
                className={`w-full p-3 rounded-xl font-bold text-sm flex justify-between items-center transition border ${
                  selectedSubstance.formula === sub.formula
                    ? 'bg-red-600 text-white border-red-500 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span>{sub.name} ({sub.formula})</span>
                <span className="text-xs font-mono opacity-80">{sub.molarMass} g/mol</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}